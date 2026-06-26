import { useEffect, useState, useRef, useMemo } from 'react';
import { PieChart, Activity } from 'lucide-react';
import { API_BASE } from '../../lib/api';

export default function ClickDistributionGraphs() {
    const [data, setData] = useState({ pie: [], line: [] });
    const [animated, setAnimated] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${API_BASE}/dashboard/charts`);
                const json = await res.json();
                setData(json);
                setTimeout(() => setAnimated(true), 200);
            } catch (e) { console.error(e); }
        };
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <DonutCard data={data.pie} animated={animated} />
            <SparklineCard data={data.line} animated={animated} />
        </div>
    );
}

// ─── INTERACTIVE DONUT CHART ─────────────────────────
const DONUT_COLORS = ['#00f2ea', '#8b5cf6', '#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#06b6d4'];

function DonutCard({ data, animated }) {
    const [hoveredIndex, setHoveredIndex] = useState(-1);

    const safeData = useMemo(() => (data && data.length > 0 ? data : []), [data]);
    const total = safeData.reduce((s, d) => s + d.count, 0) || 1;
    const cx = 90, cy = 90, outerR = 70, innerR = 45;

    // Build segments with accumulated angles
    const segments = useMemo(() => {
        const segs = [];
        let angle = -90;
        safeData.forEach((d, i) => {
            const pct = d.count / total;
            const sliceAngle = pct * 360;
            segs.push({ ...d, startAngle: angle, angle: sliceAngle, pct, color: DONUT_COLORS[i % DONUT_COLORS.length] });
            angle += sliceAngle;
        });
        return segs;
    }, [safeData, total]);

    if (safeData.length === 0) return null;

    return (
        <div style={{
            background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '20px',
            border: '1px solid var(--border)', position: 'relative', overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)',
                backgroundSize: '24px 24px', pointerEvents: 'none'
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.2rem', position: 'relative', zIndex: 1 }}>
                <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: 'rgba(0,242,234,0.1)', border: '1px solid rgba(0,242,234,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <PieChart size={14} color="#00f2ea" />
                </div>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    Clicks per Page
                </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1.5rem', minHeight: '200px', position: 'relative', zIndex: 1 }}>
                {/* SVG Donut */}
                <div style={{ position: 'relative', width: '180px', height: '180px', flexShrink: 0 }}>
                    <svg viewBox="0 0 180 180" width="180" height="180">
                        {/* Track */}
                        <circle cx={cx} cy={cy} r={(outerR + innerR) / 2} fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth={outerR - innerR} />

                        {/* Segments */}
                        {segments.map((seg, i) => {
                            const r = (outerR + innerR) / 2;
                            const c = 2 * Math.PI * r;
                            const dashLen = (seg.pct) * c;
                            const dashGap = c - dashLen;
                            let offset = 0;
                            for (let j = 0; j < i; j++) offset += segments[j].pct * c;

                            return (
                                <circle
                                    key={i}
                                    cx={cx} cy={cy} r={r}
                                    fill="none"
                                    stroke={seg.color}
                                    strokeWidth={hoveredIndex === i ? outerR - innerR + 6 : outerR - innerR}
                                    strokeDasharray={animated ? `${dashLen} ${dashGap}` : `0 ${c}`}
                                    strokeDashoffset={-offset}
                                    strokeLinecap="butt"
                                    style={{
                                        transform: 'rotate(-90deg)',
                                        transformOrigin: '90px 90px',
                                        transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                                        filter: hoveredIndex === i ? `drop-shadow(0 0 10px ${seg.color}60)` : 'none',
                                        cursor: 'pointer'
                                    }}
                                    onMouseEnter={() => setHoveredIndex(i)}
                                    onMouseLeave={() => setHoveredIndex(-1)}
                                />
                            );
                        })}
                    </svg>

                    {/* Center text */}
                    <div style={{
                        position: 'absolute', inset: 0,
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        <span style={{
                            fontSize: hoveredIndex >= 0 ? '1.6rem' : '1.8rem',
                            fontWeight: '800',
                            color: hoveredIndex >= 0 ? segments[hoveredIndex]?.color : '#00f2ea',
                            transition: 'all 0.3s',
                            lineHeight: 1
                        }}>
                            {hoveredIndex >= 0 ? `${Math.round(segments[hoveredIndex].pct * 100)}%` : total}
                        </span>
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.2rem', fontWeight: '500' }}>
                            {hoveredIndex >= 0 ? segments[hoveredIndex].page_url : 'TOTAL CLICKS'}
                        </span>
                    </div>
                </div>

                {/* Legend */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    {segments.slice(0, 6).map((seg, i) => (
                        <div
                            key={i}
                            onMouseEnter={() => setHoveredIndex(i)}
                            onMouseLeave={() => setHoveredIndex(-1)}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '0.5rem',
                                padding: '0.3rem 0.5rem',
                                borderRadius: '8px',
                                background: hoveredIndex === i ? `${seg.color}12` : 'transparent',
                                transition: 'background 0.2s',
                                cursor: 'pointer'
                            }}
                        >
                            <div style={{
                                width: '8px', height: '8px', borderRadius: '3px',
                                background: seg.color, flexShrink: 0,
                                boxShadow: hoveredIndex === i ? `0 0 8px ${seg.color}60` : 'none'
                            }} />
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                                {seg.page_url}
                            </span>
                            <span style={{ fontSize: '0.72rem', color: seg.color, fontWeight: '700', marginLeft: 'auto' }}>
                                {seg.count}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// ─── ANIMATED LINE / AREA CHART ─────────────────────
function SparklineCard({ data, animated }) {
    const [hoveredPoint, setHoveredPoint] = useState(-1);
    const svgRef = useRef(null);

    if (!data || data.length === 0) return null;

    const W = 400, H = 200, padX = 30, padY = 20;
    const chartW = W - padX * 2, chartH = H - padY * 2;
    const values = data.map(d => d.count);
    const maxVal = Math.max(...values, 1);
    const minVal = Math.min(...values, 0);

    const points = values.map((v, i) => ({
        x: padX + (i / Math.max(values.length - 1, 1)) * chartW,
        y: padY + chartH - ((v - minVal) / (maxVal - minVal || 1)) * chartH,
        value: v,
        label: `Sess ${data[i].session_id?.substring(0, 4) || i + 1}`
    }));

    const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    const areaPath = `${linePath} L ${points[points.length - 1].x} ${padY + chartH} L ${points[0].x} ${padY + chartH} Z`;

    const handleMouseMove = (e) => {
        const svg = svgRef.current;
        if (!svg) return;
        const rect = svg.getBoundingClientRect();
        const mouseX = ((e.clientX - rect.left) / rect.width) * W;
        let closest = 0;
        let minDist = Infinity;
        points.forEach((p, i) => {
            const dist = Math.abs(p.x - mouseX);
            if (dist < minDist) { minDist = dist; closest = i; }
        });
        setHoveredPoint(closest);
    };

    return (
        <div style={{
            background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '20px',
            border: '1px solid var(--border)', position: 'relative', overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.02) 1px, transparent 0)',
                backgroundSize: '24px 24px', pointerEvents: 'none'
            }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', position: 'relative', zIndex: 1 }}>
                <div style={{
                    width: '32px', height: '32px', borderRadius: '8px',
                    background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <Activity size={14} color="#8b5cf6" />
                </div>
                <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: 'var(--text-primary)' }}>
                    Session Activity
                </h3>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <svg
                    ref={svgRef}
                    viewBox={`0 0 ${W} ${H}`}
                    style={{ width: '100%', height: '220px', cursor: 'crosshair' }}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={() => setHoveredPoint(-1)}
                >
                    {/* Grid lines */}
                    {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => (
                        <g key={i}>
                            <line
                                x1={padX} y1={padY + chartH * (1 - frac)}
                                x2={padX + chartW} y2={padY + chartH * (1 - frac)}
                                stroke="rgba(255,255,255,0.04)" strokeWidth="1"
                            />
                            <text x={padX - 5} y={padY + chartH * (1 - frac) + 3}
                                fill="rgba(148,163,184,0.5)" fontSize="8" textAnchor="end">
                                {Math.round(minVal + (maxVal - minVal) * frac)}
                            </text>
                        </g>
                    ))}

                    {/* Gradient defs */}
                    <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.25" />
                            <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#8b5cf6" />
                            <stop offset="50%" stopColor="#00f2ea" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                    </defs>

                    {/* Area fill */}
                    <path
                        d={areaPath}
                        fill="url(#areaGrad)"
                        opacity={animated ? 1 : 0}
                        style={{ transition: 'opacity 1s ease' }}
                    />

                    {/* Line */}
                    <path
                        d={linePath}
                        fill="none"
                        stroke="url(#lineGrad)"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray={animated ? 'none' : '2000'}
                        strokeDashoffset={animated ? '0' : '2000'}
                        style={{ transition: 'stroke-dashoffset 2s ease' }}
                    />

                    {/* Hover vertical line */}
                    {hoveredPoint >= 0 && (
                        <line
                            x1={points[hoveredPoint].x} y1={padY}
                            x2={points[hoveredPoint].x} y2={padY + chartH}
                            stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="4 4"
                        />
                    )}

                    {/* Data points */}
                    {points.map((p, i) => (
                        <g key={i}>
                            {/* Glow ring */}
                            {hoveredPoint === i && (
                                <circle cx={p.x} cy={p.y} r="12" fill="none" stroke="#8b5cf640" strokeWidth="2">
                                    <animate attributeName="r" values="8;14;8" dur="1.5s" repeatCount="indefinite" />
                                </circle>
                            )}
                            <circle
                                cx={p.x} cy={p.y}
                                r={hoveredPoint === i ? 5 : 3}
                                fill={hoveredPoint === i ? '#00f2ea' : '#8b5cf6'}
                                stroke="var(--bg-card)"
                                strokeWidth="2"
                                style={{ transition: 'r 0.2s, fill 0.2s' }}
                            />
                        </g>
                    ))}

                    {/* Hover tooltip */}
                    {hoveredPoint >= 0 && (
                        <g>
                            <rect
                                x={Math.min(points[hoveredPoint].x - 30, W - 65)}
                                y={points[hoveredPoint].y - 35}
                                width="60" height="24" rx="6"
                                fill="rgba(15,23,42,0.95)"
                                stroke="rgba(139,92,246,0.3)"
                            />
                            <text
                                x={Math.min(points[hoveredPoint].x, W - 35)}
                                y={points[hoveredPoint].y - 19}
                                fill="#8b5cf6" fontSize="10" fontWeight="700" textAnchor="middle"
                            >
                                {points[hoveredPoint].value} clicks
                            </text>
                        </g>
                    )}
                </svg>
            </div>
        </div>
    );
}

