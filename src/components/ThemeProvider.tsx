"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    // Prevents hydration issues (theme flickering)
    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return <>{children}</>; // Ensures no SSR flickering

    return <NextThemesProvider attribute="class" defaultTheme="system">{children}</NextThemesProvider>;
}
