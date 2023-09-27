import SessionProvider from "@/components/providers/session-provider";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import AppHeader from "@/components/layout/header/app-header";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AniMost",
  description: "Your favourite anime library and streaming site.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} bg-white dark:bg-zinc-900`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            enableColorScheme
          >
            <AppHeader />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  );
}
