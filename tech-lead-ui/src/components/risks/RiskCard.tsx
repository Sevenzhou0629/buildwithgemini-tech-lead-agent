"use client";

import React from "react";
import { Risk } from "@/types";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useUIStore } from "@/store/uiStore";
import { AlertTriangle, ShieldCheck, User, Sparkles, FileText } from "lucide-react";
import Link from "next/link";

export const RiskCard: React.FC<{ risk: Risk }> = ({ risk }) => {
  const { openInspector, setScopeQueryText } = useUIStore();

  const impactColor =
    risk.impact === "HIGH" ? "text-rose-400 bg-rose-500/10 border-rose-500/20" : "text-amber-400 bg-amber-500/10 border-amber-500/20";

  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-4 transition shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${impactColor}`}>
              IMPACT: {risk.impact}
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
              {risk.affectedArea}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-slate-900">{risk.title}</h4>
        </div>
        <StatusBadge status={risk.status} />
      </div>

      <p className="text-xs text-slate-700 leading-relaxed font-sans">{risk.description}</p>

      {/* Mitigation */}
      <div className="bg-slate-50/60 border border-slate-200 rounded-lg p-2.5 text-xs">
        <span className="text-[10px] font-mono uppercase text-emerald-400 font-semibold block mb-0.5">
          Proposed Mitigation
        </span>
        <p className="text-slate-700 font-sans">{risk.mitigation}</p>
      </div>

      <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <span>Owner: <strong className="text-slate-800">@{risk.owner}</strong></span>
          <button
            onClick={() => openInspector(risk.evidenceIds[0])}
            className="hover:text-slate-800 ml-2 underline flex items-center"
          >
            <FileText className="w-3 h-3 mr-1" /> Evidence ({risk.evidenceIds.length})
          </button>
        </div>

        <Link
          href="/project/ai-doc-split/chat"
          onClick={() => setScopeQueryText(`What is the recommended mitigation plan for risk: "${risk.title}"?`)}
          className="text-xs bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 px-2.5 py-1 rounded border border-indigo-500/30 flex items-center transition"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          <span>Ask Agent</span>
        </Link>
      </div>
    </div>
  );
};
