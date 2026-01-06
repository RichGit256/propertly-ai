"use client";

import { Twitter, Instagram, Linkedin, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="w-full border-t border-border bg-card/40 backdrop-blur-md mt-auto">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2 space-y-4">
                        <div className="relative h-10 w-40">
                            <Image
                                src="/logo-high-res.jpg"
                                alt="Propertly.ai"
                                fill
                                className="object-contain object-left"
                            />
                        </div>
                        <h4 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
                            propertly.ai
                        </h4>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                            The advanced AI enhancement suite for modern real estate agents.
                            Turn listing photos into sales with a single click.
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="space-y-4">
                        <h4 className="text-foreground font-medium">Contact Us</h4>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <a href="mailto:hello@propertly.ai" className="flex items-center gap-2 hover:text-foreground transition-colors">
                                <Mail className="w-4 h-4" />
                                hello@propertly.ai
                            </a>
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Aberdeen, UK
                            </div>
                        </div>
                    </div>

                    {/* Socials */}
                    <div className="space-y-4">
                        <h4 className="text-foreground font-medium">Follow Us</h4>
                        <div className="flex gap-4">
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors border border-border"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors border border-border"
                            >
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg bg-secondary/50 hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors border border-border"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground/60">
                    <p>&copy; {new Date().getFullYear()} Propertly AI Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="/terms" className="hover:text-muted-foreground">Terms</Link>
                        <Link href="/privacy" className="hover:text-muted-foreground">Privacy</Link>
                        <Link href="/cookies" className="hover:text-muted-foreground">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
