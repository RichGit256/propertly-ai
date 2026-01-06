"use client";

import { User } from "@supabase/supabase-js";
import { Mail, UserCircle } from "lucide-react";
import { useTheme } from "../ThemeProvider";

export function ProfileCard({ user }: { user: User | null }) {
    const { theme } = useTheme();

    if (!user) return null;

    return (
        <div className={`p-6 rounded-3xl border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#0A0A0A] border-white/10'}`}>
            <h3 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-black' : 'text-white'}`}>Profile</h3>

            <div className="flex items-center gap-4">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme === 'light' ? 'bg-gray-100 text-gray-400' : 'bg-white/5 text-white/20'
                    }`}>
                    <UserCircle className="w-10 h-10" />
                </div>

                <div className="space-y-1">
                    <div className={`text-sm font-medium flex items-center gap-2 ${theme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                        {user.email}
                    </div>
                    <div className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-white/40'}`}>
                        User ID: {user.id.slice(0, 8)}...
                    </div>
                </div>
            </div>
        </div>
    );
}
