import React from "react";
import { CheckCircle2, Clock, CircleDot } from "lucide-react";

interface Step {
  label: string;
  status: "completed" | "in_progress" | "pending";
}

export const AgentInvestigation: React.FC<{ steps: Step[] }> = ({ steps }) => {
  return (
    <div className="bg-white/70 border border-slate-200 rounded-lg p-3 my-2 space-y-2">
      <div className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-semibold flex items-center">
        <CircleDot className="w-3 h-3 mr-1.5 animate-pulse text-indigo-400" />
        Cross-System Operational Investigation
      </div>
      <div className="space-y-1.5">
        {steps.map((st, idx) => (
          <div key={idx} className="flex items-center text-xs text-slate-700 font-mono">
            {st.status === "completed" ? (
              <CheckCircle2 className="w-3.5 h-3.5 mr-2 text-emerald-400 flex-shrink-0" />
            ) : st.status === "in_progress" ? (
              <Clock className="w-3.5 h-3.5 mr-2 text-blue-400 flex-shrink-0 animate-spin" />
            ) : (
              <div className="w-3.5 h-3.5 mr-2 rounded-full border border-slate-300 flex-shrink-0" />
            )}
            <span className={st.status === "completed" ? "text-slate-800" : "text-slate-500"}>
              {st.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
