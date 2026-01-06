"use client";

import Link from "next/link";
import AuthButton from "./AuthButton";
import { usePathname, useRouter } from "next/navigation";

export default function Header() {
    const pathname = usePathname();
    const router = useRouter();

    const handleHomeClick = (e: React.MouseEvent) => {
        if (pathname === "/") {
            e.preventDefault();
            window.dispatchEvent(new Event("reset-app"));
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between pointer-events-none">
            <Link href="/" onClick={handleHomeClick} className="pointer-events-auto">
                <h1 className="text-xl font-semibold tracking-tight text-foreground flex items-center gap-2">
                    propertly.ai
                </h1>
            </Link>

            <div className="pointer-events-auto flex items-center gap-4">
                <Link
                    href="/"
                    onClick={handleHomeClick}
                    className="p-2 rounded-full overflow-hidden bg-secondary/50 hover:bg-secondary border border-border text-muted-foreground hover:text-foreground transition-all"
                    title="Go to Dashboard"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                </Link>
                <AuthButton />
            </div>
        </header>
    );
}
