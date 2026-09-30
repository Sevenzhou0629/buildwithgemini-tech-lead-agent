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
    <div className="bg-white border border-slate-200/80 hover:border-slate-300/80 rounded-xl p-4 transition shadow-sm space-y-3">
      {/* Top Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              {blocker.affectedWorkstream}
            </span>
            <span className="text-xs text-slate-500 font-mono">Age: {blocker.age}</span>
          </div>
          <h4 className="text-sm font-semibold text-slate-900 leading-snug">{blocker.title}</h4>
        </div>
        <StatusBadge status={blocker.status} />
      </div>

      {/* Impact description */}
      <p className="text-xs text-slate-700 leading-relaxed font-sans">{blocker.impactDescription}</p>

      {/* Meta tags & dependencies */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
        <span className="flex items-center">
          <User className="w-3.5 h-3.5 mr-1 text-slate-500" />
          Owner: <strong className="text-slate-800 ml-1">@{blocker.owner}</strong>
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
        <span className="text-[11px] text-slate-500">Activity: {blocker.latestActivity}</span>
      </div>

      {/* Dependency badges */}
      {blocker.dependencies.length > 0 && (
        <div className="flex items-center space-x-1.5 text-[11px] font-mono text-slate-500">
          <span>Depends on:</span>
          {blocker.dependencies.map((dep) => (
            <span key={dep} className="bg-slate-50 text-slate-700 px-1.5 py-0.5 rounded border border-slate-200">
              {dep}
            </span>
          ))}
        </div>
      )}

      {/* Action Footer */}
      <div className="pt-2 border-t border-zinc-900 flex items-center justify-between">
        <button
          onClick={() => openInspector(blocker.evidenceIds[0])}
          className="text-xs text-slate-500 hover:text-slate-800 flex items-center transition"
        >
          <FileText className="w-3.5 h-3.5 mr-1" />
          <span>Inspect Evidence ({blocker.evidenceIds.length})</span>
        </button>

        <div className="flex items-center space-x-2">
          <Link
            href="/project/ai-doc-split/visuals"
            className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded border border-slate-200 flex items-center transition"
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
