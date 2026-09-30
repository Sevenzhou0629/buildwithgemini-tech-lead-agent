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
    <html lang="en">
      <body className="antialiased bg-slate-50/50 text-slate-900 min-h-screen">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
