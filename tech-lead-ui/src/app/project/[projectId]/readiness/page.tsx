"use client";

import React, { useState } from "react";
import { MOCK_READINESS } from "@/mock/projectData";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { useUIStore } from "@/store/uiStore";
import { CheckCircle, AlertOctagon, FileText, Sparkles, LayoutGrid, List } from "lucide-react";
import Link from "next/link";

export default function LaunchReadinessPage() {
  const { openInspector } = useUIStore();
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  const verifiedCount = MOCK_READINESS.filter(r => r.status === "VERIFIED").length;
  const blockedCount = MOCK_READINESS.filter(r => r.status === "BLOCKED").length;
  const partialCount = MOCK_READINESS.filter(r => r.status === "PARTIALLY_VERIFIED").length;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Launch Readiness Matrix</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Audit of all 15 operational readiness criteria required before approving PRT Launch into production.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md p-0.5 text-xs">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-2.5 py-1 rounded transition flex items-center space-x-1 ${
                viewMode === "grid" ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`px-2.5 py-1 rounded transition flex items-center space-x-1 ${
                viewMode === "table" ? "bg-slate-100 text-slate-900 font-medium" : "text-slate-500 hover:text-slate-800"
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <Link
            href="/project/ai-doc-split/visuals"
            className="text-xs bg-slate-50 hover:bg-slate-100 text-slate-800 px-3 py-1.5 rounded-md border border-slate-200 transition"
          >
            Visualize Readiness Graph
          </Link>
        </div>
      </div>

      {/* Tally summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">Verified & Green</span>
            <div className="text-xl font-bold font-mono text-emerald-400 mt-0.5">{verifiedCount} / 15</div>
          </div>
          <CheckCircle className="w-6 h-6 text-emerald-500/30" />
        </div>
        <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">Partially Verified</span>
            <div className="text-xl font-bold font-mono text-cyan-400 mt-0.5">{partialCount} / 15</div>
          </div>
          <CheckCircle className="w-6 h-6 text-cyan-500/30" />
        </div>
        <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-xs text-slate-500">Blocked Criteria</span>
            <div className="text-xl font-bold font-mono text-rose-400 mt-0.5">{blockedCount} / 15</div>
          </div>
          <AlertOctagon className="w-6 h-6 text-rose-500/30" />
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {MOCK_READINESS.map((item) => (
            <div
              key={item.id}
              onClick={() => openInspector(item.evidenceIds[0])}
              className="bg-white hover:bg-slate-50/60 border border-slate-200/80 hover:border-slate-300/80 p-3.5 rounded-xl transition cursor-pointer space-y-2.5 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-sm text-slate-900">{item.name}</span>
                <StatusBadge status={item.status} />
              </div>

              {item.missingVerification ? (
                <div className="text-xs text-rose-300/90 bg-rose-950/20 border border-rose-500/20 p-2 rounded">
                  <span className="text-[10px] font-mono uppercase font-semibold block text-rose-400">
                    Missing Verification
                  </span>
                  {item.missingVerification}
                </div>
              ) : (
                <p className="text-xs text-emerald-400/80 font-mono">
                  All criteria met & verified in code/telemetry.
                </p>
              )}

              <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[11px] text-slate-500">
                <span>Owner: @{item.owner}</span>
                <span className="underline flex items-center">
                  <FileText className="w-3 h-3 mr-1" />
                  Evidence ({item.evidenceIds.length})
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 text-slate-500 font-mono uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Category</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Owner</th>
                <th className="py-2.5 px-4">Gap / Missing Verification</th>
                <th className="py-2.5 px-4 text-right">Evidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60 font-sans">
              {MOCK_READINESS.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => openInspector(item.evidenceIds[0])}
                  className="hover:bg-slate-50/50 cursor-pointer transition"
                >
                  <td className="py-2.5 px-4 font-semibold text-slate-800">{item.name}</td>
                  <td className="py-2.5 px-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="py-2.5 px-4 text-slate-500">@{item.owner}</td>
                  <td className="py-2.5 px-4 text-slate-700">
                    {item.missingVerification || "—"}
                  </td>
                  <td className="py-2.5 px-4 text-right text-indigo-400 font-mono">
                    {item.evidenceIds.length} sources
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
