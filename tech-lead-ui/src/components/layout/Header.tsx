"use client";

import React from "react";
import { useUIStore } from "@/store/uiStore";
import { 
  RefreshCw, 
  Search, 
  Terminal, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  Sparkles
} from "lucide-react";
import Link from "next/link";

export const Header: React.FC = () => {
  const { setCommandPaletteOpen, toggleInspector, isInspectorOpen } = useUIStore();

  return (
    <header className="h-14 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur px-4 flex items-center justify-between sticky top-0 z-30">
      {/* Left: Project title & milestone */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm text-zinc-100">AI Document Splitting</span>
            <span className="text-xs bg-zinc-800 text-zinc-300 font-mono px-2 py-0.5 rounded border border-zinc-700">
              PRT Launch
            </span>
          </div>
          <p className="text-[11px] text-zinc-400">State reconstructed 2m ago across 4 systems</p>
        </div>
      </div>

      {/* Middle: Connected MCP Sources */}
      <div className="hidden md:flex items-center space-x-3 text-xs font-mono text-zinc-400 bg-zinc-900/60 px-3 py-1.5 rounded-full border border-zinc-800/80">
        <span className="text-zinc-400 font-sans text-[11px]">MCP:</span>
        <span className="flex items-center text-emerald-400">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Jira
        </span>
        <span className="flex items-center text-emerald-400">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Slack
        </span>
        <span className="flex items-center text-emerald-400">
          <CheckCircle2 className="w-3 h-3 mr-1" /> GitHub
        </span>
        <span className="flex items-center text-emerald-400">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Confluence
        </span>
      </div>

      {/* Right: Quick actions & Inspector toggle */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center space-x-2 text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-3 py-1.5 rounded-md border border-zinc-800 transition"
        >
          <Search className="w-3.5 h-3.5 text-zinc-400" />
          <span>Search or Cmd+K</span>
          <kbd className="hidden sm:inline-block text-[10px] bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800 font-mono text-zinc-400">
            ⌘K
          </kbd>
        </button>

        <Link
          href="/project/ai-doc-split/chat"
          className="flex items-center space-x-1.5 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1.5 rounded-md transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask Agent</span>
        </Link>

        <button
          onClick={toggleInspector}
          className={`text-xs px-2.5 py-1.5 rounded-md border transition ${
            isInspectorOpen
              ? "bg-zinc-800 text-zinc-100 border-zinc-700"
              : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-zinc-800"
          }`}
          title="Toggle Evidence Inspector"
        >
          Inspector
        </button>
      </div>
    </header>
  );
};
