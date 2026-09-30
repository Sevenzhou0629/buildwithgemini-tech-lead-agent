import React from "react";
import { SemanticStatus } from "@/types";
import { 
  CheckCircle2, 
  Clock, 
  AlertOctagon, 
  AlertTriangle, 
  HelpCircle, 
  GitMerge, 
  Archive,
  Split
} from "lucide-react";

interface StatusBadgeProps {
  status: SemanticStatus;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "sm",
  showIcon = true,
}) => {
  const getStatusConfig = (st: SemanticStatus) => {
    switch (st) {
      case "VERIFIED":
        return {
          bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          icon: <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-400" />,
          label: "VERIFIED",
        };
      case "IN_PROGRESS":
        return {
          bg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          icon: <Clock className="w-3.5 h-3.5 mr-1 text-blue-400" />,
          label: "IN PROGRESS",
        };
      case "PARTIALLY_VERIFIED":
        return {
          bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
          icon: <Clock className="w-3.5 h-3.5 mr-1 text-cyan-400" />,
          label: "PARTIAL",
        };
      case "BLOCKED":
        return {
          bg: "bg-rose-500/10 text-rose-400 border-rose-500/20 font-semibold",
          icon: <AlertOctagon className="w-3.5 h-3.5 mr-1 text-rose-400" />,
          label: "BLOCKED",
        };
      case "AT_RISK":
        return {
          bg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
          icon: <AlertTriangle className="w-3.5 h-3.5 mr-1 text-amber-400" />,
          label: "AT RISK",
        };
      case "NOT_VERIFIED":
        return {
          bg: "bg-orange-500/10 text-orange-400 border-orange-500/20",
          icon: <AlertTriangle className="w-3.5 h-3.5 mr-1 text-orange-400" />,
          label: "UNVERIFIED",
        };
      case "CONFLICT":
        return {
          bg: "bg-purple-500/10 text-purple-400 border-purple-500/20 font-semibold",
          icon: <Split className="w-3.5 h-3.5 mr-1 text-purple-400" />,
          label: "CONFLICT",
        };
      case "STALE":
        return {
          bg: "bg-amber-500/10 text-amber-400/80 border-amber-500/20",
          icon: <Archive className="w-3.5 h-3.5 mr-1 text-amber-400" />,
          label: "STALE",
        };
      case "UNKNOWN":
      default:
        return {
          bg: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
          icon: <HelpCircle className="w-3.5 h-3.5 mr-1 text-zinc-400" />,
          label: "UNKNOWN",
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClass = size === "sm" ? "text-xs px-2 py-0.5" : "text-sm px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center rounded-md border font-mono tracking-tight ${config.bg} ${sizeClass}`}
    >
      {showIcon && config.icon}
      <span>{config.label}</span>
    </span>
  );
};
