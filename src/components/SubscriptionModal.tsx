"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Zap, Crown, Star } from "lucide-react";
import { PLANS, stripe } from "@/lib/stripe";
import { useState } from "react";
import { useToast } from "@/components/Toast";

interface SubscriptionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SubscriptionModal({ isOpen, onClose }: SubscriptionModalProps) {
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const { addToast } = useToast();

    const handleSubscribe = async (planId: string) => {
        setLoadingId(planId);
        try {
            const result = await stripe.checkout(planId);
            if (result.success) {
                addToast("Redirecting to checkout...", "success");
                // In a real app, window.location.href = result.url;
                setTimeout(() => {
                    onClose();
                    addToast("Subscription successful! (Mock)", "success");
                    // Refresh credits logic would go here
                    window.dispatchEvent(new Event('credits-updated'));
                }, 1000);
            }
        } catch (error) {
            addToast("Failed to start checkout.", "error");
        } finally {
            setLoadingId(null);
        }
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
                        className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none overflow-y-auto">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-4xl bg-[#0A0A0A] border border-white/10 rounded-3xl shadow-2xl p-6 md:p-10 pointer-events-auto my-auto max-h-[90vh] overflow-y-auto"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full z-10"
                            >
                                <X className="w-5 h-5" />
                            </button>

                            <div className="text-center mb-10 space-y-2 mt-4 md:mt-0">
                                <span className="text-blue-400 font-medium tracking-wider text-xs uppercase">Unlock Propertly.ai</span>
                                <h2 className="text-3xl md:text-4xl font-bold text-white">Upgrade your creativity</h2>
                                <p className="text-white/50 max-w-lg mx-auto">
                                    Run out of credits? Choose a plan that fits your needs and start enhancing immediately.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {PLANS.map((plan) => {
                                    const isPopular = plan.id === "price_agent_bundle";
                                    const Icon = plan.id.includes("pro") ? Crown : plan.id.includes("agent") ? Zap : Star;

                                    return (
                                        <div
                                            key={plan.id}
                                            className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300 hover:scale-[1.02] ${isPopular
                                                ? "bg-white/10 border-blue-500/50 shadow-blue-500/10 shadow-lg"
                                                : "bg-white/5 border-white/10 hover:border-white/20"
                                                }`}
                                        >
                                            {isPopular && (
                                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full shadow-lg">
                                                    MOST POPULAR
                                                </div>
                                            )}

                                            <div className="mb-4">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${isPopular ? "bg-blue-500/20 text-blue-400" : "bg-white/10 text-white/60"
                                                    }`}>
                                                    <Icon className="w-5 h-5" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white">{plan.name}</h3>
                                                <div className="flex items-baseline gap-1 mt-1">
                                                    <span className="text-2xl font-bold text-white">{plan.price}</span>
                                                    <span className="text-sm text-white/40">/ {plan.credits} credits</span>
                                                </div>
                                            </div>

                                            <ul className="flex-1 space-y-3 mb-6">
                                                {plan.features.map((feature, i) => (
                                                    <li key={i} className="flex items-start gap-2 text-sm text-white/70">
                                                        <Check className={`w-4 h-4 mt-0.5 ${isPopular ? "text-blue-400" : "text-white/40"}`} />
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>

                                            <button
                                                onClick={() => handleSubscribe(plan.id)}
                                                disabled={loadingId !== null}
                                                className={`w-full py-3 rounded-xl font-semibold transition-all ${isPopular
                                                    ? "bg-blue-500 hover:bg-blue-400 text-white shadow-lg shadow-blue-500/20"
                                                    : "bg-white text-black hover:bg-gray-200"
                                                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                {loadingId === plan.id ? "Processing..." : "Select Plan"}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
