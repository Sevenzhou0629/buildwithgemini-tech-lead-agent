"use client";

import React from "react";
import { Conflict } from "@/types";
import { SourceBadge } from "@/components/shared/SourceBadge";
import { useUIStore } from "@/store/uiStore";
import { Split, AlertOctagon, Sparkles, FileText } from "lucide-react";
import Link from "next/link";

export const ConflictView: React.FC<{ conflict: Conflict }> = ({ conflict }) => {
  const { openInspector, setScopeQueryText } = useUIStore();

  return (
    <div className="bg-purple-950/20 border border-purple-500/30 rounded-xl p-4 shadow-sm space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Split className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
            Cross-System Discrepancy
          </span>
        </div>
        <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded font-bold">
          {conflict.severity}
        </span>
      </div>

      <h4 className="text-sm font-semibold text-slate-900">{conflict.title}</h4>

      {/* Contradicting Claims */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="bg-white/80 border border-slate-200 p-3 rounded-lg space-y-1">
          <div className="flex items-center justify-between">
            <SourceBadge sourceType={conflict.claimA.source} externalId={conflict.claimA.entityId} />
            <span className="text-[10px] font-mono text-slate-500">Claim A</span>
          </div>
          <p className="text-slate-800 font-mono text-[11px] pt-1">{conflict.claimA.statement}</p>
        </div>

        <div className="bg-white/80 border border-slate-200 p-3 rounded-lg space-y-1">
          <div className="flex items-center justify-between">
            <SourceBadge sourceType={conflict.claimB.source} externalId={conflict.claimB.entityId} />
            <span className="text-[10px] font-mono text-slate-500">Claim B</span>
          </div>
          <p className="text-slate-800 font-mono text-[11px] pt-1">{conflict.claimB.statement}</p>
        </div>
      </div>

      {/* Interpretation */}
      <div className="text-xs text-slate-700 leading-relaxed bg-slate-50/60 p-2.5 rounded-lg border border-slate-200/80">
        <strong className="text-indigo-300 block mb-0.5">Agent Operational Diagnosis:</strong>
        {conflict.agentInterpretation}
      </div>

      {/* Footer */}
      <div className="pt-2 border-t border-purple-500/20 flex items-center justify-between text-xs">
        <button
          onClick={() => openInspector(conflict.evidenceIds[0])}
          className="text-slate-500 hover:text-slate-800 flex items-center transition"
        >
          <FileText className="w-3.5 h-3.5 mr-1" />
          <span>Inspect Supporting Evidence</span>
        </button>

        <Link
          href="/project/ai-doc-split/chat"
          onClick={() => setScopeQueryText(`Help resolve the cross-source conflict: "${conflict.title}" between Jira and GitHub.`)}
          className="text-xs bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 px-3 py-1.5 rounded-md border border-indigo-500/30 flex items-center transition"
        >
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          <span>Ask Agent to Reconcile</span>
        </Link>
      </div>
    </div>
  );
};
