import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../api';
import { Brain, Activity, TrendingDown, Layers } from 'lucide-react';

export default function AcademicDashboard() {
    const [stats, setStats] = useState(null);
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await api.getAcademicStats();
            setStats(data);
            setTimeout(() => setAnimated(true), 200);
        };
        fetchStats();
        const interval = setInterval(fetchStats, 5000);
        return () => clearInterval(interval);
    }, []);

    if (!stats) return (
        <div style={{ color: '#94a3b8', textAlign: 'center', padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div className="spinner" style={spinnerStyle} />
            Loading Behavioral Engine...
        </div>
    );

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem', animation: 'fadeIn 0.5s ease' }}>
            {/* Pattern Analysis */}
            <div className="card" style={cardStyle}>
                <div style={headerStyle}>
                    <div style={{ ...iconWrapperStyle, background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                        <Brain size={16} color="#8b5cf6" />
                    </div>
                    <h3 style={titleStyle}>Behavioral Pattern Distribution</h3>
                </div>
                <CustomDonut data={stats.patterns} animated={animated} />
                <p style={descStyle}>Categorizing users based on interaction styles (e.g., Frustrated, Explorer).</p>
            </div>

            {/* UX Debt Leaderboard */}
            <div className="card" style={cardStyle}>
                <div style={headerStyle}>
                    <div style={{ ...iconWrapperStyle, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <TrendingDown size={16} color="#ef4444" />
                    </div>
                    <h3 style={titleStyle}>UX Debt Index (By Page)</h3>
                </div>
                <CustomBarChart data={stats.uxDebt} animated={animated} color="#ef4444" labelKey="page_url" valueKey="debt_index" />
                <p style={descStyle}>Accumulated friction normalized by visit frequency.</p>
            </div>

            {/* Cognitive Load Proxy */}
            <div className="card" style={cardStyle}>
                <div style={headerStyle}>
                    <div style={{ ...iconWrapperStyle, background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                        <Layers size={16} color="#3b82f6" />
                    </div>
                    <h3 style={titleStyle}>Cognitive Load Heatmap (Proxy)</h3>
                </div>
                <CustomBarChart data={stats.cognitiveLoad} animated={animated} color="#3b82f6" labelKey="page_url" valueKey="avg_load" />
                <p style={descStyle}>Estimating interaction complexity based on element density.</p>
            </div>

            {/* Friction Escalation Timeline */}
            <div className="card" style={cardStyle}>
                <div style={headerStyle}>
                    <div style={{ ...iconWrapperStyle, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <Activity size={16} color="#10b981" />
                    </div>
                    <h3 style={titleStyle}>Recent Friction Escalation</h3>
                </div>
                <div style={{ overflowY: 'auto', maxHeight: '220px', paddingRight: '0.5rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ color: '#94a3b8', fontSize: '0.7rem', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <th style={{ padding: '0.75rem 0.5rem' }}>SESSION</th>
                                <th style={{ padding: '0.75rem 0.5rem' }}>PATTERN</th>
                                <th style={{ padding: '0.75rem 0.5rem' }}>INTENSITY</th>
                                <th style={{ padding: '0.75rem 0.5rem', textAlign: 'right' }}>SCORE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.escalation.map((s, i) => (
                                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '0.8rem', transition: 'background 0.2s' }} className="table-row-hover">
                                    <td style={{ padding: '0.75rem 0.5rem', color: '#fff', fontFamily: 'monospace' }}>{s.id.substring(0, 8)}</td>
                                    <td style={{ padding: '0.75rem 0.5rem' }}>
                                        <span style={{ 
                                            padding: '2px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600',
                                            background: s.primary_pattern === 'Frustrated' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(59, 130, 246, 0.15)', 
                                            color: s.primary_pattern === 'Frustrated' ? '#f87171' : '#60a5fa',
                                            border: s.primary_pattern === 'Frustrated' ? '1px solid rgba(239, 68, 68, 0.2)' : '1px solid rgba(59, 130, 246, 0.2)'
                                        }}>{s.primary_pattern}</span>
                                    </td>
                                    <td style={{ padding: '0.75rem 0.5rem', color: s.friction_level === 'High' ? '#f87171' : '#10b981', fontWeight: '500' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: s.friction_level === 'High' ? '#ef4444' : '#10b981' }} />
                                            {s.friction_level}
                                        </div>
                                    </td>
                                    <td style={{ padding: '0.75rem 0.5rem', fontWeight: 'bold', textAlign: 'right', color: '#fff' }}>{Math.round(s.total_friction_score)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .table-row-hover:hover { background: rgba(255,255,255,0.02); }
                .spinner { width: 30px; height: 30px; border: 3px solid rgba(255,255,255,0.05); border-top-color: #8b5cf6; border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

// ─── CUSTOM SVG DONUT ─────────────────────────────────
const COLORS = ['#8b5cf6', '#ef4444', '#10b981', '#f59e0b', '#3b82f6'];

function CustomDonut({ data, animated }) {
    const total = useMemo(() => data.reduce((s, d) => s + d.count, 0), [data]);
    const [hovered, setHovered] = useState(-1);

    const segments = useMemo(() => {
        let currentAcc = 0;
        const result = [];
        data.forEach((d, i) => {
            const pct = d.count / total;
            const start = currentAcc;
            currentAcc += pct;
            result.push({ ...d, pct, start, color: COLORS[i % COLORS.length] });
        });
        return result;
    }, [data, total]);

    return (
        <div style={{ height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '2rem' }}>
            <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                <svg viewBox="0 0 100 100" width="160" height="160">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
                    {segments.map((seg, i) => {
                        const r = 40;
                        const circ = 2 * Math.PI * r;
                        const offset = -90 + (seg.start * 360);
                        return (
                            <circle
                                key={i}
                                cx="50" cy="50" r={r}
                                fill="none"
                                stroke={seg.color}
                                strokeWidth={hovered === i ? 16 : 12}
                                strokeDasharray={`${seg.pct * circ} ${circ}`}
                                strokeDashoffset={0}
                                style={{
                                    transform: `rotate(${offset}deg)`,
                                    transformOrigin: '50% 50%',
                                    transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                                    opacity: animated ? 1 : 0,
                                    cursor: 'pointer'
                                }}
                                onMouseEnter={() => setHovered(i)}
                                onMouseLeave={() => setHovered(-1)}
                            />
                        );
                    })}
                </svg>
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: '800', color: hovered >= 0 ? segments[hovered].color : '#fff', transition: 'color 0.3s' }}>
                        {hovered >= 0 ? `${Math.round(segments[hovered].pct * 100)}%` : total}
                    </span>
                    <span style={{ fontSize: '0.6rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        {hovered >= 0 ? segments[hovered].primary_pattern : 'Total'}
                    </span>
                </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {segments.map((seg, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', opacity: hovered === -1 || hovered === i ? 1 : 0.4, transition: 'opacity 0.2s' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: seg.color }} />
                        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{seg.primary_pattern}</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#fff', marginLeft: 'auto' }}>{seg.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

// ─── CUSTOM SVG BAR CHART ─────────────────────────────
function CustomBarChart({ data, animated, color, labelKey, valueKey }) {
    const maxVal = useMemo(() => Math.max(...data.map(d => d[valueKey]), 1), [data, valueKey]);

    return (
        <div style={{ height: '220px', display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '1rem 0' }}>
            {data.slice(0, 5).map((d, i) => {
                const widthPct = (d[valueKey] / maxVal) * 100;
                return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8' }}>
                            <span style={{ maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d[labelKey]}</span>
                            <span style={{ fontWeight: '700', color: '#fff' }}>{d[valueKey].toFixed(1)}</span>
                        </div>
                        <div style={{ height: '8px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ 
                                height: '100%', width: animated ? `${widthPct}%` : '0%', 
                                background: `linear-gradient(90deg, ${color}cc, ${color})`,
                                transition: `width 1s cubic-bezier(0.4, 0, 0.2, 1) ${i * 100}ms`,
                                borderRadius: '4px',
                                boxShadow: `0 0 10px ${color}30`
                            }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ─── STYLES ───────────────────────────────────────────
const spinnerStyle = {
    width: '30px',
    height: '30px',
    border: '3px solid rgba(255,255,255,0.1)',
    borderTopColor: '#8b5cf6',
    borderRadius: '50%',
    animation: 'spin 1.2s linear infinite'
};

const cardStyle = {
    background: 'var(--bg-card)',
    padding: '1.5rem',
    borderRadius: '20px',
    border: '1px solid var(--border)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    overflow: 'hidden'
};

const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1.5rem'
};

const iconWrapperStyle = {
    width: '32px',
    height: '32px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

const titleStyle = {
    margin: 0,
    fontSize: '0.875rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '600'
};

const descStyle = {
    marginTop: '1.2rem',
    fontSize: '0.7rem',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: '1.4'
};
