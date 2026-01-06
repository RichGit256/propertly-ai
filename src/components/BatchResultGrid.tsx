"use client";

import { motion } from "framer-motion";
import { Download, RefreshCw, Share2 } from "lucide-react";
import { ComparisonSlider } from "./ComparisonSlider";
import { SocialShareDialog } from "./SocialShareDialog";
import { useState } from "react";

export interface BatchImageItem {
    id: string;
    file: File;
    preview: string;
    status: 'pending' | 'enhancing' | 'complete' | 'error';
    enhancedUrl?: string;
    error?: string;
}

interface BatchResultGridProps {
    items: BatchImageItem[];
    onDownload: (item: BatchImageItem) => void;
    onDownloadAll: () => void;
    onReset: () => void;
}

export function BatchResultGrid({ items, onDownload, onDownloadAll, onReset }: BatchResultGridProps) {
    const [shareItem, setShareItem] = useState<BatchImageItem | null>(null);

    return (
        <div className="w-full max-w-7xl space-y-12 pb-20">
            {/* Header Actions */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-white">Results Ready</h2>
                    <p className="text-white/50">Your images have been enhanced.</p>
                </div>
                <div className="flex gap-4">
                    <button
                        onClick={onReset}
                        className="px-6 py-2 rounded-xl text-white/60 hover:text-white hover:bg-white/5 transition-colors flex items-center gap-2"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Start Over
                    </button>
                    <button
                        onClick={onDownloadAll}
                        className="px-6 py-2 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-colors flex items-center gap-2"
                    >
                        <Download className="w-4 h-4" />
                        Download All
                    </button>
                </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((item) => (
                    <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="group relative bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden"
                    >
                        <div className="aspect-[4/3] relative">
                            {item.status === 'complete' && item.enhancedUrl ? (
                                <ComparisonSlider
                                    beforeImage={item.preview}
                                    afterImage={item.enhancedUrl}
                                    aspectRatio="aspect-[4/3]"
                                />
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/5">
                                    {item.status === 'error' ? (
                                        <p className="text-red-400 text-sm">{item.error}</p>
                                    ) : (
                                        <p className="text-white/30 text-sm">Processing...</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Actions Footer */}
                        <div className="p-4 flex items-center justify-between border-t border-white/10 bg-white/[0.02]">
                            <span className="text-xs font-mono text-white/30 truncate max-w-[120px]">
                                {item.file.name}
                            </span>
                            <div className="flex gap-2">
                                {item.status === 'complete' && (
                                    <>
                                        <button
                                            onClick={() => setShareItem(item)}
                                            className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                            title="Share"
                                        >
                                            <Share2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => onDownload(item)}
                                            className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                                            title="Download"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            <SocialShareDialog
                isOpen={!!shareItem}
                onClose={() => setShareItem(null)}
                imageUrl={shareItem?.enhancedUrl || ""}
            />
        </div>
    );
}

