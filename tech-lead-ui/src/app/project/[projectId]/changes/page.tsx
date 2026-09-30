"use client";

import React, { useState } from "react";
import { MOCK_CHANGES, MOCK_SNAPSHOTS } from "@/mock/projectData";
import { useUIStore } from "@/store/uiStore";
import { History, Calendar, Filter, Sparkles, FileText, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ChangesPage() {
  const { openInspector } = useUIStore();
  const [snapshotA, setSnapshotA] = useState("current");
  const [snapshotB, setSnapshotB] = useState("7d_ago");

  const snapCurr = MOCK_SNAPSHOTS.find(s => s.id === snapshotA) || MOCK_SNAPSHOTS[0];
  const snapPrev = MOCK_SNAPSHOTS.find(s => s.id === snapshotB) || MOCK_SNAPSHOTS[2];

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case "BLOCKED":
        return "text-rose-400 bg-rose-500/10 border-rose-500/20";
      case "CONFLICT":
        return "text-purple-400 bg-purple-500/10 border-purple-500/20";
      case "MERGED":
        return "text-violet-400 bg-violet-500/10 border-violet-500/20";
      default:
        return "text-zinc-300 bg-zinc-800 border-zinc-700";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800">
        <div>
          <h1 className="text-xl font-bold text-zinc-100">Project State Transitions</h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Semantic state changes aggregated from commit history, Jira board status transitions, and Slack announcements.
          </p>
        </div>
      </div>

      {/* Snapshot Compare / Time Travel Box */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-mono font-semibold uppercase text-zinc-200">
              Time Travel Snapshot Comparison
            </span>
          </div>
          <div className="flex items-center space-x-2 text-xs font-mono">
            <select
              value={snapshotA}
              onChange={(e) => setSnapshotA(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-200"
            >
              <option value="current">Current (Sep 30)</option>
              <option value="24h_ago">24h ago (Sep 29)</option>
            </select>
            <span className="text-zinc-400">vs</span>
            <select
              value={snapshotB}
              onChange={(e) => setSnapshotB(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-zinc-200"
            >
              <option value="24h_ago">24h ago (Sep 29)</option>
              <option value="7d_ago">7d ago (Sep 23)</option>
            </select>
          </div>
        </div>

        {/* Diff summary badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono pt-1">
          <div className="bg-zinc-900/80 p-2 rounded border border-zinc-800 flex justify-between">
            <span className="text-zinc-400">Blockers:</span>
            <span className="text-rose-400 font-bold">
              +{snapCurr.blockerCount - snapPrev.blockerCount} new
            </span>
          </div>
          <div className="bg-zinc-900/80 p-2 rounded border border-zinc-800 flex justify-between">
            <span className="text-zinc-400">Risks:</span>
            <span className="text-amber-400 font-bold">
              {snapCurr.riskCount - snapPrev.riskCount} net
            </span>
          </div>
          <div className="bg-zinc-900/80 p-2 rounded border border-zinc-800 flex justify-between">
            <span className="text-zinc-400">Decisions:</span>
            <span className="text-purple-400 font-bold">
              {snapCurr.openDecisionsCount - snapPrev.openDecisionsCount}
            </span>
          </div>
          <div className="bg-zinc-900/80 p-2 rounded border border-zinc-800 flex justify-between">
            <span className="text-zinc-400">Merged PRs:</span>
            <span className="text-emerald-400 font-bold">+5 merged</span>
          </div>
        </div>
      </div>

      {/* Semantic Feed */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-semibold">
          Semantic Project Changes Feed
        </h2>

        <div className="space-y-3">
          {MOCK_CHANGES.map((ch) => (
            <div
              key={ch.id}
              className="bg-zinc-950 border border-zinc-800/80 rounded-xl p-4 transition shadow-sm space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${getCategoryBadge(
                      ch.category
                    )}`}
                  >
                    {ch.category}
                  </span>
                  <span className="text-xs text-zinc-400 font-mono">{ch.timestamp}</span>
                </div>
                <div className="flex items-center space-x-1 font-mono text-[11px] text-zinc-400">
                  {ch.relatedEntities.map((ent) => (
                    <span key={ent} className="bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800">
                      {ent}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="text-sm font-semibold text-zinc-100">{ch.title}</h3>
              <p className="text-xs text-zinc-300 leading-relaxed font-sans">{ch.description}</p>

              <div className="pt-2 border-t border-zinc-900 flex justify-between text-xs text-zinc-400">
                <button
                  onClick={() => openInspector(ch.evidenceIds[0])}
                  className="hover:text-zinc-200 flex items-center underline"
                >
                  <FileText className="w-3 h-3 mr-1" />
                  <span>Inspect Evidence ({ch.evidenceIds.length})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
