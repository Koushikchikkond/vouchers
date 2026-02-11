import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Upload, Check, Loader2, Utensils, Plane, ShoppingBag, LogOut, FileText, Download, Calendar, X } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const CATEGORIES = [
    { id: 'TRAVEL', label: 'Travel', icon: Plane, color: 'bg-blue-100 text-blue-600' },
    { id: 'FOOD', label: 'Food', icon: Utensils, color: 'bg-orange-100 text-orange-600' },
    { id: 'PURCHASE', label: 'Purchase', icon: ShoppingBag, color: 'bg-purple-100 text-purple-600' },
    { id: 'LEAVING', label: 'Leaving', icon: LogOut, color: 'bg-red-100 text-red-600' },
];

export default function TransactionScreen({ node, mode, onBack }) {
    const { user } = useAuth();
    const [type, setType] = useState('IN'); // Default to IN as per Category visibility flow often used first
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
    const [reason, setReason] = useState('');
    const [category, setCategory] = useState(null);
    const [image, setImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [historyDates, setHistoryDates] = useState({ start: '', end: '' });
    const [historyData, setHistoryData] = useState(null);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const fileInputRef = useRef(null);

    const isRequestedMoney = mode === 'REQUESTED';

    const handleCategorySelect = (catId) => {
        setCategory(catId);
        if (isRequestedMoney && type === 'IN' && catId === 'FOOD') {
            setAmount('250');
        } else if (isRequestedMoney && type === 'IN' && amount === '250' && catId !== 'FOOD') {
            setAmount('');
        }
    };

    const handleTypeChange = (newType) => {
        setType(newType);
        setCategory(null); // Reset category when switching type
        if (isRequestedMoney && newType === 'IN' && category === 'FOOD') {
            setAmount('250');
        } else {
            // If not special case, don't clear amount immediately to be annoying, but maybe cleaner to clear?
            // Let's clear to avoid confusion.
            setAmount('');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("File too large (Max 5MB)");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async () => {
        if (!amount || !reason || !date) {
            alert("Please fill in Amount, Date, and Reason.");
            return;
        }
        if (type === 'IN' && !category) {
            alert("Please select a category.");
            return;
        }

        setSubmitting(true);
        try {
            await api.saveTransaction({
                user: user.username,
                node,
                type,
                amount: Number(amount),
                date,
                reason,
                category: type === 'IN' ? category : '', // Clear category for OUT
                image
            });
            alert("Transaction Saved Successfully!");
            // Reset
            setAmount('');
            setReason('');
            setCategory(null);
            setImage(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
            console.error(error);
            alert("Failed to save transaction. check console.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleFetchHistory = async () => {
        if (!historyDates.start || !historyDates.end) {
            alert("Select start and end dates.");
            return;
        }
        setLoadingHistory(true);
        try {
            const data = await api.getHistory(user.username, node, historyDates.start, historyDates.end);
            setHistoryData(data.transactions);
        } catch (e) {
            alert("Failed to fetch history");
        } finally {
            setLoadingHistory(false);
        }
    };

    const downloadPDF = () => {
        if (!historyData || historyData.length === 0) return;

        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Transaction History', 14, 20);

        // Add node name and date range
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Node: ${node}`, 14, 28);
        doc.text(`Period: ${historyDates.start} to ${historyDates.end}`, 14, 34);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 40);

        // Calculate totals
        const totalIn = historyData.filter(t => t.type === 'IN').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
        const totalOut = historyData.filter(t => t.type === 'OUT').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
        const balance = totalIn - totalOut;

        // Prepare table data
        const tableData = historyData.map((row, idx) => [
            idx + 1,
            row.date,
            row.type,
            `₹${parseFloat(row.amount || 0).toFixed(2)}`,
            row.reason,
            row.category || '-'
        ]);

        // Add table
        doc.autoTable({
            startY: 46,
            head: [['SL No', 'Date', 'Type', 'Amount', 'Reason', 'Category']],
            body: tableData,
            theme: 'grid',
            headStyles: {
                fillColor: [41, 128, 185],
                textColor: 255,
                fontStyle: 'bold',
                halign: 'center'
            },
            columnStyles: {
                0: { halign: 'center', cellWidth: 15 },
                1: { halign: 'center', cellWidth: 25 },
                2: { halign: 'center', cellWidth: 20 },
                3: { halign: 'right', cellWidth: 30 },
                4: { halign: 'left', cellWidth: 60 },
                5: { halign: 'center', cellWidth: 30 }
            },
            styles: {
                fontSize: 9,
                cellPadding: 3
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245]
            }
        });

        // Add summary at the bottom
        const finalY = doc.lastAutoTable.finalY + 10;
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Summary:', 14, finalY);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 150, 0);
        doc.text(`Total In: ₹${totalIn.toFixed(2)}`, 14, finalY + 7);

        doc.setTextColor(220, 53, 69);
        doc.text(`Total Out: ₹${totalOut.toFixed(2)}`, 14, finalY + 14);

        doc.setTextColor(0, 123, 255);
        doc.text(`Balance: ₹${balance.toFixed(2)}`, 14, finalY + 21);

        // Save PDF
        doc.save(`History_${node}_${historyDates.start}_${historyDates.end}.pdf`);
    };

    const isAmountReadOnly = isRequestedMoney && type === 'IN' && category === 'FOOD';

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900 pb-20">
            {/* Header */}
            <div className="bg-white sticky top-0 z-30 px-6 py-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-xl font-bold truncate max-w-[200px]">{node}</h2>
                        <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{mode}</span>
                    </div>
                </div>
                <button onClick={() => setShowHistory(true)} className="p-2 text-gray-500 hover:text-black">
                    <FileText size={24} />
                </button>
            </div>

            <div className="p-6 max-w-lg mx-auto w-full space-y-8">

                {/* Toggle IN/OUT */}
                <div className="flex bg-gray-200 p-1 rounded-2xl">
                    {['IN', 'OUT'].map((t) => (
                        <button
                            key={t}
                            onClick={() => handleTypeChange(t)}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${type === t
                                ? 'bg-white shadow-md text-black'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {/* Amount Input */}
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Amount</label>
                    <div className={`relative flex items-center bg-white rounded-2xl border-2 transition-colors overflow-hidden ${isAmountReadOnly ? 'bg-gray-100 border-gray-100' : 'border-transparent focus-within:border-black'}`}>
                        <span className="pl-6 text-xl font-bold text-gray-400">₹</span>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            readOnly={isAmountReadOnly}
                            placeholder="0.00"
                            className={`w-full p-6 pl-2 text-3xl font-bold outline-none bg-transparent ${isAmountReadOnly ? 'text-gray-500' : 'text-black'}`}
                        />
                    </div>
                    {isAmountReadOnly && <p className="text-xs text-orange-500 mt-2 font-medium">Fixed amount for Food advances.</p>}
                </div>

                {/* Date & Reason */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Date</label>
                        <div className="flex items-center bg-white rounded-xl p-4 border border-gray-100">
                            <Calendar size={20} className="text-gray-400 mr-3" />
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full outline-none font-medium text-lg bg-transparent"
                            />
                        </div>
                    </div>
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-gray-400 mb-2 uppercase tracking-wide">Reason</label>
                        <textarea
                            rows={2}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="What is this for?"
                            className="w-full bg-white rounded-xl p-4 border border-gray-100 outline-none font-medium text-lg resize-none focus:ring-2 focus:ring-black/5"
                        />
                    </div>
                </div>

                {/* Categories (Only IN) */}
                {type === 'IN' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                        <label className="block text-sm font-bold text-gray-400 mb-4 uppercase tracking-wide">Category</label>
                        <div className="grid grid-cols-4 gap-2">
                            {CATEGORIES.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => handleCategorySelect(cat.id)}
                                    className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all border-2 ${category === cat.id
                                        ? `border-current ${cat.color} bg-opacity-10`
                                        : 'bg-white border-transparent text-gray-400 hover:bg-gray-50'
                                        }`}
                                >
                                    <cat.icon size={24} className={`mb-2 ${category === cat.id ? 'opacity-100' : 'opacity-50'}`} />
                                    <span className="text-[10px] font-bold uppercase">{cat.label}</span>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Image Upload */}
                <div>
                    <label className="block text-sm font-bold text-gray-400 mb-3 uppercase tracking-wide">Receipt</label>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        className="hidden"
                        onChange={handleImageUpload}
                    />
                    {!image ? (
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-8 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-black hover:text-black transition-all bg-white"
                        >
                            <Upload size={24} className="mb-2" />
                            <span className="font-semibold text-sm">Upload Image</span>
                        </button>
                    ) : (
                        <div className="relative rounded-2xl overflow-hidden border border-gray-200">
                            <img src={image} alt="Receipt" className="w-full h-48 object-cover opacity-80" />
                            <button
                                onClick={() => { setImage(null); fileInputRef.current.value = ''; }}
                                className="absolute top-2 right-2 bg-black/50 text-white p-2 rounded-full backdrop-blur-md"
                            >
                                <X size={16} />
                            </button>
                            <div className="absolute bottom-2 left-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                                <Check size={12} /> Uploaded
                            </div>
                        </div>
                    )}
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full py-5 bg-black text-white rounded-2xl font-bold text-lg shadow-xl shadow-black/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {submitting ? <Loader2 className="animate-spin" /> : 'Save Transaction'}
                </button>

            </div>

            {/* History Modal */}
            {showHistory && (
                <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-auto" onClick={() => setShowHistory(false)} />
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-3xl p-6 pointer-events-auto max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold">Export History</h3>
                            <button onClick={() => setShowHistory(false)} className="bg-gray-100 p-2 rounded-full"><X size={20} /></button>
                        </div>

                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-400 mb-1 block">Start Date</label>
                                    <input type="date" className="w-full bg-gray-50 border p-3 rounded-xl" value={historyDates.start} onChange={e => setHistoryDates({ ...historyDates, start: e.target.value })} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-400 mb-1 block">End Date</label>
                                    <input type="date" className="w-full bg-gray-50 border p-3 rounded-xl" value={historyDates.end} onChange={e => setHistoryDates({ ...historyDates, end: e.target.value })} />
                                </div>
                            </div>

                            <button
                                onClick={handleFetchHistory}
                                className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold"
                                disabled={loadingHistory}
                            >
                                {loadingHistory ? 'Loading...' : 'Load Transactions'}
                            </button>

                            {historyData && (
                                <div className="mt-6 border-t pt-6">
                                    <p className="text-center font-semibold mb-4">{historyData.length} records found</p>
                                    {historyData.length > 0 && (
                                        <button onClick={downloadPDF} className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2">
                                            <Download size={20} /> Download PDF
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
