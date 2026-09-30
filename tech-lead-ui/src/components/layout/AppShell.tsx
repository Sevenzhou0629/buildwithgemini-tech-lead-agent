"use client";

import React from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { EvidenceInspector } from "./EvidenceInspector";
import { CommandPalette } from "./CommandPalette";

export const AppShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500/30">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-zinc-900/30 p-6">
          {children}
        </main>
        <EvidenceInspector />
      </div>
      <CommandPalette />
    </div>
  );
};
