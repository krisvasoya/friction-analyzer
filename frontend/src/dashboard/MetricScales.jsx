import React from 'react';

export default function MetricScales({ drift, expectation, density }) {
    const renderScale = (label, value, max, color) => (
        <div style={{ marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{label}</span>
                <span style={{ color: '#fff', fontSize: '0.8rem', fontWeight: 'bold' }}>{value.toFixed(1)}</span>
            </div>
            <div style={{ width: '100%', background: '#334155', height: '6px', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${Math.min(100, (value / max) * 100)}%`, background: color, height: '100%' }}></div>
            </div>
        </div>
    );

    return (
        <div style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '12px' }}>
            <h3 style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>BEHAVIORAL METRICS</h3>
            
            {renderScale('Attention Drift (Lower is better)', drift, 10, '#f59e0b')}
            {renderScale('Entry Expectation (Higher is better)', expectation, 20, '#3b82f6')}
            {renderScale('Interaction Density (Higher is better)', density, 2, '#8b5cf6')}
            
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Insight</div>
                <div style={{ color: '#fff', fontSize: '0.85rem' }}>
                    {drift > 5 ? 'High drift detected: Users are getting distracted.' : 'Focus is good.'}
                </div>
            </div>
        </div>
    );
}
