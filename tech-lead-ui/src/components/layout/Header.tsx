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
    <header className="h-14 border-b border-slate-200/80 bg-white/95 backdrop-blur px-4 flex items-center justify-between sticky top-0 z-30 shadow-[0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Left: Project title & milestone */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
          <Layers className="w-4 h-4" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-sm text-slate-900">AI Document Splitting</span>
            <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded border border-slate-200">
              PRT Launch
            </span>
          </div>
          <p className="text-[11px] text-slate-500">State reconstructed 2m ago across 4 systems</p>
        </div>
      </div>

      {/* Middle: Connected MCP Sources */}
      <div className="hidden md:flex items-center space-x-3 text-xs font-mono text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
        <span className="text-slate-400 font-sans text-[11px]">MCP:</span>
        <span className="flex items-center text-emerald-600 font-medium">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Jira
        </span>
        <span className="flex items-center text-emerald-600 font-medium">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Slack
        </span>
        <span className="flex items-center text-emerald-600 font-medium">
          <CheckCircle2 className="w-3 h-3 mr-1" /> GitHub
        </span>
        <span className="flex items-center text-emerald-600 font-medium">
          <CheckCircle2 className="w-3 h-3 mr-1" /> Confluence
        </span>
      </div>

      {/* Right: Quick actions & Inspector toggle */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center space-x-2 text-xs bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-md border border-slate-200 shadow-xs transition"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden sm:inline">Ask / Jump...</span>
          <kbd className="hidden sm:inline-block font-mono text-[10px] bg-slate-100 px-1 rounded border border-slate-200 text-slate-500">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={toggleInspector}
          className={`text-xs px-3 py-1.5 rounded-md border transition flex items-center space-x-1.5 ${
            isInspectorOpen
              ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-medium"
              : "bg-white hover:bg-slate-50 text-slate-600 border-slate-200"
          }`}
        >
          <span>Evidence</span>
        </button>

        <Link
          href="/project/ai-doc-split/chat"
          className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 py-1.5 rounded-md shadow-xs transition flex items-center space-x-1"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Agent Console</span>
        </Link>
      </div>
    </header>
  );
};
