"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils"; // Utility function for conditional classes

export function Header() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
            <div className="backdrop-blur-md bg-white/70 dark:bg-black/70 rounded-full border px-6 py-3">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="/aicrostrategy.png"
                            alt="AicroStrategy Logo"
                            width={160}
                            height={32}
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-6">
                        <Link
                            href="https://dexscreener.com/base/0x197ecb5c176ad4f6e77894913a94c5145416f148"
                            className="text-sm font-medium text-gray-900 dark:text-white transition-colors hover:text-primary"
                            target="_blank"
                        >
                            DexScreener
                        </Link>
                        <Link
                            href="https://t.me/aicrostrategy_dao"
                            className="text-sm font-medium text-gray-900 dark:text-white transition-colors hover:text-primary"
                            target="_blank"
                        >
                            Telegram
                        </Link>
                        <Link
                            href="https://x.com/AicroStrategy"
                            className="text-sm font-medium text-gray-900 dark:text-white transition-colors hover:text-primary"
                            target="_blank"
                        >
                            Twitter
                        </Link>
                        <Link
                            href="/stats"
                            className="text-sm font-medium text-gray-900 dark:text-white transition-colors hover:text-primary"
                        >
                            Stats
                        </Link>

                        {/* Theme Toggle Button */}
                        {mounted && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    setTheme(
                                        theme === "dark" ? "light" : "dark"
                                    )
                                }
                            >
                                {theme === "dark" ? (
                                    <Sun className="w-5 h-5 text-gray-900 dark:text-white" />
                                ) : (
                                    <Moon className="w-5 h-5 text-gray-900 dark:text-white" />
                                )}
                            </Button>
                        )}
                    </nav>

                    {/* Mobile Burger Menu */}
                    <button
                        className="md:hidden p-2 rounded-md focus:outline-none focus:ring"
                        onClick={() => setMenuOpen(true)}
                    >
                        <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay (hidden on desktop) */}
            <div
                className={cn(
                    "fixed inset-0 z-40 transition-opacity", // Set the backdrop to bg-background
                    menuOpen ? "opacity-100 visible" : "opacity-0 invisible",
                    "md:hidden" // Hidden on desktop
                )}
                onClick={() => setMenuOpen(false)}
            ></div>

            {/* Sliding Mobile Menu (hidden on desktop) */}
            <div
                className={cn(
                    "fixed top-0 right-0 h-full transition-transform bg-background", // Set the menu background to bg-background
                    menuOpen ? "translate-x-0" : "translate-x-full", // Slide from the right
                    "md:hidden", // Hidden on desktop
                    "w-[95vw]", // Take 100% of the viewport width when open
                    "h-[100vh]"
                )}
            >
                <div className="p-6 flex flex-col items-center justify-center space-y-6 bg-background">
                    {/* Close Button (only for mobile) */}
                    <button
                        className="self-end p-2 md:hidden text-red-500"
                        onClick={() => setMenuOpen(false)}
                    >
                        <X className="w-6 h-6" />
                    </button>
                    {/* Navigation Links */}
                    <Link
                        href="/"
                        className="text-lg font-medium text-gray-900 dark:text-white"
                        onClick={() => setMenuOpen(false)}
                    >
                        Home
                    </Link>
                    <hr className="border-t border-red-500 w-3/5 my-2" />{" "}
                    {/* Horizontal line */}
                    <Link
                        href="https://dexscreener.com/base/0x197ecb5c176ad4f6e77894913a94c5145416f148"
                        className="text-lg font-medium text-gray-900 dark:text-white"
                        target="_blank"
                        onClick={() => setMenuOpen(false)}
                    >
                        DexScreener
                    </Link>
                    <hr className="border-t border-red-500 w-3/5 my-2" />{" "}
                    {/* Horizontal line */}
                    <Link
                        href="https://t.me/aicrostrategy_dao"
                        className="text-lg font-medium text-gray-900 dark:text-white"
                        target="_blank"
                        onClick={() => setMenuOpen(false)}
                    >
                        Telegram
                    </Link>
                    <hr className="border-t border-red-500 w-3/5 my-2" />{" "}
                    {/* Horizontal line */}
                    <Link
                        href="https://x.com/AicroStrategy"
                        className="text-lg font-medium text-gray-900 dark:text-white"
                        target="_blank"
                        onClick={() => setMenuOpen(false)}
                    >
                        Twitter
                    </Link>
                    <hr className="border-t border-red-500 w-3/5 my-2" />{" "}
                    {/* Horizontal line */}
                    <Link
                        href="/stats"
                        className="text-lg font-medium text-gray-900 dark:text-white"
                        onClick={() => setMenuOpen(false)}
                    >
                        Stats
                    </Link>
                    <hr className="border-t border-red-500 w-3/5 my-2" />{" "}
                    {/* Horizontal line */}
                    {/* Theme Toggle Button */}
                    <div
                        className={`text-lg font-medium mt-6 ${
                            theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                    >
                        <span>Theme Toggle</span>
                        {mounted && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() =>
                                    setTheme(
                                        theme === "dark" ? "light" : "dark"
                                    )
                                }
                                className="ml-2"
                            >
                                {theme === "dark" ? (
                                    <Sun className="w-5 h-5 text-gray-900 dark:text-white" />
                                ) : (
                                    <Moon className="w-5 h-5 text-gray-900 dark:text-white" />
                                )}
                            </Button>
                        )}
                        <div className="mt-20 flex justify-center">
                            <Image
                                src="/aicrostrategy-logo.png"
                                alt="Image Description"
                                width={50}
                                height={50}
                                className="rounded-lg"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
