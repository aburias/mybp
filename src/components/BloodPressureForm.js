"use client";

import { useState } from "react";
import { Activity } from "lucide-react";

export default function BloodPressureForm({ onAddReading }) {
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!systolic || !diastolic) {
      setError("Please fill in both fields");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/readings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systolic, diastolic }),
      });

      if (!res.ok) throw new Error("Failed to save reading");

      const newReading = await res.json();
      onAddReading(newReading);
      
      setSystolic("");
      setDiastolic("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <Activity color="var(--primary-color)" />
        <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Add Reading</h2>
      </div>

      {error && <p style={{ color: 'var(--danger-color)', marginBottom: '12px', fontSize: '0.875rem' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="flex-row">
          <div className="form-group flex-1">
            <label>Systolic (mmHg)</label>
            <input
              type="number"
              className="form-input"
              value={systolic}
              onChange={(e) => setSystolic(e.target.value)}
              placeholder="120"
              min="50"
              max="250"
            />
          </div>
          <div className="form-group flex-1">
            <label>Diastolic (mmHg)</label>
            <input
              type="number"
              className="form-input"
              value={diastolic}
              onChange={(e) => setDiastolic(e.target.value)}
              placeholder="80"
              min="30"
              max="150"
            />
          </div>
        </div>
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? "Saving..." : "Save Reading"}
        </button>
      </form>
    </div>
  );
}
