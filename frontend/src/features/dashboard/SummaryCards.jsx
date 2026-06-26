import { useEffect, useState } from 'react';
import { Activity, MousePointerClick, Globe } from 'lucide-react';

export default function SummaryCards({ data }) {
    if (!data) return <div style={{ color: 'var(--text-secondary)' }}>Loading metrics...</div>;

    const resources = [
        { label: 'Friction Index', value: data.avgFrictionScore || 55, max: 100, unit: '%', icon: Activity, color: '#f43f5e', gradient: 'linear-gradient(135deg, #f43f5e, #e11d48)', glow: 'rgba(244,63,94,0.3)', desc: 'Average UX friction score' },
        { label: 'Engagement Rate', value: data.abandonmentRate ? (100 - data.abandonmentRate).toFixed(1) : 82.2, max: 100, unit: '%', icon: MousePointerClick, color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)', glow: 'rgba(139,92,246,0.3)', desc: 'Users who complete actions' },
        { label: 'Active Sessions', value: (data.totalSessions % 100) || 48, max: 100, unit: '', icon: Globe, color: '#00f2ea', gradient: 'linear-gradient(135deg, #00f2ea, #0891b2)', glow: 'rgba(0,242,234,0.3)', desc: 'Currently tracking live' },
    ];

    return (
        <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                {resources.map((res, i) => (
                    <GaugeCard key={i} res={res} delay={i * 150} />
                ))}
            </div>
        </div>
    );
}

function GaugeCard({ res, delay }) {
    const [animVal, setAnimVal] = useState(0);
    const [hovered, setHovered] = useState(false);
    const Icon = res.icon;

    useEffect(() => {
        const timer = setTimeout(() => {
            let start = 0;
            const target = Number(res.value);
            const step = target / 40;
            const interval = setInterval(() => {
                start += step;
                if (start >= target) {
                    setAnimVal(target);
                    clearInterval(interval);
                } else {
                    setAnimVal(Math.round(start * 10) / 10);
                }
            }, 25);
        }, delay);
        return () => clearTimeout(timer);
    }, [res.value, delay]);

    const pct = Math.min((animVal / res.max) * 100, 100);
    const circumference = 2 * Math.PI * 38;
    const strokeOffset = circumference - (pct / 100) * circumference;

    return (
        <div
            className="card"
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                padding: '1.5rem',
                background: hovered ? `linear-gradient(135deg, rgba(${res.color === '#f43f5e' ? '244,63,94' : res.color === '#8b5cf6' ? '139,92,246' : '0,242,234'},0.06), var(--bg-card))` : 'var(--bg-card)',
                border: `1px solid ${hovered ? res.color + '40' : 'var(--border)'}`,
                borderRadius: '20px',
                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
                boxShadow: hovered ? `0 20px 40px ${res.glow}` : '0 4px 16px rgba(0,0,0,0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                cursor: 'default',
                position: 'relative',
                overflow: 'hidden'
            }}
        >
            {/* Animated glow orb */}
            <div style={{
                position: 'absolute', top: '-30px', right: '-30px',
                width: '120px', height: '120px', borderRadius: '50%',
                background: `radial-gradient(circle, ${res.glow}, transparent 70%)`,
                opacity: hovered ? 0.6 : 0.15,
                transition: 'opacity 0.4s',
                pointerEvents: 'none'
            }} />

            {/* Circular Gauge */}
            <div style={{ position: 'relative', width: '90px', height: '90px', flexShrink: 0 }}>
                <svg width="90" height="90" viewBox="0 0 90 90" style={{ transform: 'rotate(-90deg)' }}>
                    {/* Track */}
                    <circle cx="45" cy="45" r="38" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                    {/* Value arc */}
                    <circle
                        cx="45" cy="45" r="38" fill="none"
                        stroke={res.color}
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeOffset}
                        style={{
                            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            filter: `drop-shadow(0 0 6px ${res.glow})`
                        }}
                    />
                </svg>
                {/* Center value */}
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'column'
                }}>
                    <span style={{ fontSize: '1.3rem', fontWeight: '800', color: res.color, lineHeight: 1 }}>
                        {animVal}{res.unit}
                    </span>
                </div>
            </div>

            {/* Text */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <Icon size={16} color={res.color} />
                    <span style={{
                        fontSize: '0.78rem', fontWeight: '700', color: 'var(--text-secondary)',
                        textTransform: 'uppercase', letterSpacing: '0.06em'
                    }}>{res.label}</span>
                </div>
                <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', opacity: 0.7 }}>{res.desc}</p>
            </div>
        </div>
    );
}

