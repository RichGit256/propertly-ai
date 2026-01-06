"use client";

import { useState, useEffect } from "react";
import { SubscriptionModal } from "@/components/SubscriptionModal";

export function GlobalSubscriptionListener() {
    const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

    useEffect(() => {
        // Define the handler
        const handleOpenSub = () => setShowSubscriptionModal(true);

        // Listen for custom events
        window.addEventListener('open-subscription', handleOpenSub);

        // Initial check (optional, if we wanted to trigger on load via URL params etc)

        return () => {
            window.removeEventListener('open-subscription', handleOpenSub);
        };
    }, []);

    return (
        <SubscriptionModal
            isOpen={showSubscriptionModal}
            onClose={() => setShowSubscriptionModal(false)}
        />
    );
}
