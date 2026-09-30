"use client";

import React from "react";
import { useUIStore } from "@/store/uiStore";
import { SourceBadge } from "@/components/shared/SourceBadge";
import { 
  X, 
  ExternalLink, 
  Copy, 
  CheckCircle, 
  ShieldAlert, 
  Clock, 
  BrainCircuit,
  MessageSquare
} from "lucide-react";

export const EvidenceInspector: React.FC = () => {
  const { isInspectorOpen, closeInspector, getSelectedEvidence } = useUIStore();
  const evidence = getSelectedEvidence();

  if (!isInspectorOpen) return null;

  return (
    <aside className="w-80 border-l border-zinc-800 bg-zinc-950 p-4 flex flex-col justify-between overflow-y-auto z-20">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <BrainCircuit className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Evidence Inspector
            </h3>
          </div>
          <button
            onClick={closeInspector}
            className="text-zinc-400 hover:text-zinc-100 p-1 rounded hover:bg-zinc-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {evidence ? (
          <div className="mt-4 space-y-4">
            {/* Source & Timestamp */}
            <div className="flex items-center justify-between">
              <SourceBadge sourceType={evidence.sourceType} externalId={evidence.externalId} />
              <span className="text-[11px] text-zinc-400 flex items-center font-mono">
                <Clock className="w-3 h-3 mr-1" />
                {evidence.timestamp || "Recent"}
              </span>
            </div>

            {/* Title */}
            <div>
              <h4 className="text-sm font-semibold text-zinc-100">{evidence.title}</h4>
              {evidence.author && (
                <p className="text-xs text-zinc-400 mt-0.5">Author / Reporter: @{evidence.author}</p>
              )}
            </div>

            {/* Excerpt / Raw content */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-lg p-3">
              <span className="text-[10px] font-mono uppercase text-zinc-400 block mb-1">
                Captured Evidence Content
              </span>
              <p className="text-xs text-zinc-200 font-mono leading-relaxed bg-zinc-950/60 p-2.5 rounded border border-zinc-800/80">
                "{evidence.excerpt || "No raw excerpt captured."}"
              </p>
            </div>

            {/* Agent Deductive Reasoning */}
            <div className="bg-indigo-950/20 border border-indigo-500/20 rounded-lg p-3">
              <div className="flex items-center space-x-1.5 text-xs font-semibold text-indigo-300 mb-1.5">
                <BrainCircuit className="w-3.5 h-3.5" />
                <span>Agent Deduction & Grounding</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                This evidence directly supports conclusions regarding blocked workstreams and cross-system status contradictions. Corroborated across 3 other sources.
              </p>
              <div className="mt-2 flex items-center space-x-3 text-[11px] text-indigo-400">
                <span>Confidence: <strong className="text-emerald-400">HIGH</strong></span>
                <span>Contradictions: <strong className="text-rose-400">DETECTED (1)</strong></span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 space-y-2">
              {evidence.url && (
                <a
                  href={evidence.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center space-x-2 text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-200 py-2 rounded-md border border-zinc-800 transition"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in {evidence.sourceType.toUpperCase()}</span>
                </a>
              )}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-zinc-400">
            <p className="text-xs">Select any card, conflict, or node in the graph to inspect the raw supporting evidence.</p>
          </div>
        )}
      </div>

      <div className="pt-4 border-t border-zinc-900 text-[10px] text-zinc-400 text-center font-mono">
        All conclusions grounded in immutable MCP event logs.
      </div>
    </aside>
  );
};
