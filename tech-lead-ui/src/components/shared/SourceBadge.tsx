import React from "react";
import { SourceType } from "@/types";
import { MessageSquare, GitPullRequest, FileText, CheckSquare } from "lucide-react";

interface SourceBadgeProps {
  sourceType: SourceType;
  externalId?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ sourceType, externalId }) => {
  const getSourceConfig = (type: SourceType) => {
    switch (type) {
      case "jira":
        return {
          icon: <CheckSquare className="w-3 h-3 text-blue-400 mr-1" />,
          name: "Jira",
          color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        };
      case "github":
        return {
          icon: <GitPullRequest className="w-3 h-3 text-violet-400 mr-1" />,
          name: "GitHub",
          color: "text-violet-400 bg-violet-500/10 border-violet-500/20",
        };
      case "slack":
        return {
          icon: <MessageSquare className="w-3 h-3 text-emerald-400 mr-1" />,
          name: "Slack",
          color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
        };
      case "confluence":
        return {
          icon: <FileText className="w-3 h-3 text-amber-400 mr-1" />,
          name: "Confluence",
          color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
        };
    }
  };

  const config = getSourceConfig(sourceType);

  return (
    <span
      className={`inline-flex items-center text-xs px-2 py-0.5 rounded border font-mono ${config.color}`}
    >
      {config.icon}
      <span>{externalId ? `${config.name} (${externalId})` : config.name}</span>
    </span>
  );
};
