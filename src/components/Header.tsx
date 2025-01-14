"use client";

import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Ensures theme is only accessed after client-side rendering (prevents hydration issues)
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
            <div className="backdrop-blur-md bg-white/70 dark:bg-black/70 rounded-full border px-6 py-3">
                <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image
                            src="/aicrostrategy.png"
                            alt="AicroStrategy Logo"
                            width={160}
                            height={32}
                        />
                    </Link>
                    <nav className="flex items-center gap-6">
                        <Link
                            href="https://dexscreener.com/base/0x197ecb5c176ad4f6e77894913a94c5145416f148"
                            className="text-sm font-medium transition-colors hover:text-primary"
                            target="_blank"
                        >
                            DexScreener
                        </Link>
                        <Link
                            href="https://t.me/aicrostrategy_dao"
                            className="text-sm font-medium transition-colors hover:text-primary"
                            target="_blank"
                        >
                            Telegram
                        </Link>
                        <Link
                            href="https://x.com/AicroStrategy"
                            className="text-sm font-medium transition-colors hover:text-primary"
                            target="_blank"
                        >
                            Twitter
                        </Link>
                        <Link
                            href="/stats"
                            className="text-sm font-medium transition-colors hover:text-primary"
                        >
                            Stats
                        </Link>

                        {/* Theme Toggle Button */}
                        {mounted && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            >
                                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                            </Button>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
