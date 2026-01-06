"use client";

import { useTheme } from "../ThemeProvider";
import { Lock, Mail, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "../Toast";

export function SecurityForm() {
    const { theme } = useTheme();
    const { addToast } = useToast();

    const [editing, setEditing] = useState<"password" | "email" | null>(null);
    const [loading, setLoading] = useState(false);

    // Form States
    const [password, setPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");

    const toggleEdit = (mode: "password" | "email") => {
        if (editing === mode) {
            setEditing(null);
        } else {
            setEditing(mode);
        }
    };

    const handleUpdatePassword = async () => {
        if (!password) return;
        setLoading(true);
        if (!supabase) return;

        const { error } = await supabase.auth.updateUser({ password: password });

        if (error) {
            addToast(error.message, "error");
        } else {
            addToast("Password updated successfully", "success");
            setEditing(null);
            setPassword("");
        }
        setLoading(false);
    };

    const handleUpdateEmail = async () => {
        if (!newEmail) return;
        setLoading(true);
        if (!supabase) return;

        const { error } = await supabase.auth.updateUser({ email: newEmail });

        if (error) {
            addToast(error.message, "error");
        } else {
            // Usually requires verification
            addToast("Confirmation email sent to new address", "success");
            setEditing(null);
            setNewEmail("");
        }
        setLoading(false);
    };

    const cardClass = theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#0A0A0A] border-white/10';
    const inputClass = theme === 'light' ? 'bg-gray-50 border-gray-200 text-black' : 'bg-white/5 border-white/10 text-white';
    const buttonClass = theme === 'light' ? 'bg-black text-white hover:bg-gray-800' : 'bg-white text-black hover:bg-gray-200';

    return (
        <div className={`p-6 rounded-3xl border ${cardClass}`}>
            <h3 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-black' : 'text-white'}`}>Security</h3>

            <div className="space-y-4">
                {/* Change Password */}
                <div className={`rounded-xl border border-transparent overflow-hidden transition-all ${editing === 'password' ? (theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10') : ''}`}>
                    <button
                        onClick={() => toggleEdit("password")}
                        className={`w-full flex items-center justify-between p-4 transition-colors ${!editing && (theme === 'light' ? 'bg-gray-50 hover:bg-gray-100 rounded-xl' : 'bg-white/5 hover:bg-white/10 rounded-xl')
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Lock className={`w-5 h-5 ${theme === 'light' ? 'text-black' : 'text-white'} opacity-70`} />
                            <span className={`font-medium ${theme === 'light' ? 'text-black' : 'text-white'}`}>Change Password</span>
                        </div>
                        {editing === 'password' ? <ChevronUp className="w-4 h-4 opacity-50" /> : <span className="text-xs opacity-50 uppercase tracking-widest">Update</span>}
                    </button>

                    {editing === 'password' && (
                        <div className="p-4 pt-0 space-y-4 animate-in slide-in-from-top-2 fade-in">
                            <input
                                type="password"
                                placeholder="New Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`w-full p-3 rounded-lg border outline-none focus:ring-2 ring-blue-500/50 ${inputClass}`}
                            />
                            <button
                                onClick={handleUpdatePassword}
                                disabled={loading || !password}
                                className={`w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 ${buttonClass}`}
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Update Password
                            </button>
                        </div>
                    )}
                </div>

                {/* Update Email */}
                <div className={`rounded-xl border border-transparent overflow-hidden transition-all ${editing === 'email' ? (theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-white/5 border-white/10') : ''}`}>
                    <button
                        onClick={() => toggleEdit("email")}
                        className={`w-full flex items-center justify-between p-4 transition-colors ${!editing && (theme === 'light' ? 'bg-gray-50 hover:bg-gray-100 rounded-xl' : 'bg-white/5 hover:bg-white/10 rounded-xl')
                            }`}
                    >
                        <div className="flex items-center gap-3">
                            <Mail className={`w-5 h-5 ${theme === 'light' ? 'text-black' : 'text-white'} opacity-70`} />
                            <span className={`font-medium ${theme === 'light' ? 'text-black' : 'text-white'}`}>Update Email</span>
                        </div>
                        {editing === 'email' ? <ChevronUp className="w-4 h-4 opacity-50" /> : <span className="text-xs opacity-50 uppercase tracking-widest">Edit</span>}
                    </button>

                    {editing === 'email' && (
                        <div className="p-4 pt-0 space-y-4 animate-in slide-in-from-top-2 fade-in">
                            <input
                                type="email"
                                placeholder="New Email Address"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className={`w-full p-3 rounded-lg border outline-none focus:ring-2 ring-blue-500/50 ${inputClass}`}
                            />
                            <div className={`text-xs p-3 rounded-lg ${theme === 'light' ? 'bg-blue-50 text-blue-600' : 'bg-blue-500/10 text-blue-400'}`}>
                                Note: You will need to verify the new email address.
                            </div>
                            <button
                                onClick={handleUpdateEmail}
                                disabled={loading || !newEmail}
                                className={`w-full py-2.5 rounded-lg font-medium text-sm flex items-center justify-center gap-2 disabled:opacity-50 ${buttonClass}`}
                            >
                                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                                Send Verification
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
