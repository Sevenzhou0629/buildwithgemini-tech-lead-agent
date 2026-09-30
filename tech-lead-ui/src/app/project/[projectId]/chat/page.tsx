"use client";

import React, { useState, useEffect } from "react";
import { AgentChatMessage } from "@/types";
import { INITIAL_CHAT_MESSAGES } from "@/mock/projectData";
import { AgentResponseView } from "@/components/agent/AgentResponseView";
import { apiClient } from "@/services/api";
import { useUIStore } from "@/store/uiStore";
import { Sparkles, Send, CornerDownLeft, Bot, RefreshCw } from "lucide-react";

export default function ChatConsolePage() {
  const { scopeQueryText, setScopeQueryText } = useUIStore();
  const [messages, setMessages] = useState<AgentChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  useEffect(() => {
    if (scopeQueryText) {
      setInputValue(scopeQueryText);
      setScopeQueryText("");
    }
  }, [scopeQueryText, setScopeQueryText]);

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || inputValue;
    if (!query.trim() || isThinking) return;

    const userMsg: AgentChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      timestamp: "Just now",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");
    setIsThinking(true);

    try {
      const response = await apiClient.sendChatMessage("ai-doc-split", query);
      setMessages((prev) => [...prev, response]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsThinking(false);
    }
  };

  const quickPrompts = [
    "What is currently blocking PRT Launch?",
    "Why does Jira say Done when PR #211 is open?",
    "Show Datadog monitoring gaps",
    "What is Zhuo waiting on?",
  ];

  return (
    <div className="max-w-4xl mx-auto flex flex-col h-[calc(100vh-8.5rem)]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-zinc-100">Tech Lead Agent Operational Console</h1>
            <p className="text-xs text-zinc-400">
              Grounded cross-system reasoning across Jira, GitHub, Slack, and Confluence.
            </p>
          </div>
        </div>

        <button
          onClick={() => setMessages(INITIAL_CHAT_MESSAGES)}
          className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center space-x-1"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset conversation</span>
        </button>
      </div>

      {/* Messages stream */}
      <div className="flex-1 overflow-y-auto py-4 space-y-6 pr-2">
        {messages.map((msg) => (
          <AgentResponseView key={msg.id} message={msg} />
        ))}

        {isThinking && (
          <div className="flex items-center space-x-3 text-xs text-indigo-400 bg-indigo-950/20 border border-indigo-500/20 p-3 rounded-xl animate-pulse">
            <Bot className="w-4 h-4 animate-spin" />
            <span>Agent reconciling Jira, GitHub, Slack, and Confluence evidence...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts */}
      <div className="py-2 flex flex-wrap gap-1.5">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(qp)}
            className="text-[11px] font-mono bg-zinc-950 hover:bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded border border-zinc-800 transition"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input box */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 flex items-center space-x-2 shadow-lg">
        <input
          type="text"
          placeholder="Ask the Tech Lead Agent (e.g. 'Are we ready for production?', 'What is Ivan blocked on?')..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 bg-transparent px-2 py-1 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={!inputValue.trim() || isThinking}
          className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white p-2 rounded-lg transition"
        >
          <CornerDownLeft className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
