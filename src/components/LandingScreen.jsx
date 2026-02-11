import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api';
import { Plus, ChevronRight, Loader2, ArrowLeft, Edit2, Trash2, Download, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function LandingScreen({ onStart, onNodeDetails, onModeSelect, onBackFromNodeSelection, showNodeSelection, currentMode }) {
    const { user, logout } = useAuth();
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newNode, setNewNode] = useState('');
    const [editingNode, setEditingNode] = useState(null);

    useEffect(() => {
        if (showNodeSelection) {
            loadNodes();
        }
    }, [showNodeSelection]);

    const loadNodes = () => {
        setLoading(true);
        api.getNodes(user.username)
            .then(n => {
                setNodes(n || []);
            })
            .catch(err => {
                console.error(err);
                setNodes([]);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const handleNodeSelect = (node) => {
        onStart(currentMode, node);
    };

    const handleCreateNode = () => {
        if (newNode.trim()) {
            handleNodeSelect(newNode.trim());
        }
    };

    const handleDeleteNode = async (nodeName) => {
        if (!confirm(`Are you sure you want to delete "${nodeName}" and all its transactions?`)) return;

        try {
            await api.deleteNode(user.username, nodeName);
            alert('Node deleted successfully');
            loadNodes();
        } catch (err) {
            console.error(err);
            alert('Failed to delete node');
        }
    };

    const handleUpdateNode = async (oldName, newName) => {
        if (!newName.trim()) return;

        try {
            await api.updateNode(user.username, oldName, newName.trim());
            alert('Node renamed successfully');
            setEditingNode(null);
            loadNodes();
        } catch (err) {
            console.error(err);
            alert('Failed to rename node');
        }
    };

    const handleExportAllNodes = async () => {
        try {
            const data = await api.getAllNodesExport(user.username);
            if (!data.transactions || data.transactions.length === 0) {
                alert('No transactions to export');
                return;
            }

            const doc = new jsPDF();

            // Add title
            doc.setFontSize(18);
            doc.setFont('helvetica', 'bold');
            doc.text('All Nodes - Transaction Report', 14, 20);

            // Add metadata
            doc.setFontSize(11);
            doc.setFont('helvetica', 'normal');
            doc.text(`User: ${user.name} (@${user.username})`, 14, 28);
            doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 34);

            // Calculate totals
            const totalIn = data.transactions.filter(t => t.type === 'IN').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
            const totalOut = data.transactions.filter(t => t.type === 'OUT').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
            const balance = totalIn - totalOut;

            // Prepare table data
            const tableData = data.transactions.map((row, idx) => [
                idx + 1,
                row.node,
                row.date,
                row.type,
                `₹${parseFloat(row.amount || 0).toFixed(2)}`,
                row.reason,
                row.category || '-'
            ]);

            // Add table
            doc.autoTable({
                startY: 40,
                head: [['SL', 'Node', 'Date', 'Type', 'Amount', 'Reason', 'Category']],
                body: tableData,
                theme: 'grid',
                headStyles: {
                    fillColor: [41, 128, 185],
                    textColor: 255,
                    fontStyle: 'bold',
                    halign: 'center'
                },
                columnStyles: {
                    0: { halign: 'center', cellWidth: 12 },
                    1: { halign: 'left', cellWidth: 25 },
                    2: { halign: 'center', cellWidth: 22 },
                    3: { halign: 'center', cellWidth: 15 },
                    4: { halign: 'right', cellWidth: 25 },
                    5: { halign: 'left', cellWidth: 50 },
                    6: { halign: 'center', cellWidth: 25 }
                },
                styles: {
                    fontSize: 8,
                    cellPadding: 2
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
            doc.save(`All_Nodes_Export_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (err) {
            console.error(err);
            alert('Failed to export data');
        }
    };

    if (!showNodeSelection) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6 text-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                    <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="z-10 w-full max-w-md"
                >
                    <h1 className="text-5xl font-extrabold mb-2 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white text-center">
                        Vouchers
                    </h1>
                    <p className="text-center text-gray-400 mb-12 text-lg">Expense & Advance Tracker</p>

                    <div className="space-y-6">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onModeSelect('VOUCHER')}
                            className="group relative w-full py-8 rounded-3xl bg-gray-800/50 border border-gray-700 hover:border-emerald-500/50 transition-all backdrop-blur-xl overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative flex flex-col items-center">
                                <span className="text-3xl font-bold text-emerald-400">Voucher</span>
                                <span className="text-sm text-gray-400 mt-1 uppercase tracking-widest text-[10px]">Reimbursable</span>
                            </div>
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => onModeSelect('REQUESTED')}
                            className="group relative w-full py-8 rounded-3xl bg-gray-800/50 border border-gray-700 hover:border-blue-500/50 transition-all backdrop-blur-xl overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="relative flex flex-col items-center">
                                <span className="text-3xl font-bold text-blue-400">Requested</span>
                                <span className="text-sm text-gray-400 mt-1 uppercase tracking-widest text-[10px]">Petty Cash / Advance</span>
                            </div>
                        </motion.button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 text-gray-900">
            <div className="p-6 pt-8 max-w-lg mx-auto w-full">
                {/* Header with User Info */}
                <div className="flex justify-between items-center mb-8">
                    <button onClick={onBackFromNodeSelection} className="text-gray-500 flex items-center gap-2 hover:text-black transition-colors">
                        <ArrowLeft size={20} /> Back
                    </button>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-500">@{user.username}</p>
                        </div>
                        <button
                            onClick={logout}
                            className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                            title="Logout"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <h2 className="text-3xl font-bold mb-2 tracking-tight">Select Node</h2>
                    <p className="text-gray-500 mb-8">Choose a project workspace.</p>

                    <div className="relative mb-10">
                        <input
                            type="text"
                            placeholder="Create New Node..."
                            className="w-full bg-white p-5 pr-14 rounded-2xl shadow-sm border border-gray-200 text-lg outline-none focus:ring-2 focus:ring-black/5 transition-all"
                            value={newNode}
                            onChange={(e) => setNewNode(e.target.value)}
                        />
                        <button
                            onClick={handleCreateNode}
                            className="absolute right-3 top-3 bottom-3 aspect-square bg-black text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-800 transition-colors"
                            disabled={!newNode.trim()}
                        >
                            <Plus size={24} />
                        </button>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Your Nodes</h3>
                            {nodes.length > 0 && (
                                <button
                                    onClick={handleExportAllNodes}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors"
                                >
                                    <Download size={16} />
                                    Export All
                                </button>
                            )}
                        </div>
                        {loading ? (
                            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-gray-400 w-8 h-8" /></div>
                        ) : (
                            <div className="space-y-3">
                                {nodes.map((node, idx) => (
                                    editingNode === node ? (
                                        <div key={idx} className="p-5 bg-white rounded-2xl shadow-sm border-2 border-blue-500">
                                            <input
                                                type="text"
                                                defaultValue={node}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleUpdateNode(node, e.target.value);
                                                    } else if (e.key === 'Escape') {
                                                        setEditingNode(null);
                                                    }
                                                }}
                                                onBlur={(e) => handleUpdateNode(node, e.target.value)}
                                                autoFocus
                                                className="w-full font-semibold text-lg text-gray-800 outline-none bg-gray-50 px-3 py-2 rounded-lg"
                                            />
                                        </div>
                                    ) : (
                                        <motion.div
                                            key={idx}
                                            whileTap={{ scale: 0.98 }}
                                            className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center hover:shadow-md transition-all hover:border-gray-300"
                                        >
                                            <span
                                                onClick={() => onNodeDetails ? onNodeDetails(node) : handleNodeSelect(node)}
                                                className="font-semibold text-lg text-gray-800 cursor-pointer flex-1"
                                            >
                                                {node}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setEditingNode(node);
                                                    }}
                                                    className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                                                    title="Rename node"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDeleteNode(node);
                                                    }}
                                                    className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                                    title="Delete node"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleNodeSelect(node)}
                                                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                                    title="Add transaction"
                                                >
                                                    <ChevronRight className="text-gray-300" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )
                                ))}
                                {nodes.length === 0 && <div className="text-center py-12 text-gray-400 bg-gray-100/50 rounded-2xl border border-dashed border-gray-200">No nodes found. Create one above!</div>}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
