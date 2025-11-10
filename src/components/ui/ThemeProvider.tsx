"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Props for ThemeProvider wrapper
interface ThemeProviderProps {
  children: React.ReactNode;          // Components wrapped by provider
  attribute?: "class" | "data-theme"; // Which HTML attribute controls theme
  defaultTheme?: string;              // Default theme (e.g., "system", "light", "dark")
  enableSystem?: boolean;             // Allow following user's system preference
}

export function ThemeProvider({
  children,
  attribute = "class",
  defaultTheme = "system",
  enableSystem = true,
}: ThemeProviderProps) {
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <NextThemesProvider
      attribute={attribute}                   // Sets HTML attribute for theme
      defaultTheme={defaultTheme}             // Default theme value
      enableSystem={enableSystem}             // Respect user's OS preference
      disableTransitionOnChange={true}        // Avoid flash when theme changes
    >
      {children}
    </NextThemesProvider>
  );
}
