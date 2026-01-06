"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, Sparkles, X } from "lucide-react";
import { useState } from "react";
import { PLANS } from "@/lib/stripe";

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePay = async () => {
        setIsProcessing(true);
        // Simulate payment processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000));
        setIsProcessing(false);
        onSuccess();
        onClose();
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
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="w-full max-w-md bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl p-6 pointer-events-auto overflow-hidden relative"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="flex flex-col items-center text-center space-y-6 pt-4">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-white/10">
                                    <Sparkles className="w-8 h-8 text-white/80" />
                                </div>

                                <div className="space-y-2">
                                    <h3 className="text-2xl font-bold text-white">Unlock High-Res Photo</h3>
                                    <p className="text-white/60 text-sm max-w-xs mx-auto">
                                        Get the crystal clear, watermark-free version of your enhanced property image.
                                    </p>
                                </div>

                                <div className="w-full bg-white/5 rounded-xl p-4 border border-white/5 space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-white/70">Single Enhancement</span>
                                        <span className="text-white font-medium">{PLANS[0].price}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-white/70">Processing Fee</span>
                                        <span className="text-white font-medium">$0.00</span>
                                    </div>
                                    <div className="h-px bg-white/10 w-full" />
                                    <div className="flex items-center justify-between text-base">
                                        <span className="text-white font-bold">Total</span>
                                        <span className="text-white font-bold">{PLANS[0].price}</span>
                                    </div>
                                </div>

                                <div className="w-full space-y-3">
                                    <button
                                        onClick={handlePay}
                                        disabled={isProcessing}
                                        className="w-full py-3.5 rounded-xl bg-white text-black font-bold hover:bg-gray-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? (
                                            <>
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            "Pay & Download"
                                        )}
                                    </button>
                                    <p className="text-xs text-white/30">
                                        Secure payment powered by Stripe (Mock)
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
