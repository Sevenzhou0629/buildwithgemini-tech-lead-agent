"use client";

import React from "react";
import { MOCK_PEOPLE } from "@/mock/projectData";
import { useUIStore } from "@/store/uiStore";
import { User, Clock, AlertOctagon, Sparkles, CheckCircle2, Split } from "lucide-react";
import Link from "next/link";

export default function PeoplePage() {
  const { setScopeQueryText } = useUIStore();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-zinc-800">
        <h1 className="text-xl font-bold text-zinc-100">Team Coordination & Ownership</h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Work allocation, dependencies, and handoff signals. This view is for engineering coordination, not individual performance evaluation.
        </p>
      </div>

      {/* Grid of Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_PEOPLE.map((person) => (
          <div
            key={person.id}
            className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4.5 space-y-4 shadow-sm"
          >
            {/* Person Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center font-bold text-sm text-zinc-200">
                  {person.name[0]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-100">{person.name}</h3>
                  <span className="text-xs text-zinc-400 font-mono">{person.role}</span>
                </div>
              </div>

              <Link
                href="/project/ai-doc-split/chat"
                onClick={() => setScopeQueryText(`What is ${person.name}'s current workload and what are they waiting on?`)}
                className="text-xs bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 px-2.5 py-1 rounded border border-indigo-500/30 flex items-center transition"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                <span>Ask about {person.name}</span>
              </Link>
            </div>

            {/* Current Work */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase text-blue-400 font-semibold tracking-wider">
                Current Work
              </span>
              <div className="space-y-1">
                {person.currentWork.map((work, idx) => (
                  <div
                    key={idx}
                    className="bg-zinc-900/70 border border-zinc-800 p-2 rounded-lg text-xs flex items-center justify-between"
                  >
                    <span className="text-zinc-200">{work.title}</span>
                    <div className="flex items-center space-x-1 font-mono text-[11px]">
                      {work.jiraKey && (
                        <span className="text-blue-400 bg-blue-500/10 px-1.5 py-0.2 rounded border border-blue-500/20">
                          {work.jiraKey}
                        </span>
                      )}
                      {work.prNumber && (
                        <span className="text-violet-400 bg-violet-500/10 px-1.5 py-0.2 rounded border border-violet-500/20">
                          #{work.prNumber}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Waiting On */}
            {person.waitingFor.length > 0 && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-amber-400 font-semibold tracking-wider">
                  Waiting For Handoff
                </span>
                <div className="space-y-1 text-xs">
                  {person.waitingFor.map((w, idx) => (
                    <div
                      key={idx}
                      className="bg-amber-950/20 border border-amber-500/20 p-2 rounded-lg text-amber-300/90 flex justify-between"
                    >
                      <span>{w.item}</span>
                      <strong className="text-zinc-300">from @{w.owner}</strong>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Blocked or Unclear Signals */}
            {(person.blocked.length > 0 || person.unclearSignals.length > 0) && (
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase text-rose-400 font-semibold tracking-wider">
                  Friction & Contradictory Signals
                </span>
                <div className="space-y-1 text-xs">
                  {person.blocked.map((b, idx) => (
                    <div key={idx} className="bg-rose-950/20 border border-rose-500/20 p-2 rounded-lg text-rose-300">
                      Blocked: {b}
                    </div>
                  ))}
                  {person.unclearSignals.map((u, idx) => (
                    <div key={idx} className="bg-purple-950/20 border border-purple-500/20 p-2 rounded-lg text-purple-300">
                      Contradiction: {u}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
