"use client";

import React, { useCallback } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useUIStore } from "@/store/uiStore";

interface InteractiveGraphProps {
  initialNodes: Node[];
  initialEdges: Edge[];
}

export const InteractiveGraph: React.FC<InteractiveGraphProps> = ({
  initialNodes,
  initialEdges,
}) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { openInspector } = useUIStore();

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = (_: React.MouseEvent, node: Node) => {
    // If node has an associated evidenceId in its data, inspect it
    const evId = (node.data as any)?.evidenceId;
    if (evId) {
      openInspector(evId);
    } else {
      openInspector("ev-1");
    }
  };

  return (
    <div className="w-full h-[600px] bg-white border border-slate-200 rounded-xl overflow-hidden relative">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        fitView
      >
        <Background color="#27272a" gap={16} />
        <Controls className="!bg-slate-50 !border-slate-200 !text-slate-700" />
        <MiniMap
          nodeColor={(n) => {
            if ((n.data as any)?.status === "BLOCKED") return "#ef4444";
            if ((n.data as any)?.status === "VERIFIED") return "#10b981";
            if ((n.data as any)?.status === "CONFLICT") return "#8b5cf6";
            return "#3b82f6";
          }}
          className="!bg-slate-50 !border-slate-200"
        />
      </ReactFlow>
      <div className="absolute top-3 left-3 bg-slate-50/90 backdrop-blur border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-mono text-slate-700 pointer-events-none">
        Click any node to inspect evidence in the inspector drawer
      </div>
    </div>
  );
};
