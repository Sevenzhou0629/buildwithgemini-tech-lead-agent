"use client";

import React, { useState } from "react";
import { MOCK_BLOCKERS } from "@/mock/projectData";
import { BlockerCard } from "@/components/blockers/BlockerCard";
import { Network, Filter } from "lucide-react";
import Link from "next/link";

export default function BlockersPage() {
  const [filterOwner, setFilterOwner] = useState<string>("ALL");

  const filtered = filterOwner === "ALL" 
    ? MOCK_BLOCKERS 
    : MOCK_BLOCKERS.filter(b => b.owner.toLowerCase() === filterOwner.toLowerCase());

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Active Project Blockers</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Actively preventing progress on PRT launch milestones. Grounded across Jira tickets, GitHub PRs, and Slack discussions.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-500 mr-1" />
            <select
              value={filterOwner}
              onChange={(e) => setFilterOwner(e.target.value)}
              className="bg-transparent text-slate-800 focus:outline-none"
            >
              <option value="ALL" className="bg-slate-50">All Owners</option>
              <option value="Ivan" className="bg-slate-50">@Ivan</option>
              <option value="Zhuo" className="bg-slate-50">@Zhuo</option>
              <option value="Jonathan" className="bg-slate-50">@Jonathan</option>
            </select>
          </div>

          <Link
            href="/project/ai-doc-split/visuals"
            className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-3 py-1.5 rounded-md flex items-center transition"
          >
            <Network className="w-3.5 h-3.5 mr-1.5" />
            <span>Visualize Dependency Chains</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {filtered.map((blocker) => (
          <BlockerCard key={blocker.id} blocker={blocker} />
        ))}
      </div>
    </div>
  );
}
