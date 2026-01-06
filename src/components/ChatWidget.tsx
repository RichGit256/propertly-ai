"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
    id: string;
    text: string;
    sender: "user" | "bot";
    action?: {
        label: string;
        event: string;
    };
};

const FAQ_KNOWLEDGE_BASE = [
    {
        keywords: ["price", "cost", "free", "subscription", "credit", "tier"],
        answer: "We offer a free tier with 3 credits! You can upgrade to our Pro plan for unlimited enhancements, or buy credit packs starting at $5.",
        action: { label: "View Plans", event: "open-subscription" }
    },
    // ... other items unchanged
    {
        keywords: ["secure", "privacy", "data", "safe"],
        answer: "Yes, your data is secure. We use enterprise-grade encryption and do not share your photos with third parties. Images are deleted after 24 hours for guest users."
    },
    {
        keywords: ["how", "upload", "work", "use"],
        answer: "Simply drag and drop your photos onto the home page. You can enhance up to 10 images at once! Choose 'Standard' for quick fixes or 'Magic' for custom AI edits."
    },
    {
        keywords: ["format", "jpg", "png", "type"],
        answer: "We support all major image formats including JPG, PNG, and WEBP. Max file size is 25MB."
    },
    {
        keywords: ["hello", "hi", "hey"],
        answer: "Hello there! I'm the Propertly AI assistant. How can I help you improve your real estate listings today?"
    }
];

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState("");
    const [messages, setMessages] = useState<Message[]>([
        { id: "welcome", text: "Hi! 👋 I can help with questions about pricing, features, or how to use the app.", sender: "bot" }
    ]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim()) return;

        const userMsg: Message = { id: Date.now().toString(), text: inputValue, sender: "user" };
        setMessages(prev => [...prev, userMsg]);
        setInputValue("");

        // Simple FAQ Logic
        setTimeout(() => {
            const lowerInput = userMsg.text.toLowerCase();
            let responseText = "I'm not sure about that. Try asking about pricing, security, or how to use the tool. You can also contact support@propertly.ai";
            let responseAction = undefined;

            for (const item of FAQ_KNOWLEDGE_BASE) {
                if (item.keywords.some(k => lowerInput.includes(k))) {
                    responseText = item.answer;
                    responseAction = item.action;
                    break;
                }
            }

            const botMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: responseText,
                sender: "bot",
                action: responseAction
            };
            setMessages(prev => [...prev, botMsg]);
        }, 600);
    };

    const handleAction = (event: string) => {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event(event));
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="w-[350px] h-[500px] bg-black/90 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden pointer-events-auto"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                    <Bot className="w-5 h-5 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white text-sm">Propertly Assistant</h3>
                                    <div className="flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        <span className="text-[10px] text-white/50">Online</span>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/10 rounded-lg transition-colors"
                                title="Close Support Chat"
                            >
                                <X className="w-5 h-5 text-white/70" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${msg.sender === "user"
                                            ? "bg-blue-600 text-white rounded-tr-sm"
                                            : "bg-white/10 text-white/90 rounded-tl-sm"
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                    {msg.action && (
                                        <button
                                            onClick={() => handleAction(msg.action!.event)}
                                            className="mt-2 text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 px-3 py-1.5 rounded-full border border-blue-500/30 transition-colors"
                                        >
                                            {msg.action.label}
                                        </button>
                                    )}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-4 border-t border-white/10 bg-white/5">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Ask a question..."
                                    className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:ring-1 focus:ring-white/20 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                className="pointer-events-auto w-14 h-14 rounded-full bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ rotate: 90 }}
            >
                {isOpen ? (
                    <X className="w-6 h-6" />
                ) : (
                    <MessageCircle className="w-6 h-6" />
                )}
            </motion.button>
        </div>
    );
}
