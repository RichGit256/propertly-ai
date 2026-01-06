"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import { X, Mail, Lock, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type AuthMode = "signin" | "signup" | "forgot";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    defaultMode?: AuthMode;
}

export function AuthModal({ isOpen, onClose, defaultMode = "signin" }: AuthModalProps) {
    const [mode, setMode] = useState<AuthMode>(defaultMode);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);

    const [acceptedTerms, setAcceptedTerms] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setMode(defaultMode);
            setError(null);
            setMessage(null);
            setAcceptedTerms(false);
            // Optionally clear inputs too if desired, but keeping them might be friendly. 
            // User requested "Sign In form", implying mode reset is key.
        }
    }, [isOpen, defaultMode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === "signup" && !acceptedTerms) {
            setError("You must accept the Terms and Privacy Policy to continue.");
            return;
        }
        setError(null);
        // ... rest of logic
        setMessage(null);
        setLoading(true);

        try {
            if (!supabase) throw new Error("Supabase client not initialized");

            if (mode === "signup") {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;
                setMessage("Check your email for the confirmation link!");
            } else if (mode === "signin") {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                onClose();
            } else if (mode === "forgot") {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/update-password`,
                });
                if (error) throw error;
                setMessage("Password reset link sent to your email.");
            }
        } catch (err: any) {
            console.error("Auth Error:", err);
            let msg = err.message || "An error occurred";

            // Map common Supabase errors to user-friendly messages
            if (msg.includes("already registered") || msg.includes("already exists")) {
                msg = "This email is already registered. Please sign in instead.";
            } else if (msg.includes("Invalid login credentials")) {
                msg = "Invalid email or password. Please try again.";
            } else if (msg.includes("rate limit")) {
                msg = "Too many attempts. Please try again later.";
            }

            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-md overflow-hidden rounded-3xl bg-[#0A0A0A] border border-white/10 shadow-2xl"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 text-white/40 hover:text-white transition-colors rounded-full hover:bg-white/5"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-semibold text-white mb-2">
                                {mode === "signin" && "Welcome Back"}
                                {mode === "signup" && "Create Account"}
                                {mode === "forgot" && "Reset Password"}
                            </h2>
                            <p className="text-sm text-white/50">
                                {mode === "signin" && "Enter your credentials to access your workspace."}
                                {mode === "signup" && "Join Propertly.ai to start enhancing images."}
                                {mode === "forgot" && "We'll send you a link to reset your password."}
                            </p>
                        </div>

                        {/* Error / Success Messages */}
                        {error && (
                            <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-500 text-sm">
                                <AlertCircle className="w-4 h-4" />
                                {error}
                            </div>
                        )}
                        {message && (
                            <div className="mb-6 p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center gap-2 text-green-500 text-sm">
                                <CheckCircle2 className="w-4 h-4" />
                                {message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-4">
                                <div className="relative group">
                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-white/30 group-focus-within:text-white/70 transition-colors" />
                                    <input
                                        type="email"
                                        placeholder="Email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                                    />
                                </div>

                                {mode !== "forgot" && (
                                    <div className="relative group">
                                        <Lock className="absolute left-3 top-3 w-5 h-5 text-white/30 group-focus-within:text-white/70 transition-colors" />
                                        <input
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all"
                                        />
                                    </div>
                                )}
                            </div>

                            {mode === "signup" && (
                                <div className="flex items-start gap-3 px-1">
                                    <input
                                        type="checkbox"
                                        id="terms-check"
                                        checked={acceptedTerms}
                                        onChange={(e) => setAcceptedTerms(e.target.checked)}
                                        className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 checked:bg-white text-black cursor-pointer"
                                    />
                                    <label htmlFor="terms-check" className="text-sm text-white/60 leading-tight cursor-pointer select-none">
                                        I accept the <a href="/terms" target="_blank" className="text-white hover:underline">Terms of Service</a> and <a href="/privacy" target="_blank" className="text-white hover:underline">Privacy Policy</a>
                                    </label>
                                </div>
                            )}

                            {mode === "signin" && (
                                <div className="flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => setMode("forgot")}
                                        className="text-xs text-white/40 hover:text-white transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || (mode === "signup" && !acceptedTerms)}
                                className="w-full py-3 bg-white text-black font-medium rounded-xl hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {mode === "signin" && "Sign In"}
                                        {mode === "signup" && "Create Account"}
                                        {mode === "forgot" && "Send Reset Link"}
                                        <ArrowRight className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-6 text-center text-sm text-white/40">
                            {mode === "signin" ? (
                                <>
                                    Don't have an account?{" "}
                                    <button
                                        onClick={() => {
                                            setMode("signup");
                                            setError(null);
                                            setMessage(null);
                                            setAcceptedTerms(false);
                                        }}
                                        className="text-white hover:underline"
                                    >
                                        Sign up
                                    </button>
                                </>
                            ) : (
                                <>
                                    Already have an account?{" "}
                                    <button
                                        onClick={() => {
                                            setMode("signin");
                                            setError(null);
                                            setMessage(null);
                                        }}
                                        className="text-white hover:underline"
                                    >
                                        Sign in
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
