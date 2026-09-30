"use client";

import React from "react";
import { 
  MOCK_PROJECT, 
  MOCK_BLOCKERS, 
  MOCK_RISKS, 
  MOCK_DECISIONS, 
  MOCK_CONFLICTS 
} from "@/mock/projectData";
import { BlockerCard } from "@/components/blockers/BlockerCard";
import { RiskCard } from "@/components/risks/RiskCard";
import { DecisionCard } from "@/components/decisions/DecisionCard";
import { ConflictView } from "@/components/evidence/ConflictView";
import { 
  AlertOctagon, 
  AlertTriangle, 
  GitCommit, 
  GitPullRequest, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";

export default function ProjectOverviewPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Top Banner / Milestone Counters */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-zinc-100">{MOCK_PROJECT.name}</h1>
              <span className="text-xs bg-indigo-500/10 text-indigo-400 font-mono px-2 py-0.5 rounded border border-indigo-500/20">
                {MOCK_PROJECT.currentMilestone}
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-1">
              Cross-system operational state consolidated from Jira, GitHub, Slack, and Confluence.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href="/project/ai-doc-split/visuals"
              className="text-xs bg-zinc-900 hover:bg-zinc-800 text-zinc-200 px-3 py-1.5 rounded-md border border-zinc-800 transition flex items-center"
            >
              Visualize Project Graph
            </Link>
            <Link
              href="/project/ai-doc-split/chat"
              className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3.5 py-1.5 rounded-md transition flex items-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask Agent</span>
            </Link>
          </div>
        </div>

        {/* Counter cards (No arbitrary health score, pure high-signal counts) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <Link
            href="/project/ai-doc-split/blockers"
            className="bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 rounded-lg p-3 transition"
          >
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Active Blockers</span>
              <AlertOctagon className="w-4 h-4 text-rose-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-rose-400 mt-1">
              {MOCK_PROJECT.blockerCount}
            </div>
          </Link>

          <Link
            href="/project/ai-doc-split/risks"
            className="bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 rounded-lg p-3 transition"
          >
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Identified Risks</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
              {MOCK_PROJECT.riskCount}
            </div>
          </Link>

          <Link
            href="/project/ai-doc-split/decisions"
            className="bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800/80 rounded-lg p-3 transition"
          >
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Pending Decisions</span>
              <GitCommit className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
              {MOCK_PROJECT.openDecisionsCount}
            </div>
          </Link>

          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-lg p-3">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span>Open Pull Requests</span>
              <GitPullRequest className="w-4 h-4 text-violet-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-zinc-200 mt-1">
              {MOCK_PROJECT.openPRCount}
            </div>
          </div>
        </div>
      </div>

      {/* Critical Reality Gap / Conflict Alert */}
      {MOCK_CONFLICTS.length > 0 && (
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-wider text-purple-400 font-semibold">
              Cross-Source Reality Gap
            </h2>
            <span className="text-[11px] text-zinc-400">1 contradiction flagged by agent</span>
          </div>
          <ConflictView conflict={MOCK_CONFLICTS[0]} />
        </section>
      )}

      {/* Needs Your Attention Section */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">Needs Your Immediate Attention</h2>
            <p className="text-xs text-zinc-400">Critical blockers actively stalling PRT Launch</p>
          </div>
          <Link
            href="/project/ai-doc-split/blockers"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center font-medium"
          >
            <span>View all blockers</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {MOCK_BLOCKERS.slice(0, 2).map((blocker) => (
            <BlockerCard key={blocker.id} blocker={blocker} />
          ))}
        </div>
      </section>

      {/* Decisions Waiting */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-zinc-100">Decisions Awaiting Resolution</h2>
            <p className="text-xs text-zinc-400">Unblocking downstream technical milestones</p>
          </div>
          <Link
            href="/project/ai-doc-split/decisions"
            className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center font-medium"
          >
            <span>View decision inbox</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <DecisionCard decision={MOCK_DECISIONS[0]} />
        </div>
      </section>
    </div>
  );
}
