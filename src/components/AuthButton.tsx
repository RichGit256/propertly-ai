"use client";

import Link from "next/link";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import { LogIn, Coins } from "lucide-react";
import { AuthModal } from "./AuthModal";

export default function AuthButton() {
    const [user, setUser] = useState<User | null>(null);
    const [credits, setCredits] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        if (!supabase) {
            setLoading(false);
            return;
        }

        // Get initial usage
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user);
            if (user) fetchCredits(user.id);
            setLoading(false);
        });

        // Listen for changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                fetchCredits(session.user.id);
            } else {
                setCredits(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    // Listen for custom credit update events
    useEffect(() => {
        const handleCreditUpdate = () => {
            if (user) fetchCredits(user.id);
        };
        window.addEventListener('credits-updated', handleCreditUpdate);
        return () => window.removeEventListener('credits-updated', handleCreditUpdate);
    }, [user]);

    const fetchCredits = async (userId: string) => {
        if (!supabase) return;
        const { data } = await supabase
            .from("user_credits")
            .select("credits_remaining")
            .eq("user_id", userId)
            .single();

        if (data) {
            setCredits(data.credits_remaining);
        }
    };

    const handleSignOut = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
    };

    if (loading) {
        return <div className="h-9 w-24 bg-card/50 animate-pulse rounded-full" />;
    }

    // Not Logged In
    if (!user) {
        return (
            <>
                <button
                    onClick={() => setIsAuthModalOpen(true)}
                    disabled={!supabase}
                    className="group relative flex items-center gap-2.5 px-5 py-2.5 text-sm font-medium text-white rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                    title={!supabase ? "Supabase not configured" : "Sign In or Sign Up"}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shimmer" />
                    <LogIn className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
                    <span className="relative">Sign In</span>
                </button>

                <AuthModal
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                />
            </>
        );
    }

    // Logged In
    return (
        <div className="flex items-center gap-4">
            {credits !== null && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-medium">
                    <Coins className="w-3.5 h-3.5" />
                    <span>{credits}</span>
                </div>
            )}
            {/* <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 text-sm text-muted-foreground hover:text-white transition-colors"
            >
                Sign Out
            </button> */}
            <Link
                href="/account"
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-sm text-white transition-colors"
            >
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-[10px] font-bold">
                    {user.email?.charAt(0).toUpperCase()}
                </div>
                <span>Account</span>
            </Link>
        </div>
    );
}
