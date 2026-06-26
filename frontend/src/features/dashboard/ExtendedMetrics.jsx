import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Activity, MousePointer2, Layers } from 'lucide-react';

const ExtendedMetrics = () => {
    const [frictionData, setFrictionData] = useState([]);
    const [pageMetrics, setPageMetrics] = useState([]);
    const [deadClicks, setDeadClicks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [friction, metrics, clicks] = await Promise.all([
                    api.getFrictionBreakdown(),
                    api.getPageMetrics(),
                    api.getDeadClicks()
                ]);
                
                setFrictionData(Array.isArray(friction) ? friction : []);
                setPageMetrics(Array.isArray(metrics) ? metrics : []);
                setDeadClicks(Array.isArray(clicks) ? clicks : []);
                setTimeout(() => setAnimated(true), 200);
            } catch (err) {
                console.error("Dashboard Data Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Listen for real-time updates
        const unsubscribe = api.onStatsUpdate(() => {
            fetchData();
        });

        return () => unsubscribe();
    }, []);

    if (loading) return (
        <div style={{ color: '#94a3b8', textAlign: 'center', padding: '4rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div className="spinner" style={spinnerStyle} />
            Loading Extended Intelligence...
        </div>
    );

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', margin: '1.5rem 0', animation: 'fadeIn 0.5s ease' }}>
            {/* Friction Component Breakdown */}
            <div className="card" style={cardStyle}>
                <div style={headerStyle}>
                    <div style={{ ...iconWrapperStyle, background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
                        <Layers size={16} color="#38bdf8" />
                    </div>
                    <h3 style={titleStyle}>Friction Component Breakdown</h3>
                </div>
                <CustomStackedBarChart data={frictionData} animated={animated} />
            </div>
            
            {/* Dead Clicks per Page */}
            <div className="card" style={cardStyle}>
                <div style={headerStyle}>
                    <div style={{ ...iconWrapperStyle, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                        <MousePointer2 size={16} color="#ef4444" />
                    </div>
                    <h3 style={titleStyle}>Dead Clicks per Page</h3>
                </div>
                <CustomSimpleBarChart data={deadClicks} animated={animated} />
            </div>
            
            {/* Interaction Timings & Scroll */}
            <div style={{ ...cardStyle, gridColumn: '1 / -1', height: '450px' }}>
                <div style={headerStyle}>
                    <div style={{ ...iconWrapperStyle, background: 'rgba(139, 92, 246, 0.1)', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
                        <Activity size={16} color="#8b5cf6" />
                    </div>
                    <h3 style={titleStyle}>Interaction Timings & Scroll Depth</h3>
                </div>
                <CustomDualLineChart data={pageMetrics} animated={animated} />
            </div>

            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                .spinner { width: 30px; height: 30px; border: 3px solid rgba(255,255,255,0.05); border-top-color: #38bdf8; border-radius: 50%; animation: spin 0.8s linear infinite; }
            `}</style>
        </div>
    );
};

// ─── CUSTOM STACKED BAR CHART ────────────────────────
function CustomStackedBarChart({ data, animated }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '1rem 0' }}>
            {data.slice(0, 5).map((d, i) => {
                const clickF = Math.max(0, 100 - (d.click || 100));
                const timeF = Math.max(0, 100 - (d.time || 100));
                const navF = Math.max(0, 100 - (d.nav || 100));
                const total = clickF + timeF + navF || 1;
                
                return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8' }}>
                            <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.screen_name}</span>
                            <span>Total Friction: <strong style={{color: '#fff'}}>{Math.round(total)}</strong></span>
                        </div>
                        <div style={{ height: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', overflow: 'hidden', display: 'flex' }}>
                            <div style={{ width: animated ? `${(clickF / 300) * 100}%` : '0%', background: '#38bdf8', transition: 'width 1s ease 0.1s' }} title="Click" />
                            <div style={{ width: animated ? `${(timeF / 300) * 100}%` : '0%', background: '#8b5cf6', transition: 'width 1s ease 0.2s' }} title="Time" />
                            <div style={{ width: animated ? `${(navF / 300) * 100}%` : '0%', background: '#ec4899', transition: 'width 1s ease 0.3s' }} title="Nav" />
                        </div>
                    </div>
                );
            })}
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <LegendItem color="#38bdf8" label="Click" />
                <LegendItem color="#8b5cf6" label="Time" />
                <LegendItem color="#ec4899" label="Nav" />
            </div>
        </div>
    );
}

// ─── CUSTOM SIMPLE BAR CHART ──────────────────────────
function CustomSimpleBarChart({ data, animated }) {
    const maxVal = Math.max(...data.map(d => d.count), 1);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', padding: '1rem 0' }}>
            {data.slice(0, 5).map((d, i) => {
                const widthPct = (d.count / maxVal) * 100;
                return (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#94a3b8' }}>
                            <span style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.page_url}</span>
                            <span style={{ fontWeight: '700', color: '#fff' }}>{d.count}</span>
                        </div>
                        <div style={{ height: '10px', background: 'rgba(255,255,255,0.03)', borderRadius: '5px', overflow: 'hidden' }}>
                            <div style={{ 
                                height: '100%', width: animated ? `${widthPct}%` : '0%', background: '#ef4444', 
                                transition: `width 1s cubic-bezier(0.4, 0, 0.2, 1) ${i * 100}ms` 
                            }} />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ─── CUSTOM DUAL LINE CHART ──────────────────────────
function CustomDualLineChart({ data, animated }) {
    const ttiValues = data.map(d => d.avg_tti || 0);
    const scrollValues = data.map(d => d.avg_scroll || 0);
    const maxTTI = Math.max(...ttiValues, 1000);
    
    const W = 800, H = 250;
    const pointsTTI = ttiValues.map((v, i) => ({ x: (i / (data.length - 1)) * W, y: H - (v / maxTTI) * H }));
    const pointsScroll = scrollValues.map((v, i) => ({ x: (i / (data.length - 1)) * W, y: H - (v / 100) * H }));

    const dTTI = pointsTTI.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const dScroll = pointsScroll.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return (
        <div style={{ flex: 1, padding: '1.5rem 0', position: 'relative' }}>
             <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: '100%', height: '300px', overflow: 'visible' }}>
                <path 
                    d={dTTI} fill="none" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="2000" strokeDashoffset={animated ? 0 : 2000}
                    style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
                <path 
                    d={dScroll} fill="none" stroke="#8b5cf6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                    strokeDasharray="2000" strokeDashoffset={animated ? 0 : 2000}
                    style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1) 0.5s' }}
                />
                {pointsTTI.map((p, i) => (
                    <circle key={i} cx={p.x} cy={p.y} r="4" fill="#38bdf8" opacity={animated ? 1 : 0} style={{ transition: 'opacity 0.5s ' + (i * 0.1) + 's' }} />
                ))}
            </svg>
            <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center', marginTop: '1rem' }}>
                <LegendItem color="#38bdf8" label="Time to Interactive (ms)" />
                <LegendItem color="#8b5cf6" label="Scroll Depth (%)" />
            </div>
        </div>
    );
}

function LegendItem({ color, label }) {
    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '3px', background: color }} />
            <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{label}</span>
        </div>
    );
}

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
    display: 'flex',
    flexDirection: 'column'
};

const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    marginBottom: '1rem'
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
    fontSize: '0.85rem',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    fontWeight: '700'
};

export default ExtendedMetrics;

