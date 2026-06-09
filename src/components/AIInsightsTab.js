"use client";

import { useState } from "react";
import Markdown from "react-markdown";

export default function AIInsightsTab({ readings }) {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generateInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/ai-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ readings }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate insights");
      setInsights(data.insights);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card ai-insights">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: "600", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
          ✨ AI Health Insights
        </h2>
        <button 
          className="btn-primary" 
          onClick={generateInsights} 
          disabled={loading || readings.length === 0}
          style={{ padding: "8px 16px", fontSize: "0.9rem", width: "auto" }}
        >
          {loading ? "Analyzing..." : "Generate Report"}
        </button>
      </div>

      {error && <div style={{ color: "var(--danger-color)", marginBottom: "16px" }}>{error}</div>}

      {readings.length === 0 && !insights && !loading && (
        <p style={{ color: "var(--text-secondary)", textAlign: "center", padding: "40px 0" }}>
          Not enough data to analyze. Please add some readings first.
        </p>
      )}

      {loading && (
        <div className="loading-skeleton">
          <div className="skeleton-line" style={{ width: "80%", height: "20px", background: "rgba(255,255,255,0.1)", marginBottom: "12px", borderRadius: "4px", animation: "pulse 1.5s infinite" }}></div>
          <div className="skeleton-line" style={{ width: "95%", height: "20px", background: "rgba(255,255,255,0.1)", marginBottom: "12px", borderRadius: "4px", animation: "pulse 1.5s infinite" }}></div>
          <div className="skeleton-line" style={{ width: "70%", height: "20px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", animation: "pulse 1.5s infinite" }}></div>
        </div>
      )}

      {!loading && insights && (
        <div className="markdown-content" style={{ color: "var(--text-primary)", lineHeight: "1.6" }}>
          <Markdown>{insights}</Markdown>
        </div>
      )}
    </div>
  );
}
