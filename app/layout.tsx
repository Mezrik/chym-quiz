import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

import { Providers } from "./providers";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <Providers>
          <main className="relative container mx-auto max-w-7xl z-10 px-6 mb-12 flex-grow min-h-screen">
            <ModeToggle />
            <div className="grid grid-cols-12">{children}</div>
          </main>
        </Providers>
      </body>
    </html>
  );
}
