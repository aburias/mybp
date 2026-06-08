"use client";

import { useState, useEffect } from "react";
import BloodPressureForm from "@/components/BloodPressureForm";
import BloodPressureChart from "@/components/BloodPressureChart";
import { format, subDays, startOfMonth } from "date-fns";

export default function Home() {
  const [readings, setReadings] = useState([]);
  const [filter, setFilter] = useState("all");
  const [customRange, setCustomRange] = useState({
    from: format(subDays(new Date(), 7), "yyyy-MM-dd"),
    to: format(new Date(), "yyyy-MM-dd")
  });
  const [loading, setLoading] = useState(true);

  const fetchReadings = async () => {
    setLoading(true);
    let url = "/api/readings";

    if (filter === "week") {
      const from = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
      const to = new Date().toISOString();
      url += `?from=${from}&to=${to}`;
    } else if (filter === "month") {
      const from = startOfMonth(new Date()).toISOString();
      const to = new Date().toISOString();
      url += `?from=${from}&to=${to}`;
    } else if (filter === "custom") {
      const fromDate = new Date(customRange.from);
      const toDate = new Date(customRange.to);
      toDate.setHours(23, 59, 59, 999);
      url += `?from=${fromDate.toISOString()}&to=${toDate.toISOString()}`;
    }

    try {
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setReadings(data);
      }
    } catch (error) {
      console.error("Error fetching readings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReadings();
  }, [filter, customRange]);

  const handleAddReading = (newReading) => {
    fetchReadings();
  };

  return (
    <div className="container">
      <div className="bg-gradient"></div>
      
      <div className="header">
        <h1>Blood Pressure Tracker</h1>
        <p>Monitor your cardiovascular health simply and securely.</p>
      </div>

      <BloodPressureForm onAddReading={handleAddReading} />

      <div style={{ position: 'relative' }}>
        {loading && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--card-bg)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '20px', backdropFilter: 'blur(2px)' }}>
            <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>Updating...</span>
          </div>
        )}
        <BloodPressureChart 
          readings={readings} 
          filter={filter} 
          setFilter={setFilter} 
          customRange={customRange} 
          setCustomRange={setCustomRange} 
          onDelete={fetchReadings}
        />
      </div>
    </div>
  );
}
