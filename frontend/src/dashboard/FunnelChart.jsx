import { useEffect, useState } from 'react';
import { api } from '../api';
import { ArrowDown, GitBranch } from 'lucide-react';

export default function FunnelChart() {
    const [funnelData, setFunnelData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        api.getFunnels().then(data => {
            setFunnelData(data);
            setLoading(false);
            setTimeout(() => setAnimated(true), 100);
        });
    }, []);

    if (loading) return (
        <div className="card" style={{
            background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '20px',
            border: '1px solid var(--border)', height: '300px',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
            <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: '#00f2ea', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );

    const maxCount = Math.max(...funnelData.map(d => d.count), 1);
    const colors = ['#00f2ea', '#8b5cf6', '#f43f5e', '#f59e0b', '#10b981'];

    return (
        <div className="card" style={{
            background: 'var(--bg-card)',
            padding: '1.5rem',
            borderRadius: '20px',
            border: '1px solid var(--border)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Subtle grid pattern */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.03) 1px, transparent 0)',
                backgroundSize: '20px 20px',
                pointerEvents: 'none'
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem', position: 'relative', zIndex: 1 }}>
                <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: 'rgba(0,242,234,0.1)', border: '1px solid rgba(0,242,234,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <GitBranch size={14} color="#00f2ea" />
                </div>
                <h3 style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '600' }}>
                    User Journey Funnel
                </h3>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                {funnelData.map((step, i) => {
                    const widthPct = (step.count / maxCount) * 100;
                    const dropoff = i > 0 ? ((1 - step.count / funnelData[i - 1].count) * 100).toFixed(1) : 0;
                    const color = colors[i % colors.length];

                    return (
                        <div key={i} style={{ marginBottom: i < funnelData.length - 1 ? '0' : '0' }}>
                            {/* Funnel bar row */}
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: '0.8rem',
                                padding: '0.6rem 0',
                            }}>
                                {/* Stage name */}
                                <div style={{
                                    width: '80px', flexShrink: 0,
                                    fontSize: '0.78rem', fontWeight: '600',
                                    color: 'var(--text-secondary)'
                                }}>{step.stage}</div>

                                {/* Animated bar */}
                                <div style={{
                                    flex: 1, height: '32px', borderRadius: '8px',
                                    background: 'rgba(255,255,255,0.03)',
                                    position: 'relative', overflow: 'hidden'
                                }}>
                                    <div style={{
                                        width: animated ? `${widthPct}%` : '0%',
                                        height: '100%',
                                        borderRadius: '8px',
                                        background: `linear-gradient(90deg, ${color}, ${color}99)`,
                                        transition: `width 1.2s cubic-bezier(0.4, 0, 0.2, 1) ${i * 200}ms`,
                                        position: 'relative',
                                        boxShadow: `0 0 20px ${color}30`
                                    }}>
                                        {/* Shimmer overlay */}
                                        <div style={{
                                            position: 'absolute', inset: 0,
                                            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                                            animation: 'barShimmer 3s ease infinite',
                                            animationDelay: `${i * 0.5}s`
                                        }} />
                                    </div>
                                </div>

                                {/* Count badge */}
                                <div style={{
                                    minWidth: '48px', textAlign: 'right',
                                    fontSize: '0.95rem', fontWeight: '800',
                                    color, letterSpacing: '-0.02em',
                                    opacity: animated ? 1 : 0,
                                    transform: animated ? 'translateX(0)' : 'translateX(10px)',
                                    transition: `all 0.6s ease ${i * 200 + 400}ms`
                                }}>{step.count}</div>
                            </div>

                            {/* Drop-off arrow between steps */}
                            {i < funnelData.length - 1 && (
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                                    paddingLeft: '88px',
                                    opacity: animated ? 0.7 : 0,
                                    transition: `opacity 0.5s ease ${i * 200 + 600}ms`
                                }}>
                                    <ArrowDown size={12} color="#f43f5e" />
                                    <span style={{
                                        fontSize: '0.68rem', fontWeight: '600',
                                        color: '#f43f5e',
                                        padding: '0.1rem 0.4rem',
                                        borderRadius: '4px',
                                        background: 'rgba(244,63,94,0.1)'
                                    }}>-{dropoff}% drop-off</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <style>{`
                @keyframes barShimmer {
                    0%, 100% { transform: translateX(-100%); }
                    50% { transform: translateX(200%); }
                }
            `}</style>
        </div>
    );
}
