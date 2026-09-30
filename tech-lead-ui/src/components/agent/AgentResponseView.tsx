"use client";

import React from "react";
import { AgentChatMessage } from "@/types";
import { AgentInvestigation } from "./AgentInvestigation";
import { ConflictView } from "@/components/evidence/ConflictView";
import { BlockerCard } from "@/components/blockers/BlockerCard";
import { useUIStore } from "@/store/uiStore";
import { Sparkles, BrainCircuit, CheckSquare, Layers, FileText } from "lucide-react";

export const AgentResponseView: React.FC<{ message: AgentChatMessage }> = ({ message }) => {
  const { openInspector } = useUIStore();

  if (message.sender === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-2xl bg-zinc-800 text-zinc-100 px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm border border-zinc-700">
          {message.text}
        </div>
      </div>
    );
  }

  const { structuredData, investigationSteps, summaryStats } = message;

  return (
    <div className="flex justify-start space-x-3">
      <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0 mt-1">
        <BrainCircuit className="w-4 h-4" />
      </div>

      <div className="max-w-3xl flex-1 bg-zinc-950 border border-zinc-800 rounded-2xl rounded-tl-sm p-4 space-y-4 shadow-sm">
        {/* Prose text */}
        <p className="text-sm text-zinc-200 leading-relaxed font-sans">{message.text}</p>

        {/* Lightweight investigation progress */}
        {investigationSteps && investigationSteps.length > 0 && (
          <AgentInvestigation steps={investigationSteps} />
        )}

        {/* Sources Summary pill */}
        {summaryStats && (
          <div className="flex items-center space-x-2 text-xs text-zinc-400 font-mono bg-zinc-900/60 px-2.5 py-1 rounded border border-zinc-800 w-fit">
            <span>Checked {summaryStats.sourcesChecked} MCP sources</span>
            <span>·</span>
            <span>{summaryStats.evidenceItemsCount} evidence items analyzed</span>
          </div>
        )}

        {/* Structured: Verifiable Facts */}
        {structuredData?.facts && structuredData.facts.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-mono uppercase text-emerald-400 font-semibold tracking-wider">
              Verifiable Grounded Facts
            </span>
            <ul className="space-y-1 text-xs text-zinc-300">
              {structuredData.facts.map((fact, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-emerald-400 mr-2">✓</span>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Structured: Operational Inferences */}
        {structuredData?.inferences && structuredData.inferences.length > 0 && (
          <div className="space-y-1.5 pt-1">
            <span className="text-[11px] font-mono uppercase text-indigo-400 font-semibold tracking-wider">
              Operational Inferences
            </span>
            <ul className="space-y-1 text-xs text-zinc-300">
              {structuredData.inferences.map((inf, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-indigo-400 mr-2">→</span>
                  <span>{inf}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Structured: Conflicts */}
        {structuredData?.conflicts && structuredData.conflicts.length > 0 && (
          <div className="space-y-2 pt-2">
            {structuredData.conflicts.map((conf) => (
              <ConflictView key={conf.id} conflict={conf} />
            ))}
          </div>
        )}

        {/* Structured: Recommended Actions */}
        {structuredData?.actions && structuredData.actions.length > 0 && (
          <div className="space-y-2 pt-2">
            <span className="text-[11px] font-mono uppercase text-zinc-400 font-semibold tracking-wider">
              Recommended Tech Lead Action Items
            </span>
            <div className="grid grid-cols-1 gap-2">
              {structuredData.actions.map((act, idx) => (
                <div
                  key={idx}
                  className="bg-zinc-900/60 border border-zinc-800 p-2.5 rounded-lg flex items-start justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-zinc-200 block">{act.title}</span>
                    <span className="text-zinc-400 text-[11px]">{act.details}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-amber-400">
                    {act.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer actions */}
        {structuredData?.evidenceIds && structuredData.evidenceIds.length > 0 && (
          <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-xs text-zinc-400">
            <button
              onClick={() => openInspector(structuredData.evidenceIds?.[0])}
              className="hover:text-zinc-200 flex items-center underline"
            >
              <FileText className="w-3.5 h-3.5 mr-1" />
              <span>Inspect All Supporting Evidence ({structuredData.evidenceIds.length})</span>
            </button>
            <span className="text-[10px] text-zinc-400 font-mono">100% Evidence Grounded</span>
          </div>
        )}
      </div>
    </div>
  );
};
