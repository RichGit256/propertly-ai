"use client";

import { useTheme } from "../ThemeProvider";
import { LogOut, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "../Toast";

export function DangerZone() {
    const { theme } = useTheme();
    const router = useRouter();
    const { addToast } = useToast();

    const handleSignOut = async () => {
        if (!supabase) return;
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
        addToast("Signed out successfully", "success");
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure? This action cannot be undone.")) return;
        // In a real app, call API to delete user.
        // Here we just sign out and show a "deleted" toast.
        await handleSignOut();
        addToast("Account deleted (Mock)", "success");
    };

    return (
        <div className={`p-6 rounded-3xl border border-red-500/10 ${theme === 'light' ? 'bg-red-50' : 'bg-red-500/5'}`}>
            {/* <h3 className="text-xl font-bold mb-6 text-red-500">Danger Zone</h3> */}
            <div className="mb-6" />

            <div className="space-y-4">
                <button
                    onClick={handleSignOut}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-colors ${theme === 'light'
                        ? 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                        : 'bg-black border-white/5 hover:bg-white/5 text-white/70'
                        }`}>
                    <LogOut className="w-5 h-5 opacity-70" />
                    <span className="font-medium">Log Out</span>
                </button>

                <button
                    onClick={handleDelete}
                    className="w-full flex items-center gap-3 p-4 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors"
                >
                    <Trash2 className="w-5 h-5 opacity-70" />
                    <span className="font-medium">Delete Account</span>
                </button>
            </div>
        </div>
    );
}
