import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../api';
import { Plus, ChevronRight, Loader2, ArrowLeft } from 'lucide-react';

export default function LandingScreen({ onStart }) {
    const [mode, setMode] = useState(null); // 'VOUCHER' or 'REQUESTED'
    const [nodes, setNodes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showNodeSelection, setShowNodeSelection] = useState(false);
    const [newNode, setNewNode] = useState('');

    useEffect(() => {
        if (showNodeSelection) {
            setLoading(true);
            api.getNodes()
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
        }
    }, [showNodeSelection]);

    const handleModeSelect = (selectedMode) => {
        setMode(selectedMode);
        setShowNodeSelection(true);
    };

    const handleNodeSelect = (node) => {
        onStart(mode, node);
    };

    const handleCreateNode = () => {
        if (newNode.trim()) {
            handleNodeSelect(newNode.trim());
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
                            onClick={() => handleModeSelect('VOUCHER')}
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
                            onClick={() => handleModeSelect('REQUESTED')}
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
                <button onClick={() => setShowNodeSelection(false)} className="text-gray-500 mb-8 flex items-center gap-2 hover:text-black transition-colors">
                    <ArrowLeft size={20} /> Back
                </button>

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
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 ml-1">Recent Nodes</h3>
                        {loading ? (
                            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-gray-400 w-8 h-8" /></div>
                        ) : (
                            <div className="space-y-3">
                                {nodes.map((node, idx) => (
                                    <motion.div
                                        key={idx}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => handleNodeSelect(node)}
                                        className="p-5 bg-white rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center cursor-pointer hover:shadow-md transition-all hover:border-gray-300"
                                    >
                                        <span className="font-semibold text-lg text-gray-800">{node}</span>
                                        <ChevronRight className="text-gray-300" />
                                    </motion.div>
                                ))}
                                {nodes.length === 0 && <div className="text-center py-12 text-gray-400 bg-gray-100/50 rounded-2xl border border-dashed border-gray-200">No recent nodes found.</div>}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
