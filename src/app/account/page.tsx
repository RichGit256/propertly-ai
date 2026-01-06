"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { motion } from "framer-motion";

// Components
import { ProfileCard } from "@/components/account/ProfileCard";
import { SubscriptionCard } from "@/components/account/SubscriptionCard";
import { SecurityForm } from "@/components/account/SecurityForm";
import { PreferencesCard } from "@/components/account/PreferencesCard";
import { DangerZone } from "@/components/account/DangerZone";
import { HistoryList } from "@/components/account/HistoryList";

export default function AccountPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [credits, setCredits] = useState(0);
    const [isPro, setIsPro] = useState(false);

    useEffect(() => {
        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push("/");
                return;
            }
            setUser(user);

            // Fetch credits/pro status
            const { data: creditData } = await supabase
                .from("user_credits")
                .select("credits_remaining, is_pro_member")
                .eq("user_id", user.id)
                .single();

            if (creditData) {
                setCredits(creditData.credits_remaining);
                setIsPro(creditData.is_pro_member);
            }

            setLoading(false);
        };

        checkUser();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <main className="min-h-screen pt-24 pb-12 px-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400 inline-block mb-2">
                        Account Settings
                    </h1>
                    <p className="opacity-60 text-lg">Manage your profile, preferences, and subscription.</p>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    <div className="space-y-6">
                        <ProfileCard user={user} />
                        <SubscriptionCard credits={credits} isPro={isPro} />
                    </div>

                    <div className="space-y-6">
                        <PreferencesCard />
                        <SecurityForm />
                        <DangerZone />
                    </div>
                </motion.div>

                {/* History Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="pt-8 border-t border-white/10"
                >
                    {user && <HistoryList userId={user.id} />}
                </motion.div>
            </div>
        </main>
    );
}
