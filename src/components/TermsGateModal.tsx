"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface TermsGateModalProps {
    isOpen: boolean;
    onAccept: () => void;
    onCancel: () => void;
}

export function TermsGateModal({ isOpen, onAccept, onCancel }: TermsGateModalProps) {
    const [accepted, setAccepted] = useState(false);

    const handleAccept = () => {
        if (!accepted) return;
        localStorage.setItem("propertly_terms_accepted", "true");
        onAccept();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100]"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[101] px-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#111] border border-white/10 w-full max-w-md p-8 rounded-3xl pointer-events-auto shadow-2xl space-y-6 text-center"
                        >
                            <h2 className="text-2xl font-bold text-white">Welcome to Propertly.ai</h2>
                            <p className="text-white/60 text-sm leading-relaxed">
                                Before you start enhancing your images, please accept our terms.
                                We value your privacy and data security.
                            </p>

                            <div className="flex items-start gap-3 text-left bg-white/5 p-4 rounded-xl border border-white/5">
                                <input
                                    type="checkbox"
                                    id="terms-gate-check"
                                    checked={accepted}
                                    onChange={(e) => setAccepted(e.target.checked)}
                                    className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-white text-black cursor-pointer"
                                />
                                <label htmlFor="terms-gate-check" className="text-sm text-white/80 leading-tight cursor-pointer select-none">
                                    I have read and accept the <Link href="/terms" className="text-blue-400 hover:underline" target="_blank">Terms of Service</Link> and <Link href="/privacy" className="text-blue-400 hover:underline" target="_blank">Privacy Policy</Link>.
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={onCancel}
                                    className="flex-1 py-3 rounded-xl hover:bg-white/5 text-white/50 hover:text-white transition-colors text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleAccept}
                                    disabled={!accepted}
                                    className="flex-1 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Continue
                                </button>
                            </div>

                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
