"use client";

import React from "react";
import { Decision } from "@/types";
import { useUIStore } from "@/store/uiStore";
import { GitCommit, Sparkles, FileText, CheckCircle2, Circle } from "lucide-react";
import Link from "next/link";

export const DecisionCard: React.FC<{ decision: Decision }> = ({ decision }) => {
  const { openInspector, setScopeQueryText } = useUIStore();

  return (
    <div className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 transition shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded font-semibold">
              DECISION INBOX
            </span>
            <span className="text-xs text-zinc-400 font-mono">Blocks: {decision.blocksWorkstream}</span>
          </div>
          <h4 className="text-sm font-semibold text-zinc-100">{decision.title}</h4>
        </div>
        <span className="text-xs font-mono px-2 py-0.5 rounded border border-amber-500/20 text-amber-400 bg-amber-500/10">
          {decision.status}
        </span>
      </div>

      {/* Options */}
      <div className="space-y-2 pt-1">
        <span className="text-[11px] font-mono uppercase text-zinc-400">Evaluated Alternatives</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {decision.options.map((opt) => (
            <div key={opt.id} className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-2.5 space-y-1 text-xs">
              <div className="font-semibold text-zinc-200 flex items-center">
                <Circle className="w-3 h-3 text-zinc-400 mr-1.5" />
                <span>{opt.title}</span>
              </div>
              <p className="text-zinc-400 text-[11px] leading-relaxed">{opt.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-400">
        <div className="flex items-center space-x-3">
          <span>Owner: <strong className="text-zinc-200">@{decision.owner}</strong></span>
          <button
            onClick={() => openInspector(decision.evidenceIds[0])}
            className="hover:text-zinc-200 underline flex items-center"
          >
            <FileText className="w-3 h-3 mr-1" /> Context Sources ({decision.evidenceIds.length})
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            disabled
            title="Read-only mode active: Destructive writes disabled."
            className="text-xs bg-zinc-900 text-zinc-400 px-2.5 py-1 rounded border border-zinc-800 cursor-not-allowed"
          >
            Record Decision
          </button>
          <Link
            href="/project/ai-doc-split/chat"
            onClick={() => setScopeQueryText(`Help resolve the decision between options for "${decision.title}".`)}
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
