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
    <aside className="w-56 border-r border-zinc-800 bg-zinc-950 flex flex-col justify-between p-3 select-none">
      <div className="space-y-4">
        {/* Project Section */}
        <div className="px-2 py-1">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-2">
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
                      ? "bg-zinc-800 text-zinc-100 font-semibold"
                      : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/80"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-indigo-400" : "text-zinc-400"}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                        item.label === "Blockers"
                          ? "bg-rose-500/20 text-rose-400 font-bold"
                          : "bg-zinc-800 text-zinc-400"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Workstreams */}
        <div className="px-2 pt-2 border-t border-zinc-900">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-2">
            Workstreams
          </div>
          <div className="space-y-1 text-xs text-zinc-400">
            <div className="px-2 py-1 hover:bg-zinc-900 rounded cursor-pointer flex items-center justify-between">
              <span className="truncate">Core DMS API</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
            <div className="px-2 py-1 hover:bg-zinc-900 rounded cursor-pointer flex items-center justify-between">
              <span className="truncate">Async Worker</span>
              <span className="w-2 h-2 rounded-full bg-rose-400" />
            </div>
            <div className="px-2 py-1 hover:bg-zinc-900 rounded cursor-pointer flex items-center justify-between">
              <span className="truncate">Frontend UI</span>
              <span className="w-2 h-2 rounded-full bg-rose-400" />
            </div>
            <div className="px-2 py-1 hover:bg-zinc-900 rounded cursor-pointer flex items-center justify-between">
              <span className="truncate">Infra & SRE</span>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="px-2 pt-3 border-t border-zinc-900 text-[11px] text-zinc-400 flex items-center justify-between">
        <span>Tech Lead OS v1.0</span>
        <span className="text-[10px] font-mono text-emerald-500">● LIVE</span>
      </div>
    </aside>
  );
};
