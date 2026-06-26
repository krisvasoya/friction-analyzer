import React, { useEffect, useState, useMemo } from 'react';
import { api } from '../../lib/api';
import { Smartphone } from 'lucide-react';

const COLORS = ['#00f2ea', '#8b5cf6', '#ec4899'];

export default function DeviceBrowserPulse() {
    const [stats, setStats] = useState([]);
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        api.getDeviceStats().then(data => {
            setStats(data);
            setTimeout(() => setAnimated(true), 200);
        });
    }, []);

    const deviceGroups = useMemo(() => {
        const groups = {};
        stats.forEach(s => {
            groups[s.device_type] = (groups[s.device_type] || 0) + s.count;
        });
        const total = Object.values(groups).reduce((a, b) => a + b, 0) || 1;
        let acc = 0;
        return Object.entries(groups).map(([type, count], i) => {
            const pct = count / total;
            const start = acc;
            acc += pct;
            return { type, count, pct, start, color: COLORS[i % COLORS.length] };
        });
    }, [stats]);

    return (
        <div className="card" style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)', position: 'relative', overflow: 'hidden' }}>
            <h3 style={{ fontSize: '0.85rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Smartphone size={16} color="#3b82f6" />
                </div>
                Device & Browser Fidelity
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ position: 'relative', width: '150px', height: '150px', margin: '0 auto' }}>
                    <svg viewBox="0 0 100 100" width="150" height="150">
                        <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="12" />
                        {deviceGroups.map((group, i) => {
                            const r = 40;
                            const circ = 2 * Math.PI * r;
                            const offset = -90 + (group.start * 360);
                            return (
                                <circle
                                    key={i}
                                    cx="50" cy="50" r={r}
                                    fill="none"
                                    stroke={group.color}
                                    strokeWidth="12"
                                    strokeDasharray={`${group.pct * circ} ${circ}`}
                                    strokeDashoffset={0}
                                    style={{
                                        transform: `rotate(${offset}deg)`,
                                        transformOrigin: '50% 50%',
                                        transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                                        opacity: animated ? 1 : 0
                                    }}
                                />
                            );
                        })}
                    </svg>
                    <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: '800', color: '#fff' }}>{stats.reduce((a, b) => a + b.count, 0)}</span>
                        <span style={{ fontSize: '0.6rem', color: '#64748b', textTransform: 'uppercase' }}>Sessions</span>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    {stats.slice(0, 4).map((s, i) => (
                        <div key={i} style={{ padding: '0.6rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.03)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{s.browser}</span>
                                <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{s.device_type}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: '700', color: '#fff' }}>{s.count} <span style={{ fontSize: '0.6rem', fontWeight: '400', color: '#64748b' }}>Sess</span></span>
                                <div style={{ width: '40px', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', alignSelf: 'center', overflow: 'hidden' }}>
                                    <div style={{ width: '60%', height: '100%', background: '#3b82f6', borderRadius: '2px' }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <style>{`
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}

