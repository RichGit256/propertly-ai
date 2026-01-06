import Link from "next/link";

export const stripe = {
    // Stub function for checkout - in real app this would call Stripe API and return a session URL
    checkout: async (priceId: string) => {
        console.log(`[Stripe Stub] Creating checkout session for ${priceId}`);
        // Return a mock URL that would "redirect" the user
        return {
            url: `/success?session_id=mock_session_${Math.random().toString(36).substring(7)}`,
            success: true
        }
    }
}

export const PLANS = [
    {
        id: "price_pay_as_you_go",
        name: "Single Enhance",
        price: "£1.50",
        credits: 1,
        features: ["Standard Enhancement", "No Watermark (After Pay)"]
    },
    {
        id: "price_agent_bundle",
        name: "Agent Bundle",
        price: "£12.00",
        credits: 10,
        features: ["10 Enhancements", "Priority Processing", "Bulk Discount"]
    },
    {
        id: "price_pro_bundle",
        name: "Pro Bundle",
        price: "£50.00",
        credits: 50,
        features: ["50 Enhancements", "Magic Edit Access", "24/7 Support"]
    }
];
