"use client";

import React from "react";
import Link from "next/link";
import { MOCK_PROJECT } from "@/mock/projectData";
import { Layers, ArrowRight, AlertOctagon, AlertTriangle, GitCommit } from "lucide-react";

export default function ProjectsListPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pt-6">
      <div>
        <h1 className="text-xl font-bold text-zinc-100">Engineering Projects</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Active engineering programs connected via MCP to Jira, GitHub, Slack, and Confluence.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Link
          href={`/project/${MOCK_PROJECT.id}`}
          className="bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded-xl p-5 transition space-y-4 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-semibold text-zinc-100">{MOCK_PROJECT.name}</h2>
                <div className="flex items-center space-x-2 mt-0.5">
                  <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                    {MOCK_PROJECT.currentMilestone}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">Updated {MOCK_PROJECT.lastRefreshed}</span>
                </div>
              </div>
            </div>

            <span className="text-xs text-indigo-400 flex items-center font-medium">
              Open Command Center <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2 text-xs font-mono">
            <div className="bg-zinc-900/60 p-2.5 rounded border border-zinc-800 flex items-center justify-between">
              <span className="text-zinc-400">Blockers</span>
              <span className="text-rose-400 font-bold">{MOCK_PROJECT.blockerCount}</span>
            </div>
            <div className="bg-zinc-900/60 p-2.5 rounded border border-zinc-800 flex items-center justify-between">
              <span className="text-zinc-400">Risks</span>
              <span className="text-amber-400 font-bold">{MOCK_PROJECT.riskCount}</span>
            </div>
            <div className="bg-zinc-900/60 p-2.5 rounded border border-zinc-800 flex items-center justify-between">
              <span className="text-zinc-400">Decisions</span>
              <span className="text-purple-400 font-bold">{MOCK_PROJECT.openDecisionsCount}</span>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
