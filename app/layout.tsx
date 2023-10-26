import AppHeader from "@/components/layout/header/app-header";
import MobileNav from "@/components/layout/mobile-nav";
import ModalProvider from "@/components/providers/modal-provider";
import QueryProvider from "@/components/providers/query-provider";
import SessionProvider from "@/components/providers/session-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AppFooter from "@/components/layout/footer/app-footer";
import { SocketProvider } from "@/components/providers/socket-provider";

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
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} relative min-h-[100vh] pb-16 bg-white dark:bg-zinc-900`}
      >
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            enableColorScheme
          >
            <SocketProvider>
              <QueryProvider>
                <AppHeader />
                <ModalProvider />
                <Toaster />
                <main className="container mx-auto max-w-8xl mt-3 px-4">
                  {children}
                </main>
                <MobileNav />
                <AppFooter />
              </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
