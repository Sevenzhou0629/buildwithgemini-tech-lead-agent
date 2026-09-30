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
    <aside className="w-84 border-l border-slate-200/80 bg-white p-4 flex flex-col justify-between overflow-y-auto z-20 shadow-[-2px_0_6px_rgba(0,0,0,0.03)]">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center space-x-2">
            <BrainCircuit className="w-4 h-4 text-indigo-600" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-800">
              Evidence Inspector
            </h3>
          </div>
          <button
            onClick={closeInspector}
            className="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {evidence ? (
          <div className="mt-4 space-y-4">
            {/* Source & Timestamp */}
            <div className="flex items-center justify-between">
              <SourceBadge sourceType={evidence.sourceType} externalId={evidence.externalId} />
              <span className="text-[11px] text-slate-500 flex items-center font-mono">
                <Clock className="w-3 h-3 mr-1" />
                {evidence.timestamp || "Recent"}
              </span>
            </div>

            {/* Title */}
            <div>
              <h4 className="text-sm font-semibold text-slate-900">{evidence.title}</h4>
              {evidence.author && (
                <p className="text-xs text-slate-500 mt-0.5">Author / Reporter: @{evidence.author}</p>
              )}
            </div>

            {/* Raw Excerpt / Grounding Quote */}
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold tracking-wider">
                  Raw Source Excerpt
                </span>
                <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 border border-indigo-200 px-1.5 py-0.2 rounded font-medium">
                  Verified
                </span>
              </div>
              <p className="text-xs text-slate-700 font-mono bg-white p-2.5 rounded border border-slate-200/80 leading-relaxed break-words whitespace-pre-wrap">
                "{evidence.excerpt || "No raw excerpt captured."}"
              </p>
            </div>

            {/* Metadata pills */}
            <div className="space-y-1 text-xs">
              <span className="text-[10px] font-mono uppercase text-slate-400 font-semibold">Metadata</span>
              <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px]">
                <div className="bg-slate-50 p-1.5 rounded border border-slate-200 text-slate-600">
                  ID: <span className="text-slate-900 font-medium">{evidence.id}</span>
                </div>
                <div className="bg-slate-50 p-1.5 rounded border border-slate-200 text-slate-600">
                  System: <span className="text-slate-900 font-medium">{evidence.sourceType}</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-8 text-center text-xs text-slate-400 space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300" />
            <p>Click any claim, card, or visual node to inspect its underlying evidence.</p>
          </div>
        )}
      </div>

      {/* Footer link to external tool */}
      {evidence && (
        <div className="pt-3 border-t border-slate-200">
          <a
            href={evidence.url || "#"}
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center space-x-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs py-2 rounded-md border border-slate-200 font-medium transition"
          >
            <span>Open in {evidence.sourceType.toUpperCase()}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}
    </aside>
  );
};
