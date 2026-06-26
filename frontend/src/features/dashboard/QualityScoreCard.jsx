import React, { useEffect, useState } from 'react';

export default function QualityScoreCard({ score }) {
    const [animated, setAnimated] = useState(false);
    
    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const r = 55;
    const circ = Math.PI * r; // Semi-circle circumference
    const pct = Math.min(Math.max(score / 100, 0), 1);
    const strokeDashoffset = circ - (pct * circ);

    return (
        <div style={{ padding: '1.5rem', borderRadius: '12px', textAlign: 'center', position: 'relative' }}>
            <h3 style={{ color: '#94a3b8', fontSize: '0.8rem', marginBottom: '1.5rem', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Session Quality Score
            </h3>
            <div style={{ position: 'relative', height: '100px', display: 'flex', justifyContent: 'center' }}>
                <svg viewBox="0 0 120 70" width="180" height="100">
                    {/* Track */}
                    <path 
                        d="M 10 60 A 50 50 0 0 1 110 60" 
                        fill="none" 
                        stroke="rgba(255,255,255,0.05)" 
                        strokeWidth="10" 
                        strokeLinecap="round" 
                    />
                    {/* Progress */}
                    <path 
                        d="M 10 60 A 50 50 0 0 1 110 60" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="10" 
                        strokeLinecap="round" 
                        strokeDasharray={circ}
                        strokeDashoffset={animated ? strokeDashoffset : circ}
                        style={{ 
                            transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)',
                            filter: 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.3))'
                        }}
                    />
                </svg>
                <div style={{ 
                    position: 'absolute', bottom: '10%', left: '50%', transform: 'translateX(-50%)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center'
                }}>
                    <span style={{ fontSize: '2.5rem', fontWeight: '800', color: '#fff' }}>
                        {Math.round(score)}
                    </span>
                    <span style={{ fontSize: '0.6rem', color: '#64748b', fontWeight: '600' }}>PERCENT</span>
                </div>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.75rem', marginTop: '1rem', lineHeight: '1.4' }}>
                Reflects the overall smoothness of user completion and friction density.
            </p>
        </div>
    );
}

