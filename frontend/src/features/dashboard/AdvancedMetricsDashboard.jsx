import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../../lib/api';
import QualityScoreCard from './QualityScoreCard';
import MetricScales from './MetricScales';
import { Target, TrendingUp, Zap, MousePointer2, AlertCircle, RefreshCw, BarChart3, Activity } from 'lucide-react';

export default function AdvancedMetricsDashboard() {
    const [stats, setStats] = useState(null);
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            const data = await api.getAdvancedStats();
            setStats(data);
            setTimeout(() => setAnimated(true), 150);
        };
        fetchStats();
        const interval = setInterval(fetchStats, 6000);
        return () => clearInterval(interval);
    }, []);

    if (!stats) return (
        <div style={{ color: '#94a3b8', textAlign: 'center', padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div className="spinner" style={spinnerStyle} />
            Loading Advanced Intelligence...
        </div>
    );

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', animation: 'fadeIn 0.5s ease' }}>
            {/* Quality Score (Tier 1) */}
            <div className="card" style={{ ...cardStyle, background: 'linear-gradient(145deg, #1e293b 0%, #0f172a 100%)' }}>
                <QualityScoreCard score={stats.avgQuality || 100} />
            </div>

            {/* Behavioral Metrics (Tier 2) */}
            <div className="card" style={{ ...cardStyle, gridRow: 'span 2' }}>
                <div style={headerStyle}>
                    <div style={{ ...iconWrapperStyle, background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                        <Zap size={16} color="#38bdf8" />
                    </div>
                    <h3 style={titleStyle}>Interaction Density Scales</h3>
                </div>
                <MetricScales 
                    drift={stats.avgDrift || 0}
                    expectation={stats.avgEntryExpectation || 0}
                    density={stats.avgDensity || 0}
                />
            </div>

            {/* Confidence Gauge (Tier 3) */}
            <div className="card" style={cardStyle}>
                <div style={headerStyle}>
                    <div style={{ ...iconWrapperStyle, background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                        <Target size={16} color="#38bdf8" />
                    </div>
                    <h3 style={titleStyle}>System Confidence</h3>
                </div>
                <div style={{ height: '140px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <div style={{ fontSize: '3rem', fontWeight: '900', color: '#38bdf8', textShadow: '0 0 20px rgba(56, 189, 248, 0.4)' }}>
                        {Math.round(stats.avgConfidence)}%
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Reliability Factor
                    </div>
                </div>
                <p style={descStyle}>Friction ID Confidence: {(stats.frictionConfidence * 100).toFixed(0)}%</p>
            </div>

            {/* First-Time vs Returning */}
            <div className="card" style={cardStyle}>
                 <div style={headerStyle}>
                    <div style={{ ...iconWrapperStyle, background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                        <TrendingUp size={16} color="#8b5cf6" />
                    </div>
                    <h3 style={titleStyle}>User Loyalty Friction</h3>
                </div>
                <CustomMetricBar data={stats.userComparison} animated={animated} />
                <p style={descStyle}>
                    {stats.userComparison[0]?.avg_friction > stats.userComparison[1]?.avg_friction 
                        ? 'Retention risk: Potential onboarding friction' 
                        : 'UX consistency verified across segments'}
                </p>
            </div>

            {/* Entry-Point Analysis */}
            <div className="card" style={cardStyle}>
                <div style={headerStyle}>
                    <div style={{ ...iconWrapperStyle, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <AlertCircle size={16} color="#ef4444" />
                    </div>
                    <h3 style={titleStyle}>High-Friction Landing Pages</h3>
                </div>
                <div style={{ overflowY: 'auto', maxHeight: '180px' }}>
                    {stats.entryPointFriction.slice(0, 5).map((ep, i) => (
                        <div key={i} style={{ marginBottom: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)' }}>
                            <div style={{ fontSize: '0.8rem', color: '#fff', fontWeight: '600' }}>{ep.entry_page}</div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Score: <strong style={{ color: '#f87171' }}>{Math.round(ep.avg_friction)}</strong></span>
                                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Visits: {ep.visits}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recovery Rate */}
            <div className="card" style={cardStyle}>
                <div style={headerStyle}>
                    <div style={{ ...iconWrapperStyle, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                        <RefreshCw size={16} color="#10b981" />
                    </div>
                    <h3 style={titleStyle}>Bounce Recovery Efficiency</h3>
                </div>
                <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                    <div style={{ fontSize: '3.5rem', fontWeight: '900', color: '#10b981', textShadow: '0 0 25px rgba(16, 185, 129, 0.3)' }}>{stats.recoveryRate}%</div>
                    <p style={{ ...descStyle, marginTop: '0.5rem', fontWeight: '600' }}>Engagement Restored</p>
                    <div style={{ fontSize: '0.7rem', color: '#64748b', marginTop: '1rem', background: 'rgba(255,255,255,0.03)', padding: '0.5rem', borderRadius: '6px' }}>
                        {stats.recoveryStats?.recovered} / {stats.recoveryStats?.total} friction sessions stabilized
                    </div>
                </div>
            </div>

            {/* Decision Paralysis */}
            <div className="card" style={cardStyle}>
                <div style={headerStyle}>
                    <div style={{ ...iconWrapperStyle, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                        <BarChart3 size={16} color="#f59e0b" />
                    </div>
                    <h3 style={titleStyle}>Decision Paralysis</h3>
                </div>
                <div style={{ overflowY: 'auto', maxHeight: '180px' }}>
                    {stats.decisionParalysis?.length === 0 && <p style={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'center', marginTop: '2rem' }}>No significant paralysis detected</p>}
                    {stats.decisionParalysis?.slice(0, 5).map((p, i) => (
                        <div key={i} style={{ marginBottom: '0.5rem', padding: '0.6rem', borderLeft: '3px solid #f59e0b', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '0 8px 8px 0' }}>
                            <div style={{ fontSize: '0.75rem', color: '#fff' }}>Sess: {p.id.substring(0, 8)}</div>
                            <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 'bold' }}>Conflict Score: {Math.round(p.decision_paralysis_score)}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Click Efficiency */}
            <div className="card" style={cardStyle}>
                 <div style={headerStyle}>
                    <div style={{ ...iconWrapperStyle, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <MousePointer2 size={16} color="#ef4444" />
                    </div>
                    <h3 style={titleStyle}>Click Waste Ratio</h3>
                </div>
                <div style={{ overflowY: 'auto', maxHeight: '180px' }}>
                    {stats.clickEfficiency?.slice(0, 5).map((c, i) => (
                        <div key={i} style={{ marginBottom: '0.5rem', padding: '0.6rem', background: 'rgba(255,255,255,0.02)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{c.id.substring(0, 8)}</span>
                                <span style={{ fontSize: '0.9rem', fontWeight: '800', color: c.click_waste_ratio > 3 ? '#f87171' : '#10b981' }}>{c.click_waste_ratio.toFixed(1)}x</span>
                            </div>
                        </div>
                    ))}
                </div>
                <p style={descStyle}>Ratio of actual vs required interactions</p>
            </div>

            {/* Friction Evolution */}
            <div className="card" style={{ ...cardStyle, gridColumn: 'span 2' }}>
                 <div style={headerStyle}>
                    <div style={{ ...iconWrapperStyle, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <Activity size={16} color="#ef4444" />
                    </div>
                    <h3 style={titleStyle}>Friction Accumulation (Real-Time)</h3>
                </div>
                <CustomAreaChart data={stats.frictionEvolution} animated={animated} />
                <p style={descStyle}>Time-series signature of systemic friction accumulation</p>
            </div>

            {/* Complexity Warnings */}
            <div className="card" style={cardStyle}>
                <div style={headerStyle}>
                    <div style={{ ...iconWrapperStyle, background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                        <AlertCircle size={16} color="#f59e0b" />
                    </div>
                    <h3 style={titleStyle}>Complexity Thresholds</h3>
                </div>
                <div style={{ overflowY: 'auto', maxHeight: '200px' }}>
                    {stats.complexityWarnings?.length === 0 && <p style={{ color: '#64748b', fontSize: '0.8rem', textAlign: 'center', marginTop: '2rem' }}>All pages within optimal complexity</p>}
                    {stats.complexityWarnings?.map((c, i) => (
                        <div key={i} style={{ marginBottom: '0.5rem', padding: '0.6rem', borderLeft: '3px solid #f59e0b', background: 'rgba(245, 158, 11, 0.05)', borderRadius: '0 8px 8px 0' }}>
                            <div style={{ fontSize: '0.75rem', color: '#fff', fontWeight: '600' }}>{c.screen_name}</div>
                            <div style={{ fontSize: '0.7rem', color: '#f59e0b' }}>Optimization Required (Score: {c.warning_count})</div>
                        </div>
                    ))}
                </div>
            </div>
            
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .spinner { width: 30px; height: 30px; border: 3px solid rgba(255,255,255,0.05); border-top-color: #38bdf8; border-radius: 50%; animation: spin 0.8s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
}

// ─── CUSTOM SVG AREA CHART ────────────────────────────
function CustomAreaChart({ data, animated }) {
    const values = useMemo(() => data.slice(0, 20).reverse().map(f => f.friction_snapshot), [data]);
    const maxVal = Math.max(...values, 10);
    
    const W = 400, H = 150;
    const points = values.map((v, i) => ({
        x: (i / (values.length - 1)) * W,
        y: H - (v / maxVal) * H
    }));

    const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaD = `${pathD} L ${W} ${H} L 0 ${H} Z`;

    return (
        <div style={{ height: '180px', width: '100%', padding: '1rem 0' }}>
            <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
                <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={areaD} fill="url(#areaGrad)" opacity={animated ? 1 : 0} style={{ transition: 'opacity 1s ease 0.5s' }} />
                <path 
                    d={pathD} fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="1000" strokeDashoffset={animated ? 0 : 1000}
                    style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
                {points.map((p, i) => i % 5 === 0 && (
                     <circle key={i} cx={p.x} cy={p.y} r="4" fill="#ef4444" opacity={animated ? 1 : 0} style={{ transition: 'opacity 0.5s ease ' + (i * 0.1) + 's' }} />
                ))}
            </svg>
        </div>
    );
}

// ─── CUSTOM METRIC BAR ───────────────────────────────
function CustomMetricBar({ data, animated }) {
    const maxVal = Math.max(...data.map(d => d.avg_friction || 0), 10);
    
    return (
        <div style={{ height: '150px', display: 'flex', flexDirection: 'column', gap: '1.2rem', justifyContent: 'center' }}>
            {data.map((u, i) => {
                const widthPct = ((u.avg_friction || 0) / maxVal) * 100;
                const label = u.is_returning_user ? 'Returning' : 'First-Time';
                const color = u.is_returning_user ? '#8b5cf6' : '#3b82f6';
                
                return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '600' }}>
                            <span style={{ color: '#94a3b8' }}>{label} Users</span>
                            <span style={{ color: '#fff' }}>Score: {Math.round(u.avg_friction || 0)}</span>
                        </div>
                        <div style={{ height: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '5px', overflow: 'hidden' }}>
                            <div style={{ 
                                height: '100%', width: animated ? `${widthPct}%` : '0%', background: color, 
                                borderRadius: '5px', transition: `width 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${i * 200}ms`,
                                boxShadow: `0 0 10px ${color}40`
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
    border: '3px solid rgba(255,255,255,0.05)',
    borderTopColor: '#38bdf8',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite'
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
    fontSize: '0.8rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '700'
};

const descStyle = {
    marginTop: '1.2rem',
    fontSize: '0.7rem',
    color: '#64748b',
    textAlign: 'center',
    lineHeight: '1.4'
};

