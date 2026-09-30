"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUIStore } from "@/store/uiStore";
import { 
  Search, 
  LayoutDashboard, 
  AlertOctagon, 
  AlertTriangle, 
  GitCommit, 
  CheckCircle, 
  Users, 
  Network, 
  Sparkles,
  History,
  X
} from "lucide-react";

export const CommandPalette: React.FC = () => {
  const router = useRouter();
  const { isCommandPaletteOpen, setCommandPaletteOpen, setScopeQueryText } = useUIStore();
  const [query, setQuery] = useState("");

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === "Escape" && isCommandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isCommandPaletteOpen, setCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const commands = [
    { label: "Overview", icon: LayoutDashboard, path: "/project/ai-doc-split" },
    { label: "Show Blockers", icon: AlertOctagon, path: "/project/ai-doc-split/blockers" },
    { label: "Show Risks", icon: AlertTriangle, path: "/project/ai-doc-split/risks" },
    { label: "Show Changes", icon: History, path: "/project/ai-doc-split/changes" },
    { label: "Review Decisions", icon: GitCommit, path: "/project/ai-doc-split/decisions" },
    { label: "Launch Readiness", icon: CheckCircle, path: "/project/ai-doc-split/readiness" },
    { label: "View People & Work", icon: Users, path: "/project/ai-doc-split/people" },
    { label: "Visualizations Workspace", icon: Network, path: "/project/ai-doc-split/visuals" },
    { label: "Ask Agent", icon: Sparkles, path: "/project/ai-doc-split/chat" },
  ];

  const filteredCommands = commands.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    setCommandPaletteOpen(false);
    router.push(path);
  };

  const handleCustomAsk = () => {
    if (!query.trim()) return;
    setScopeQueryText(query);
    setCommandPaletteOpen(false);
    router.push("/project/ai-doc-split/chat");
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 px-4">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        <div className="flex items-center px-4 border-b border-slate-200">
          <Search className="w-4 h-4 text-slate-500 mr-2" />
          <input
            autoFocus
            type="text"
            placeholder="Type a command or ask a project question... (Press Enter to ask)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCustomAsk()}
            className="w-full bg-transparent py-3.5 text-sm text-slate-900 placeholder:text-slate-500 focus:outline-none"
          />
          <button
            onClick={() => setCommandPaletteOpen(false)}
            className="text-slate-500 hover:text-slate-800 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-72 overflow-y-auto p-2 space-y-1">
          {query.trim() && (
            <div
              onClick={handleCustomAsk}
              className="flex items-center px-3 py-2 text-xs rounded-md text-indigo-400 hover:bg-indigo-950/40 cursor-pointer transition border border-indigo-500/20"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              <span>Ask Agent: "{query}"</span>
            </div>
          )}

          {filteredCommands.map((cmd) => {
            const Icon = cmd.icon;
            return (
              <div
                key={cmd.path}
                onClick={() => handleSelect(cmd.path)}
                className="flex items-center justify-between px-3 py-2 text-xs rounded-md text-slate-700 hover:text-slate-900 hover:bg-slate-50 cursor-pointer transition"
              >
                <div className="flex items-center space-x-2.5">
                  <Icon className="w-4 h-4 text-slate-500" />
                  <span>{cmd.label}</span>
                </div>
                <span className="text-[10px] text-slate-500 font-mono">Jump</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
