import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Globe } from 'lucide-react';

export default function GeoFrictionMap() {
    const [geoData, setGeoData] = useState([]);

    useEffect(() => {
        api.getGeoDistribution().then(setGeoData);
    }, []);

    return (
        <div className="card" style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Globe size={18} color="var(--primary)" /> Global Friction Heatmap
            </h3>
            <div style={{ height: '300px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {/* Simulated Map Visual */}
                <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'radial-gradient(var(--primary) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                
                <div style={{ width: '80%', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
                    {geoData.map(d => (
                        <div key={d.country} style={{ textAlign: 'center' }}>
                            <div style={{ 
                                width: Math.max(40, d.count * 10), 
                                height: Math.max(40, d.count * 10), 
                                borderRadius: '50%', 
                                background: d.avg_friction > 50 ? 'rgba(239, 68, 68, 0.4)' : 'rgba(16, 185, 129, 0.4)',
                                border: `1px solid ${d.avg_friction > 50 ? '#ef4444' : '#10b981'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                position: 'relative'
                            }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{Math.round(d.avg_friction)}</span>
                            </div>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{d.country}</div>
                        </div>
                    ))}
                    {geoData.length === 0 && <p style={{ color: 'var(--text-secondary)' }}>Analyzing global traffic patterns...</p>}
                </div>
            </div>
        </div>
    );
}

