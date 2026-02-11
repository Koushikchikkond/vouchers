import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, TrendingUp, TrendingDown, Edit2, Trash2, Download, Calendar, Loader2, X, Check } from 'lucide-react';
import { format } from 'date-fns';
import { api } from '../api';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function NodeDetailsView({ node, onBack }) {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [showExport, setShowExport] = useState(false);
    const [exportDates, setExportDates] = useState({ start: '', end: '' });

    useEffect(() => {
        loadNodeSummary();
    }, [node]);

    const loadNodeSummary = async () => {
        setLoading(true);
        try {
            const data = await api.getNodeSummary(user.username, node);
            setSummary(data);
        } catch (err) {
            console.error(err);
            alert('Failed to load node details');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTransaction = async (transactionId) => {
        if (!confirm('Are you sure you want to delete this transaction?')) return;

        try {
            await api.deleteTransaction(transactionId);
            alert('Transaction deleted successfully');
            loadNodeSummary(); // Reload data
        } catch (err) {
            console.error(err);
            alert('Failed to delete transaction');
        }
    };

    const handleUpdateTransaction = async (transaction) => {
        try {
            await api.updateTransaction(transaction);
            alert('Transaction updated successfully');
            setEditingTransaction(null);
            loadNodeSummary(); // Reload data
        } catch (err) {
            console.error(err);
            alert('Failed to update transaction');
        }
    };

    const handleExport = async () => {
        if (!exportDates.start || !exportDates.end) {
            alert('Please select start and end dates');
            return;
        }

        try {
            const data = await api.getHistory(user.username, node, exportDates.start, exportDates.end);
            downloadPDF(data.transactions);
        } catch (err) {
            console.error(err);
            alert('Failed to export data');
        }
    };

    const downloadPDF = (transactions) => {
        if (!transactions || transactions.length === 0) {
            alert('No transactions to export');
            return;
        }

        const doc = new jsPDF();

        // Add title
        doc.setFontSize(18);
        doc.setFont('helvetica', 'bold');
        doc.text('Transaction Report', 14, 20);

        // Add node name and date range
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(`Node: ${node}`, 14, 28);
        doc.text(`Period: ${exportDates.start} to ${exportDates.end}`, 14, 34);
        doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 40);

        // Calculate totals
        const totalIn = transactions.filter(t => t.type === 'IN').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
        const totalOut = transactions.filter(t => t.type === 'OUT').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
        const balance = totalIn - totalOut;

        // Prepare table data
        const tableData = transactions.map((row, idx) => [
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
        doc.save(`${node}_${exportDates.start}_to_${exportDates.end}.pdf`);
        setShowExport(false);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <Loader2 className="animate-spin text-gray-400 w-12 h-12" />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <div className="bg-white sticky top-0 z-30 px-6 py-4 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <button onClick={onBack} className="p-2 -ml-2 rounded-full hover:bg-gray-100">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold">{node}</h2>
                        <p className="text-sm text-gray-500">Node Details</p>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingUp size={16} className="text-emerald-600" />
                            <span className="text-xs font-bold text-emerald-600 uppercase">Total In</span>
                        </div>
                        <p className="text-2xl font-bold text-emerald-700">₹{summary?.totalIn || 0}</p>
                    </div>

                    <div className="bg-red-50 rounded-2xl p-4 border border-red-200">
                        <div className="flex items-center gap-2 mb-1">
                            <TrendingDown size={16} className="text-red-600" />
                            <span className="text-xs font-bold text-red-600 uppercase">Total Out</span>
                        </div>
                        <p className="text-2xl font-bold text-red-700">₹{summary?.totalOut || 0}</p>
                    </div>

                    <div className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-blue-600 uppercase">Balance</span>
                        </div>
                        <p className="text-2xl font-bold text-blue-700">₹{summary?.balance || 0}</p>
                    </div>
                </div>

                {/* Export Button */}
                <button
                    onClick={() => setShowExport(true)}
                    className="mt-4 w-full bg-black text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
                >
                    <Download size={18} />
                    Export Transactions
                </button>
            </div>

            {/* Transactions List */}
            <div className="p-6 max-w-4xl mx-auto w-full">
                <h3 className="text-lg font-bold mb-4 text-gray-700">All Transactions</h3>

                {summary?.transactions && summary.transactions.length > 0 ? (
                    <div className="space-y-3">
                        {summary.transactions.map((transaction) => (
                            <TransactionCard
                                key={transaction.id}
                                transaction={transaction}
                                isEditing={editingTransaction?.id === transaction.id}
                                onEdit={() => setEditingTransaction(transaction)}
                                onCancelEdit={() => setEditingTransaction(null)}
                                onSave={handleUpdateTransaction}
                                onDelete={() => handleDeleteTransaction(transaction.id)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-100 rounded-2xl border border-dashed border-gray-300">
                        <p className="text-gray-500">No transactions found</p>
                    </div>
                )}
            </div>

            {/* Export Modal */}
            <AnimatePresence>
                {showExport && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowExport(false)} />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-3xl p-6 w-full max-w-md relative z-10"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Export Transactions</h3>
                                <button onClick={() => setShowExport(false)} className="p-2 hover:bg-gray-100 rounded-full">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-2">Start Date</label>
                                    <input
                                        type="date"
                                        value={exportDates.start}
                                        onChange={(e) => setExportDates({ ...exportDates, start: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-black/5"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-500 mb-2">End Date</label>
                                    <input
                                        type="date"
                                        value={exportDates.end}
                                        onChange={(e) => setExportDates({ ...exportDates, end: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-black/5"
                                    />
                                </div>

                                <button
                                    onClick={handleExport}
                                    className="w-full bg-emerald-500 text-white py-3 rounded-xl font-bold hover:bg-emerald-600 transition-colors"
                                >
                                    Download PDF
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

// Transaction Card Component
function TransactionCard({ transaction, isEditing, onEdit, onCancelEdit, onSave, onDelete }) {
    const [editData, setEditData] = useState(transaction);

    const handleSave = () => {
        onSave({
            rowId: transaction.id,
            type: editData.type,
            amount: editData.amount,
            date: editData.date,
            reason: editData.reason,
            category: editData.category
        });
    };

    if (isEditing) {
        return (
            <div className="bg-white rounded-2xl p-5 shadow-sm border-2 border-blue-500">
                <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">Type</label>
                            <select
                                value={editData.type}
                                onChange={(e) => setEditData({ ...editData, type: e.target.value })}
                                className="w-full bg-gray-50 border rounded-lg p-2 text-sm"
                            >
                                <option value="IN">IN</option>
                                <option value="OUT">OUT</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-gray-500 block mb-1">Amount</label>
                            <input
                                type="number"
                                value={editData.amount}
                                onChange={(e) => setEditData({ ...editData, amount: e.target.value })}
                                className="w-full bg-gray-50 border rounded-lg p-2 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 block mb-1">Date</label>
                        <input
                            type="date"
                            value={editData.date}
                            onChange={(e) => setEditData({ ...editData, date: e.target.value })}
                            className="w-full bg-gray-50 border rounded-lg p-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-500 block mb-1">Reason</label>
                        <textarea
                            value={editData.reason}
                            onChange={(e) => setEditData({ ...editData, reason: e.target.value })}
                            className="w-full bg-gray-50 border rounded-lg p-2 text-sm resize-none"
                            rows={2}
                        />
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleSave}
                            className="flex-1 bg-emerald-500 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-1"
                        >
                            <Check size={16} /> Save
                        </button>
                        <button
                            onClick={onCancelEdit}
                            className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${transaction.type === 'IN'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                            }`}>
                            {transaction.type}
                        </span>
                        {transaction.category && (
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600">
                                {transaction.category}
                            </span>
                        )}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">₹{transaction.amount}</p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onEdit}
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                    >
                        <Edit2 size={18} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                    <Calendar size={14} />
                    <span>{transaction.date}</span>
                </div>
                <p className="text-gray-700 font-medium">{transaction.reason}</p>
                <p className="text-xs text-gray-400">
                    Added: {format(new Date(transaction.timestamp), 'MMM dd, yyyy HH:mm')}
                </p>
            </div>
        </div>
    );
}
