"use client";

import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { motion } from "framer-motion";
import { ComparisonSlider } from "@/components/ComparisonSlider";
import { Loader2, Share2 } from "lucide-react";
import Link from "next/link";
import { SocialShareDialog } from "../SocialShareDialog";

type HistoryItem = {
    id: string;
    original_url: string;
    enhanced_url: string;
    mode: string;
    created_at: string;
};

export function HistoryList({ userId }: { userId: string }) {
    const [items, setItems] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [shareItem, setShareItem] = useState<HistoryItem | null>(null);

    useEffect(() => {
        const fetchHistory = async () => {
            const supabase = createBrowserClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
            );

            const { data, error } = await supabase
                .from("user_edits")
                .select("*")
                .eq("user_id", userId)
                .order("created_at", { ascending: false });

            if (data) {
                setItems(data);
            }
            setLoading(false);
        };

        if (userId) {
            fetchHistory();
        }
    }, [userId]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-white/30" />
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className="text-center py-12 px-6 rounded-2xl border border-white/5 bg-white/5">
                <p className="text-white/50">No history found.</p>
                <Link href="/" className="text-blue-400 hover:underline mt-2 inline-block text-sm">Start your first enhancement</Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">History</h2>
                <span className="text-sm text-white/40">Auto-saved for 7 days</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {items.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-3 p-4 rounded-2xl border border-white/5 bg-white/5 hover:border-white/10 transition-colors"
                    >
                        <div className="aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-black/20 relative group">
                            <ComparisonSlider
                                beforeImage={item.original_url}
                                afterImage={item.enhanced_url}
                                aspectRatio="aspect-[4/3]"
                            />
                        </div>
                        <div className="flex items-center justify-between px-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
                                    {item.mode}
                                </span>
                                <span className="text-xs text-white/30">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <button
                                onClick={() => setShareItem(item)}
                                className="p-1.5 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                                title="Share"
                            >
                                <Share2 className="w-3.5 h-3.5" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <SocialShareDialog
                isOpen={!!shareItem}
                onClose={() => setShareItem(null)}
                imageUrl={shareItem?.enhanced_url || ""}
            />
        </div>
    );
}
