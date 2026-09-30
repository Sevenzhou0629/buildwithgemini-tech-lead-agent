import { create } from "zustand";
import { Evidence } from "@/types";
import { MOCK_EVIDENCE } from "@/mock/projectData";

interface UIState {
  selectedProjectId: string;
  isInspectorOpen: boolean;
  selectedEvidenceId: string | null;
  selectedSnapshotId: string;
  isCommandPaletteOpen: boolean;
  scopeQueryText: string;

  // Actions
  setSelectedProjectId: (id: string) => void;
  openInspector: (evidenceId?: string) => void;
  closeInspector: () => void;
  toggleInspector: () => void;
  setSelectedSnapshotId: (id: string) => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setScopeQueryText: (text: string) => void;
  getSelectedEvidence: () => Evidence | null;
}

export const useUIStore = create<UIState>((set, get) => ({
  selectedProjectId: "ai-doc-split",
  isInspectorOpen: false,
  selectedEvidenceId: null,
  selectedSnapshotId: "current",
  isCommandPaletteOpen: false,
  scopeQueryText: "",

  setSelectedProjectId: (id) => set({ selectedProjectId: id }),
  openInspector: (evidenceId) =>
    set({
      isInspectorOpen: true,
      selectedEvidenceId: evidenceId || get().selectedEvidenceId || "ev-1",
    }),
  closeInspector: () => set({ isInspectorOpen: false }),
  toggleInspector: () => set((state) => ({ isInspectorOpen: !state.isInspectorOpen })),
  setSelectedSnapshotId: (id) => set({ selectedSnapshotId: id }),
  setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
  setScopeQueryText: (text) => set({ scopeQueryText: text }),

  getSelectedEvidence: () => {
    const id = get().selectedEvidenceId;
    return id && MOCK_EVIDENCE[id] ? MOCK_EVIDENCE[id] : null;
  },
}));
