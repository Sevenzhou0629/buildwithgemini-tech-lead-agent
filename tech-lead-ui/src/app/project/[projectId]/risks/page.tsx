"use client";

import React from "react";
import { MOCK_RISKS } from "@/mock/projectData";
import { RiskCard } from "@/components/risks/RiskCard";
import { ShieldAlert } from "lucide-react";

export default function RisksPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-5">
      <div className="pb-3 border-b border-slate-200">
        <h1 className="text-xl font-bold text-slate-900">Project Risk Register</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Identified technical and operational risks that could impact production stability, data integrity, or launch timelines.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {MOCK_RISKS.map((risk) => (
          <RiskCard key={risk.id} risk={risk} />
        ))}
      </div>
    </div>
  );
}
