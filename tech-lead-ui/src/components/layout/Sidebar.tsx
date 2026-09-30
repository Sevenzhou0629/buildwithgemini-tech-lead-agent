"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  History,
  AlertOctagon,
  AlertTriangle,
  GitCommit,
  CheckCircle,
  Users,
  Network,
  MessageSquareCode,
  FolderGit2
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  const navItems = [
    { label: "Overview", href: "/project/ai-doc-split", icon: LayoutDashboard },
    { label: "Changes Feed", href: "/project/ai-doc-split/changes", icon: History },
    { label: "Blockers", href: "/project/ai-doc-split/blockers", icon: AlertOctagon, badge: "3" },
    { label: "Risks", href: "/project/ai-doc-split/risks", icon: AlertTriangle, badge: "4" },
    { label: "Decisions", href: "/project/ai-doc-split/decisions", icon: GitCommit, badge: "2" },
    { label: "Launch Readiness", href: "/project/ai-doc-split/readiness", icon: CheckCircle },
    { label: "People & Work", href: "/project/ai-doc-split/people", icon: Users },
    { label: "Visualizations", href: "/project/ai-doc-split/visuals", icon: Network },
    { label: "Agent Console", href: "/project/ai-doc-split/chat", icon: MessageSquareCode },
  ];

  return (
    <aside className="w-56 border-r border-slate-200/80 bg-white flex flex-col justify-between p-3 select-none shadow-[1px_0_2px_rgba(0,0,0,0.02)]">
      <div className="space-y-4">
        {/* Project Section */}
        <div className="px-2 py-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
            Project Navigation
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs font-medium transition ${
                    isActive
                      ? "bg-indigo-50/80 text-indigo-700 font-semibold border border-indigo-100"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-semibold border border-slate-200">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Workstreams */}
        <div className="px-2 pt-2 border-t border-slate-100">
          <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold mb-2">
            Active Workstreams
          </div>
          <div className="space-y-1 text-xs text-slate-600">
            <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-slate-50 cursor-pointer">
              <span className="truncate">Frontend UI</span>
              <span className="w-2 h-2 rounded-full bg-rose-500" title="Blocked" />
            </div>
            <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-slate-50 cursor-pointer">
              <span className="truncate">AI Worker Pool</span>
              <span className="w-2 h-2 rounded-full bg-amber-500" title="At Risk" />
            </div>
            <div className="flex items-center justify-between px-2 py-1 rounded hover:bg-slate-50 cursor-pointer">
              <span className="truncate">Core API & DB</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500" title="Green" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-100 px-2 space-y-1 text-[11px] text-slate-400 font-mono">
        <div className="flex items-center justify-between">
          <span>Mode</span>
          <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1 rounded">Read-Only</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Version</span>
          <span>v1.0.0-mvp</span>
        </div>
      </div>
    </aside>
  );
};
