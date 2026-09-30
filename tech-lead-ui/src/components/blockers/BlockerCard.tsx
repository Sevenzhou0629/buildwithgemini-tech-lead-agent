"use client";

import React from "react";
import { Blocker } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useUIStore } from "@/store/uiStore";
import { AlertOctagon, User, Clock, ArrowRight, Network, Sparkles, FileText } from "lucide-react";
import Link from "next/link";

interface BlockerCardProps {
  blocker: Blocker;
}

export const BlockerCard: React.FC<BlockerCardProps> = ({ blocker }) => {
  const { openInspector, setScopeQueryText } = useUIStore();

  return (
    <div className="bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700/80 rounded-xl p-4 transition shadow-sm space-y-3">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded border border-zinc-800">
              {blocker.affectedWorkstream}
            </span>
            <span className="text-xs text-zinc-400 font-mono">Age: {blocker.age}</span>
          </div>
          <h4 className="text-sm font-semibold text-zinc-100 leading-snug">{blocker.title}</h4>
        </div>
        <StatusBadge status={blocker.status} />
      </div>

      {/* Impact description */}
      <p className="text-xs text-zinc-300 leading-relaxed font-sans">{blocker.impactDescription}</p>

      {/* Meta tags & dependencies */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 pt-1">
        <span className="flex items-center">
          <User className="w-3.5 h-3.5 mr-1 text-zinc-400" />
          Owner: <strong className="text-zinc-200 ml-1">@{blocker.owner}</strong>
        </span>
        {blocker.relatedJira && (
          <span className="font-mono text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded border border-blue-500/20 text-[11px]">
            {blocker.relatedJira}
          </span>
        )}
        {blocker.relatedPR && (
          <span className="font-mono text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/20 text-[11px]">
            {blocker.relatedPR}
          </span>
        )}
        <span className="text-[11px] text-zinc-400">Activity: {blocker.latestActivity}</span>
      </div>

      {/* Dependency badges */}
      {blocker.dependencies.length > 0 && (
        <div className="flex items-center space-x-1.5 text-[11px] font-mono text-zinc-400">
          <span>Depends on:</span>
          {blocker.dependencies.map((dep) => (
            <span key={dep} className="bg-zinc-900 text-zinc-300 px-1.5 py-0.5 rounded border border-zinc-800">
              {dep}
            </span>
          ))}
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 border-t border-zinc-900 flex items-center justify-between">
        <button
          onClick={() => openInspector(blocker.evidenceIds[0])}
          className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center transition"
        >
          <FileText className="w-3.5 h-3.5 mr-1" />
          <span>Inspect Evidence ({blocker.evidenceIds.length})</span>
        </button>

        <div className="flex items-center space-x-2">
          <Link
            href="/project/ai-doc-split/visuals"
            className="text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded border border-zinc-800 flex items-center transition"
          >
            <Network className="w-3 h-3 mr-1" />
            <span>Dependency Graph</span>
          </Link>
          <Link
            href="/project/ai-doc-split/chat"
            onClick={() => setScopeQueryText(`How can we unblock "${blocker.title}"?`)}
            className="text-xs bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 px-2.5 py-1 rounded border border-indigo-500/30 flex items-center transition"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            <span>Ask Agent</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
