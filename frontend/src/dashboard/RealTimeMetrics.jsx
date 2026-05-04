import { useEffect, useState, useRef } from 'react';
import { api } from '../api';
import { Users, MousePointerClick, TrendingUp, MapPin, ArrowUp, ArrowDown } from 'lucide-react';

function AnimatedValue({ value, suffix = '' }) {
    const [display, setDisplay] = useState(0);
    const prevRef = useRef(0);

    useEffect(() => {
        const prev = prevRef.current;
        const target = typeof value === 'number' ? value : parseFloat(value) || 0;
        const diff = target - prev;
        if (diff === 0) return;
        
        let start = prev;
        const steps = 30;
        const stepVal = diff / steps;
        let count = 0;
        const interval = setInterval(() => {
            count++;
            start += stepVal;
            if (count >= steps) {
                setDisplay(target);
                prevRef.current = target;
                clearInterval(interval);
            } else {
                setDisplay(Math.round(start * 10) / 10);
            }
        }, 20);
        return () => clearInterval(interval);
    }, [value]);

    return <>{typeof display === 'number' && display % 1 !== 0 ? display.toFixed(1) : display}{suffix}</>;
}

export default function RealTimeMetrics() {
    const [stats, setStats] = useState(null);
    const [prevStats, setPrevStats] = useState(null);
    const [pulse, setPulse] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await api.getStats();
                setPrevStats(stats);
                setStats(data);
                setPulse(true);
                setTimeout(() => setPulse(false), 600);
            } catch (e) {
                console.error(e);
            }
        };

        fetchStats();
        
        // Use real-time updates
        const unsubscribe = api.onStatsUpdate(() => {
            fetchStats();
        });

        return () => unsubscribe();
    }, [stats]);

    if (!stats) return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {[...Array(4)].map((_, i) => (
                <div key={i} style={{
                    height: '140px', borderRadius: '20px',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    animation: 'shimmer 1.5s ease infinite',
                    backgroundSize: '200% 100%',
                    backgroundImage: 'linear-gradient(90deg, var(--bg-card) 25%, rgba(255,255,255,0.05) 50%, var(--bg-card) 75%)'
                }} />
            ))}
            <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
        </div>
    );

    const getChange = (key) => {
        if (!prevStats || !prevStats[key]) return null;
        return stats[key] - prevStats[key];
    };

    const cards = [
        { label: 'Total Sessions', value: stats.totalSessions, icon: Users, color: '#8b5cf6', gradient: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(139,92,246,0.03))', border: 'rgba(139,92,246,0.2)', changeKey: 'totalSessions', sparkColor: '#8b5cf6' },
        { label: 'Total Clicks', value: stats.totalClicks, icon: MousePointerClick, color: '#3b82f6', gradient: 'linear-gradient(135deg, rgba(59,130,246,0.12), rgba(59,130,246,0.03))', border: 'rgba(59,130,246,0.2)', changeKey: 'totalClicks', sparkColor: '#3b82f6' },
        { label: 'Avg Clicks/Session', value: stats.avgClicksPerSession, icon: TrendingUp, color: '#10b981', gradient: 'linear-gradient(135deg, rgba(16,185,129,0.12), rgba(16,185,129,0.03))', border: 'rgba(16,185,129,0.2)', changeKey: 'avgClicksPerSession', sparkColor: '#10b981' },
        { label: 'Most Clicked Page', value: stats.mostClickedPage, icon: MapPin, color: '#f59e0b', gradient: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(245,158,11,0.03))', border: 'rgba(245,158,11,0.2)', isText: true }
    ];

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {cards.map((card, i) => {
                const change = !card.isText ? getChange(card.changeKey) : null;
                return (
                    <MetricCard key={i} card={card} change={change} pulse={pulse} />
                );
            })}
        </div>
    );
}

function MetricCard({ card, change, pulse }) {
    const [hovered, setHovered] = useState(false);
    const IconComp = card.icon;

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered ? card.gradient : 'var(--bg-card)',
                backdropFilter: 'blur(20px)',
                padding: '1.5rem',
                borderRadius: '20px',
                border: `1px solid ${hovered ? card.border : 'var(--border)'}`,
                boxShadow: hovered ? `0 12px 32px rgba(0,0,0,0.4), 0 0 40px ${card.color}10` : '0 4px 16px rgba(0,0,0,0.2)',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'default'
            }}
        >
            {/* Animated corner gradient */}
            <div style={{
                position: 'absolute', top: 0, right: 0,
                width: '80px', height: '80px',
                background: `radial-gradient(circle at 100% 0%, ${card.color}15, transparent 70%)`,
                pointerEvents: 'none'
            }} />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', position: 'relative', zIndex: 1 }}>
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    fontSize: '0.78rem', fontWeight: '600',
                    color: 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em'
                }}>
                    {card.label}
                </div>
                <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: `${card.color}15`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    border: `1px solid ${card.color}25`,
                    transition: 'all 0.3s',
                    transform: hovered ? 'rotate(8deg) scale(1.1)' : 'rotate(0) scale(1)'
                }}>
                    <IconComp size={16} color={card.color} />
                </div>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{
                    fontSize: card.isText ? '1.3rem' : '2.2rem',
                    fontWeight: '800',
                    margin: '0 0 0.5rem 0',
                    color: card.color,
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    transition: 'transform 0.3s',
                    transform: pulse && !card.isText ? 'scale(1.03)' : 'scale(1)'
                }}>
                    {card.isText ? card.value : <AnimatedValue value={card.value} />}
                </p>

                {/* Change indicator */}
                {change !== null && change !== 0 && (
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '8px',
                        background: change > 0 ? 'rgba(16,185,129,0.1)' : 'rgba(248,81,73,0.1)',
                        border: `1px solid ${change > 0 ? 'rgba(16,185,129,0.2)' : 'rgba(248,81,73,0.2)'}`,
                        fontSize: '0.7rem', fontWeight: '600',
                        color: change > 0 ? '#10b981' : '#f85149',
                        animation: 'fadeInUp 0.4s ease-out'
                    }}>
                        {change > 0 ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
                        {change > 0 ? `+${change}` : change}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes fadeInUp {
                    from { opacity: 0; transform: translateY(6px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}
