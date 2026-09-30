"use client";

import React from "react";
import { MOCK_DECISIONS } from "@/mock/projectData";
import { DecisionCard } from "@/components/decisions/DecisionCard";
import { GitCommit } from "lucide-react";

export default function DecisionsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Decision Inbox</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Architectural and operational decisions waiting for tech lead or team alignment. Read-only MVP mode.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <h2 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold mb-2">
            Needs Decision (2)
          </h2>
          <div className="grid grid-cols-1 gap-3">
            {MOCK_DECISIONS.map((decision) => (
              <DecisionCard key={decision.id} decision={decision} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
