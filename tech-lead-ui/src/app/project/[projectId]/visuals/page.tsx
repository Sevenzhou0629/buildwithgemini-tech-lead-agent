"use client";

import React, { useState } from "react";
import { InteractiveGraph } from "@/components/visuals/InteractiveGraph";
import { Node, Edge } from "@xyflow/react";
import { Network, Layers, GitPullRequest, ShieldCheck, Share2 } from "lucide-react";

export default function VisualsPage() {
  const [activeTab, setActiveTab] = useState<"architecture" | "dependencies" | "ownership">("architecture");

  // Architecture Graph Nodes & Edges
  const archNodes: Node[] = [
    {
      id: "fe",
      position: { x: 50, y: 150 },
      data: { label: "Web / Mobile Frontend\n(Document UI)", status: "BLOCKED", evidenceId: "ev-1" },
      style: { background: "#18181b", color: "#f43f5e", border: "1px solid #f43f5e", borderRadius: 8, padding: 12, fontSize: 12 },
    },
    {
      id: "api",
      position: { x: 300, y: 150 },
      data: { label: "Core DMS API Gateway\n(FastAPI / PKCE)", status: "VERIFIED", evidenceId: "ev-4" },
      style: { background: "#18181b", color: "#10b981", border: "1px solid #10b981", borderRadius: 8, padding: 12, fontSize: 12 },
    },
    {
      id: "queue",
      position: { x: 550, y: 80 },
      data: { label: "Cloud Pub/Sub\n(image-split-jobs)", status: "VERIFIED", evidenceId: "ev-6" },
      style: { background: "#18181b", color: "#10b981", border: "1px solid #10b981", borderRadius: 8, padding: 12, fontSize: 12 },
    },
    {
      id: "worker",
      position: { x: 800, y: 80 },
      data: { label: "AI Split Worker Pool\n(Vertex Imagen 3 / OCR)", status: "BLOCKED", evidenceId: "ev-8" },
      style: { background: "#18181b", color: "#f43f5e", border: "1px solid #f43f5e", borderRadius: 8, padding: 12, fontSize: 12 },
    },
    {
      id: "storage",
      position: { x: 800, y: 250 },
      data: { label: "Google Cloud Storage\n(gs://generated-assets-prod)", status: "CONFLICT", evidenceId: "ev-5" },
      style: { background: "#18181b", color: "#8b5cf6", border: "1px solid #8b5cf6", borderRadius: 8, padding: 12, fontSize: 12 },
    },
    {
      id: "db",
      position: { x: 550, y: 250 },
      data: { label: "Cloud SQL Postgres\n(Metadata & JSONB)", status: "VERIFIED", evidenceId: "ev-4" },
      style: { background: "#18181b", color: "#10b981", border: "1px solid #10b981", borderRadius: 8, padding: 12, fontSize: 12 },
    },
  ];

  const archEdges: Edge[] = [
    { id: "e-fe-api", source: "fe", target: "api", label: "REST / Stream", animated: true },
    { id: "e-api-queue", source: "api", target: "queue", label: "Publish Job" },
    { id: "e-queue-worker", source: "queue", target: "worker", label: "Pull Worker", animated: true },
    { id: "e-worker-storage", source: "worker", target: "storage", label: "Write PNG / PDF" },
    { id: "e-api-db", source: "api", target: "db", label: "Read / Write State" },
  ];

  // Dependency Graph Nodes & Edges
  const depNodes: Node[] = [
    {
      id: "aidoc-101",
      position: { x: 50, y: 150 },
      data: { label: "AIDOC-101: Contract v2\n[CONFLICT: Done vs PR #211]", status: "CONFLICT", evidenceId: "ev-4" },
      style: { background: "#18181b", color: "#8b5cf6", border: "1px solid #8b5cf6", borderRadius: 8, padding: 12, fontSize: 12 },
    },
    {
      id: "aidoc-102",
      position: { x: 350, y: 150 },
      data: { label: "AIDOC-102: Frontend UI\n[BLOCKED by Contract]", status: "BLOCKED", evidenceId: "ev-2" },
      style: { background: "#18181b", color: "#f43f5e", border: "1px solid #f43f5e", borderRadius: 8, padding: 12, fontSize: 12 },
    },
    {
      id: "aidoc-105",
      position: { x: 350, y: 300 },
      data: { label: "AIDOC-105: 500p Load Test\n[BLOCKED by Quota]", status: "BLOCKED", evidenceId: "ev-8" },
      style: { background: "#18181b", color: "#f43f5e", border: "1px solid #f43f5e", borderRadius: 8, padding: 12, fontSize: 12 },
    },
    {
      id: "prt-launch",
      position: { x: 700, y: 220 },
      data: { label: "PRT Production Launch\n[CRITICAL MILESTONE]", status: "BLOCKED", evidenceId: "ev-6" },
      style: { background: "#27272a", color: "#ffffff", border: "2px solid #ef4444", borderRadius: 8, padding: 16, fontSize: 14, fontWeight: "bold" },
    },
  ];

  const depEdges: Edge[] = [
    { id: "e-101-102", source: "aidoc-101", target: "aidoc-102", label: "BLOCKS", animated: true },
    { id: "e-102-launch", source: "aidoc-102", target: "prt-launch", label: "BLOCKS" },
    { id: "e-105-launch", source: "aidoc-105", target: "prt-launch", label: "BLOCKS" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Interactive Visualizations</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            React Flow graph rendering derived directly from multi-source project evidence.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-50 border border-slate-200 rounded-md p-0.5 text-xs">
          <button
            onClick={() => setActiveTab("architecture")}
            className={`px-3 py-1.5 rounded transition ${
              activeTab === "architecture"
                ? "bg-slate-100 text-slate-900 font-semibold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            System Architecture
          </button>
          <button
            onClick={() => setActiveTab("dependencies")}
            className={`px-3 py-1.5 rounded transition ${
              activeTab === "dependencies"
                ? "bg-slate-100 text-slate-900 font-semibold"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            Dependency Chains
          </button>
        </div>
      </div>

      {/* Graph Area */}
      <div className="space-y-3">
        {activeTab === "architecture" ? (
          <InteractiveGraph initialNodes={archNodes} initialEdges={archEdges} />
        ) : (
          <InteractiveGraph initialNodes={depNodes} initialEdges={depEdges} />
        )}
      </div>
    </div>
  );
}
