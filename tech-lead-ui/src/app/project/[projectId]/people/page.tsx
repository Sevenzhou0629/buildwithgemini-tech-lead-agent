"use client";

import React from "react";
import { MOCK_PEOPLE } from "@/mock/projectData";
import { useUIStore } from "@/store/uiStore";
import { 
  User, 
  Clock, 
  AlertOctagon, 
  Sparkles, 
  CheckCircle2, 
  Split, 
  ArrowRight,
  ShieldAlert,
  GitPullRequest,
  CheckSquare
} from "lucide-react";
import Link from "next/link";

// Visual Avatar generator with role-specific distinct palettes
const getAvatarConfig = (name: string, role: string) => {
  if (role.includes("Frontend")) {
    return {
      bg: "bg-gradient-to-br from-cyan-500 to-blue-600",
      text: "text-white",
      ring: "ring-cyan-200",
      badge: "FE",
      badgeBg: "bg-cyan-100 text-cyan-800 border-cyan-200"
    };
  }
  if (role.includes("Backend") || role.includes("Core")) {
    return {
      bg: "bg-gradient-to-br from-indigo-500 to-purple-600",
      text: "text-white",
      ring: "ring-indigo-200",
      badge: "BE",
      badgeBg: "bg-indigo-100 text-indigo-800 border-indigo-200"
    };
  }
  if (role.includes("AI") || role.includes("ML") || role.includes("Research")) {
    return {
      bg: "bg-gradient-to-br from-violet-500 to-fuchsia-600",
      text: "text-white",
      ring: "ring-purple-200",
      badge: "AI",
      badgeBg: "bg-purple-100 text-purple-800 border-purple-200"
    };
  }
  return {
    bg: "bg-gradient-to-br from-emerald-500 to-teal-600",
    text: "text-white",
    ring: "ring-emerald-200",
    badge: "SRE",
    badgeBg: "bg-emerald-100 text-emerald-800 border-emerald-200"
  };
};

export default function PeoplePage() {
  const { setScopeQueryText } = useUIStore();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 bg-white p-5 rounded-xl border shadow-xs">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600 shadow-xs">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Team Coordination & Ownership</h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Work allocation, dependencies, and handoff signals. Designed strictly for engineering coordination and friction removal, not individual performance surveillance.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {MOCK_PEOPLE.map((person) => {
          const avatar = getAvatarConfig(person.name, person.role);
          const initials = person.name.split(" ").map(n => n[0]).join("");

          return (
            <div
              key={person.id}
              className="bg-white border border-slate-200 rounded-xl p-5 space-y-4.5 shadow-sm hover:shadow-md transition"
            >
              {/* Person Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3.5">
                  <div className="relative">
                    <div className={`w-11 h-11 rounded-full ${avatar.bg} ${avatar.text} flex items-center justify-center font-bold text-sm shadow-sm ring-2 ${avatar.ring}`}>
                      {initials}
                    </div>
                    <span className={`absolute -bottom-1 -right-1 text-[9px] font-mono font-bold px-1 py-0.2 rounded border ${avatar.badgeBg}`}>
                      {avatar.badge}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-bold text-slate-900">{person.name}</h3>
                      <span className="text-[11px] font-mono text-slate-500">@{person.name.toLowerCase().replace(" ", "")}</span>
                    </div>
                    <span className="text-xs font-medium text-slate-600">{person.role}</span>
                  </div>
                </div>

                <Link
                  href="/project/ai-doc-split/chat"
                  onClick={() => setScopeQueryText(`What is ${person.name}'s current workload and what are they waiting on?`)}
                  className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-medium px-2.5 py-1.5 rounded-lg border border-indigo-200 flex items-center space-x-1.5 transition shadow-2xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Ask about {person.name.split(" ")[0]}</span>
                </Link>
              </div>

              {/* Current Work */}
              <div className="space-y-2">
                <div className="flex items-center space-x-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-slate-700" />
                  <span className="text-[11px] font-mono uppercase text-slate-700 font-bold tracking-wider">
                    Current Work
                  </span>
                </div>
                <div className="space-y-1.5">
                  {person.currentWork.map((work, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 p-2.5 rounded-lg text-xs flex items-center justify-between transition"
                    >
                      <span className="text-slate-800 font-medium">{work.title}</span>
                      <div className="flex items-center space-x-1.5 font-mono text-[11px]">
                        {work.jiraKey && (
                          <span className="text-blue-700 bg-blue-50 font-semibold px-2 py-0.5 rounded border border-blue-200">
                            {work.jiraKey}
                          </span>
                        )}
                        {work.prNumber && (
                          <span className="text-violet-700 bg-violet-50 font-semibold px-2 py-0.5 rounded border border-violet-200 flex items-center">
                            <GitPullRequest className="w-3 h-3 mr-0.5" />
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
                <div className="space-y-2">
                  <div className="flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span className="text-[11px] font-mono uppercase text-amber-800 font-bold tracking-wider">
                      Waiting For Handoff
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {person.waitingFor.map((w, idx) => (
                      <div
                        key={idx}
                        className="bg-amber-50/80 border border-amber-200/90 p-2.5 rounded-lg text-amber-950 flex items-center justify-between font-medium"
                      >
                        <span className="text-amber-900">{w.item}</span>
                        <div className="flex items-center text-amber-800 bg-white/80 px-2 py-0.5 rounded border border-amber-200 text-[11px] font-semibold">
                          <ArrowRight className="w-3 h-3 mr-1 text-amber-600" />
                          <span>@{w.owner}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Blocked or Unclear Signals */}
              {(person.blocked.length > 0 || person.unclearSignals.length > 0) && (
                <div className="space-y-2">
                  <div className="flex items-center space-x-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-rose-700" />
                    <span className="text-[11px] font-mono uppercase text-rose-800 font-bold tracking-wider">
                      Friction & Contradictory Signals
                    </span>
                  </div>
                  <div className="space-y-1.5 text-xs">
                    {person.blocked.map((b, idx) => (
                      <div 
                        key={idx} 
                        className="bg-rose-50 border border-rose-200 p-2.5 rounded-lg text-rose-900 font-medium flex items-center space-x-2"
                      >
                        <AlertOctagon className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                        <span><strong className="text-rose-950">Blocked:</strong> {b}</span>
                      </div>
                    ))}
                    {person.unclearSignals.map((u, idx) => (
                      <div 
                        key={idx} 
                        className="bg-purple-50 border border-purple-200 p-2.5 rounded-lg text-purple-950 font-medium flex items-center space-x-2"
                      >
                        <Split className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                        <span><strong className="text-purple-950">Contradiction:</strong> {u}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
