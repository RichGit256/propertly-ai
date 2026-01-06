"use client";

import { useTheme } from "../ThemeProvider";
import { Zap, CreditCard } from "lucide-react";
import { useState } from "react";
import { SubscriptionModal } from "../SubscriptionModal";

type Props = {
    credits: number;
    isPro: boolean;
};

export function SubscriptionCard({ credits, isPro }: Props) {
    const { theme } = useTheme();
    const [showUpgrade, setShowUpgrade] = useState(false);

    return (
        <>
            <div className={`p-6 rounded-3xl border flex flex-col h-full ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#0A0A0A] border-white/10'}`}>
                <h3 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-black' : 'text-white'}`}>Subscription</h3>

                <div className="flex-1 space-y-6">
                    <div className="flex items-center justify-between">
                        <span className={theme === 'light' ? 'text-gray-600' : 'text-white/60'}>Current Plan</span>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${isPro
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                            }`}>
                            {isPro ? "PRO" : "FREE"}
                        </span>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className={theme === 'light' ? 'text-gray-600' : 'text-white/60'}>Credits</span>
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-500" />
                            <span className={`font-mono text-lg font-bold ${theme === 'light' ? 'text-black' : 'text-white'}`}>
                                {credits}
                            </span>
                            <button
                                onClick={() => setShowUpgrade(true)}
                                className="ml-2 px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                            >
                                + Buy
                            </button>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => setShowUpgrade(true)}
                    className={`w-full mt-6 py-3 rounded-xl font-medium transition-colors ${theme === 'light'
                        ? 'bg-black text-white hover:bg-gray-800'
                        : 'bg-white text-black hover:bg-gray-200'
                        }`}
                >
                    {isPro ? "Manage Subscription" : "Get Credits & Upgrade"}
                </button>
            </div>
            <SubscriptionModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />
        </>
    );
}
