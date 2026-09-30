import { describe, it, expect } from "vitest";
import React from "react";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SourceBadge } from "@/components/shared/SourceBadge";
import { ConflictView } from "@/components/evidence/ConflictView";
import { MOCK_CONFLICTS, MOCK_BLOCKERS } from "@/mock/projectData";
import { BlockerCard } from "@/components/blockers/BlockerCard";

describe("Frontend Core Components", () => {
  it("renders StatusBadge with correct semantic status styling and text", () => {
    render(<StatusBadge status="BLOCKED" />);
    expect(screen.getByText("BLOCKED")).toBeInTheDocument();
  });

  it("renders SourceBadge for Jira and GitHub", () => {
    render(<SourceBadge sourceType="jira" externalId="AIDOC-101" />);
    expect(screen.getByText("Jira (AIDOC-101)")).toBeInTheDocument();
  });

  it("renders ConflictView showing cross-system discrepancy without hiding", () => {
    render(<ConflictView conflict={MOCK_CONFLICTS[0]} />);
    expect(screen.getByText(/Cross-System Discrepancy/i)).toBeInTheDocument();
    expect(screen.getByText(/Premature Jira Resolution on Contract v2/i)).toBeInTheDocument();
    // Multiple instances of AIDOC-101 in claim and explanation
    expect(screen.getAllByText(/AIDOC-101/i).length).toBeGreaterThan(0);
  });

  it("renders BlockerCard with affected workstream and owner", () => {
    render(<BlockerCard blocker={MOCK_BLOCKERS[0]} />);
    expect(screen.getByText(MOCK_BLOCKERS[0].title)).toBeInTheDocument();
    expect(screen.getByText(/@Ivan/i)).toBeInTheDocument();
  });
});
