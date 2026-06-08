"use client";

import { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { format } from "date-fns";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const CHART_COLORS = {
  primary: '#6366f1',
  secondary: '#94a3b8',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  crisis: '#7f1d1d',
  grid: 'rgba(255, 255, 255, 0.05)',
  text: '#94a3b8'
};

const getSysCategory = (sys) => {
  if (sys > 180) return { label: 'Crisis', color: CHART_COLORS.crisis };
  if (sys >= 140) return { label: 'Stage 2', color: CHART_COLORS.danger };
  if (sys >= 130) return { label: 'Stage 1', color: CHART_COLORS.warning };
  if (sys >= 120) return { label: 'Elevated', color: CHART_COLORS.warning };
  return { label: 'Normal', color: CHART_COLORS.success };
};

const getDiaCategory = (dia) => {
  if (dia > 120) return { label: 'Crisis', color: CHART_COLORS.crisis };
  if (dia >= 90) return { label: 'Stage 2', color: CHART_COLORS.danger };
  if (dia >= 80) return { label: 'Stage 1', color: CHART_COLORS.warning };
  return { label: 'Normal', color: CHART_COLORS.success };
};

export default function BloodPressureChart({ readings, filter, setFilter, customRange, setCustomRange }) {
  const [chartData, setChartData] = useState(null);
  const [viewMode, setViewMode] = useState("chart");

  useEffect(() => {
    if (!readings || readings.length === 0) {
      setChartData(null);
      return;
    }

    const labels = readings.map(r => format(new Date(r.createdAt), "MMM d, h:mm a"));
    const sysData = readings.map(r => r.systolic);
    const diaData = readings.map(r => r.diastolic);
    const sysColors = readings.map(r => getSysCategory(r.systolic).color);
    const diaColors = readings.map(r => getDiaCategory(r.diastolic).color);

    setChartData({
      labels,
      datasets: [
        {
          label: "Systolic",
          data: sysData,
          borderColor: CHART_COLORS.primary,
          backgroundColor: "rgba(99, 102, 241, 0.2)",
          pointBackgroundColor: sysColors,
          pointBorderColor: sysColors,
          pointRadius: 6,
          pointStyle: 'circle',
          tension: 0.3,
        },
        {
          label: "Diastolic",
          data: diaData,
          borderColor: CHART_COLORS.secondary,
          backgroundColor: "rgba(148, 163, 184, 0.2)",
          pointBackgroundColor: diaColors,
          pointBorderColor: diaColors,
          pointRadius: 6,
          pointStyle: 'triangle',
          tension: 0.3,
          borderDash: [5, 5],
        },
      ],
    });
  }, [readings]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          afterBody: (context) => {
            const idx = context[0].dataIndex;
            const r = readings[idx];
            return `Sys: ${getSysCategory(r.systolic).label}\nDia: ${getDiaCategory(r.diastolic).label}`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 40,
        max: 220,
        grid: { color: CHART_COLORS.grid },
        ticks: { color: CHART_COLORS.text }
      },
      x: {
        grid: { display: false },
        ticks: { color: CHART_COLORS.text, maxRotation: 45, minRotation: 45 }
      }
    },
  };

  return (
    <div className="glass-card">
      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: 0 }}>History & Trends</h2>
          <div className="view-toggle">
            <button className={viewMode === 'chart' ? 'active' : ''} onClick={() => setViewMode('chart')}>Graph</button>
            <button className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>List</button>
          </div>
        </div>
        
        <div className="chart-filters">
          <button 
            className={`filter-btn ${filter === 'week' ? 'active' : ''}`}
            onClick={() => setFilter('week')}
          >
            This Week
          </button>
          <button 
            className={`filter-btn ${filter === 'month' ? 'active' : ''}`}
            onClick={() => setFilter('month')}
          >
            This Month
          </button>
          <button 
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Time
          </button>
          <button 
            className={`filter-btn ${filter === 'custom' ? 'active' : ''}`}
            onClick={() => setFilter('custom')}
          >
            Custom
          </button>
        </div>

        {filter === 'custom' && (
          <div className="custom-date-picker">
            <input 
              type="date" 
              value={customRange.from} 
              onChange={(e) => setCustomRange({...customRange, from: e.target.value})}
            />
            <span style={{ color: 'var(--text-secondary)' }}>to</span>
            <input 
              type="date" 
              value={customRange.to} 
              onChange={(e) => setCustomRange({...customRange, to: e.target.value})}
            />
          </div>
        )}
      </div>

      {viewMode === 'chart' ? (
        <>
          {chartData ? (
            <div style={{ height: '300px', width: '100%', marginBottom: '20px' }}>
              <Line options={options} data={chartData} />
            </div>
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>
              No readings found for this period.
            </p>
          )}

          <div className="legend-container" style={{ justifyContent: 'center', marginBottom: '16px' }}>
            <div className="legend-item"><div className="legend-color" style={{background: 'var(--primary-color)', borderRadius: '50%'}}></div> Systolic</div>
            <div className="legend-item">
              <div style={{ width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '10px solid var(--text-secondary)' }}></div> Diastolic
            </div>
          </div>

          <div className="legend-container" style={{ borderTop: '1px solid var(--card-border)', paddingTop: '16px', justifyContent: 'center' }}>
            <div className="legend-item"><div className="legend-color" style={{background: 'var(--success-color)'}}></div> Normal</div>
            <div className="legend-item"><div className="legend-color" style={{background: 'var(--warning-color)'}}></div> Elevated/Stage 1</div>
            <div className="legend-item"><div className="legend-color" style={{background: 'var(--danger-color)'}}></div> Stage 2</div>
            <div className="legend-item"><div className="legend-color" style={{background: 'var(--crisis-color)'}}></div> Crisis</div>
          </div>
        </>
      ) : (
        <div className="list-view">
          {(() => {
            const sortedReadings = [...readings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const groupedReadings = [];
            sortedReadings.forEach(r => {
              const dateStr = format(new Date(r.createdAt), "EEEE, MMM d, yyyy");
              const lastGroup = groupedReadings[groupedReadings.length - 1];
              if (lastGroup && lastGroup.dateStr === dateStr) {
                lastGroup.items.push(r);
              } else {
                groupedReadings.push({ dateStr, items: [r] });
              }
            });

            if (groupedReadings.length === 0) {
              return (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>
                  No readings found for this period.
                </p>
              );
            }

            return groupedReadings.map((group, idx) => (
              <div key={idx} className="list-group" style={{ marginBottom: '20px' }}>
                <div style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', marginBottom: '12px', fontWeight: '600', color: 'var(--text-primary)', borderBottom: '1px solid var(--card-border)' }}>
                  {group.dateStr}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {group.items.map(r => (
                    <div key={r.id} className="list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'rgba(0,0,0,0.1)', borderRadius: '12px', borderLeft: `4px solid ${getSysCategory(r.systolic).color}`, boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.02)' }}>
                      <div>
                        <div style={{ fontSize: '1.1rem', color: 'var(--text-primary)', fontWeight: '500' }}>{format(new Date(r.createdAt), "h:mm a")}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{getSysCategory(r.systolic).label}</div>
                      </div>
                      <div style={{ textAlign: 'right', display: 'flex', gap: '24px' }}>
                        <div>
                          <div style={{ color: getSysCategory(r.systolic).color, fontWeight: 'bold', fontSize: '1.35rem' }}>
                            {r.systolic}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Sys</div>
                        </div>
                        <div>
                          <div style={{ color: getDiaCategory(r.diastolic).color, fontWeight: 'bold', fontSize: '1.35rem' }}>
                            {r.diastolic}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Dia</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ));
          })()}
        </div>
      )}
    </div>
  );
}
