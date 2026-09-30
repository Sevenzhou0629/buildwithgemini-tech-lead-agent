import type { Metadata } from "next";
import { AppShell } from "@/components/layout/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tech Lead Agent OS - Engineering Command Center",
  description: "Operational reasoning and cross-source reconciliation for engineering leads.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-zinc-950 text-zinc-100 min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
