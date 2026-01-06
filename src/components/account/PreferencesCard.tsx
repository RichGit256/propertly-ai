"use client";

import { useTheme } from "../ThemeProvider";
import { Moon, Sun } from "lucide-react";

export function PreferencesCard() {
    const { theme, setTheme } = useTheme();

    return (
        <div className={`p-6 rounded-3xl border ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-[#0A0A0A] border-white/10'}`}>
            <h3 className={`text-xl font-bold mb-6 ${theme === 'light' ? 'text-black' : 'text-white'}`}>Preferences</h3>

            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <div className={`font-medium ${theme === 'light' ? 'text-black' : 'text-white'}`}>Interface Theme</div>
                    <div className={`text-sm ${theme === 'light' ? 'text-gray-500' : 'text-white/40'}`}>
                        Switch between light and dark mode.
                    </div>
                </div>

                <div className={`flex items-center gap-1 p-1 rounded-full border ${theme === 'light' ? 'bg-gray-100 border-gray-200' : 'bg-black border-white/10'
                    }`}>
                    <button
                        onClick={() => setTheme("dark")}
                        className={`p-2 rounded-full transition-all ${theme === 'dark'
                                ? 'bg-[#1A1A1A] text-white shadow-sm'
                                : 'text-gray-400 hover:text-gray-600 dark:hover:text-white'
                            }`}
                    >
                        <Moon className="w-4 h-4" />
                    </button>
                    <button
                        onClick={() => setTheme("light")}
                        className={`p-2 rounded-full transition-all ${theme === 'light'
                                ? 'bg-white text-black shadow-sm'
                                : 'text-white/40 hover:text-white'
                            }`}
                    >
                        <Sun className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
