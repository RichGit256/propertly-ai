"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Twitter, Linkedin, Instagram, Link2, Check, Download } from "lucide-react";
import { useState } from "react";

interface SocialShareDialogProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    beforeUrl?: string; // Optional, maybe for a generated video later
}

export function SocialShareDialog({ isOpen, onClose, imageUrl }: SocialShareDialogProps) {
    const [copied, setCopied] = useState(false);

    const shareText = "Just transformed this property with @PropertlyAI! 🏠✨ Check out the results. #RealEstateAI #VirtualStaging";
    const shareUrl = "https://propertly.ai"; // In real app, this would be a unique shared page ID

    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleTwitter = () => {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank');
    };

    const handleLinkedIn = () => {
        const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
        window.open(url, '_blank');
    };

    const handleInstagram = () => {
        // Instagram doesn't support direct web sharing.
        // We act as "Story Prep": Download image and copy caption.
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `propertly_instagram_share.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        navigator.clipboard.writeText(shareText);

        alert("Instagram Strategy:\n1. Image downloaded.\n2. Caption copied to clipboard.\n3. Open Instagram and post!");
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
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center pointer-events-none z-[101]">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="bg-[#111] border border-white/10 w-full max-w-md p-6 rounded-3xl pointer-events-auto shadow-2xl space-y-6"
                        >
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-white">Share Result</h3>
                                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                                    <X className="w-5 h-5 text-white/50" />
                                </button>
                            </div>

                            {/* Preview */}
                            <div className="aspect-video rounded-xl overflow-hidden bg-black relative border border-white/10">
                                <img src={imageUrl} className="w-full h-full object-cover opacity-80" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="bg-black/50 px-3 py-1 rounded-full text-xs text-white/80 backdrop-blur-md border border-white/10">
                                        Powered by Propertly.ai
                                    </span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={handleTwitter}
                                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#1DA1F2]/10 text-[#1DA1F2] hover:bg-[#1DA1F2]/20 transition-colors font-medium border border-[#1DA1F2]/20"
                                >
                                    <Twitter className="w-5 h-5" />
                                    <span>Twitter</span>
                                </button>
                                <button
                                    onClick={handleLinkedIn}
                                    className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[#0A66C2]/10 text-[#0A66C2] hover:bg-[#0A66C2]/20 transition-colors font-medium border border-[#0A66C2]/20"
                                >
                                    <Linkedin className="w-5 h-5" />
                                    <span>LinkedIn</span>
                                </button>
                                <button
                                    onClick={handleInstagram}
                                    className="col-span-2 flex items-center justify-center gap-2 p-3 rounded-xl bg-gradient-to-r from-[#833AB4]/10 via-[#F56040]/10 to-[#FCAF45]/10 text-[#E1306C] hover:opacity-80 transition-opacity font-medium border border-white/10"
                                >
                                    <Instagram className="w-5 h-5" />
                                    <span>Download for Instagram</span>
                                </button>
                            </div>

                            {/* Link Copy */}
                            <div className="flex items-center gap-2 p-2 rounded-xl bg-white/5 border border-white/10">
                                <div className="p-2 bg-white/5 rounded-lg text-white/50">
                                    <Link2 className="w-4 h-4" />
                                </div>
                                <input
                                    readOnly
                                    value={shareUrl}
                                    className="bg-transparent border-none outline-none text-sm text-white/70 w-full"
                                />
                                <button
                                    onClick={handleCopyLink}
                                    className="p-2 px-3 rounded-lg bg-blue-500 text-white text-xs font-medium hover:bg-blue-400 transition-colors"
                                >
                                    {copied ? <Check className="w-4 h-4" /> : "Copy"}
                                </button>
                            </div>

                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}
