import { useState } from 'react';
import { api } from '../api';
import { Palette } from 'lucide-react';

export default function ABSimulator() {
    const [element, setElement] = useState('Checkout Button');
    const [adjustment, setAdjustment] = useState('center');
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);

    const runSim = async () => {
        setLoading(true);
        try {
            const data = await api.getABSimulation(element, adjustment);
            setPrediction(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="card" style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Palette size={18} color="var(--primary)" /> A/B Predictor (What-If?)
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                    <select 
                        value={element}
                        onChange={(e) => setElement(e.target.value)}
                        style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff' }}
                    >
                        <option value="Checkout Button">Checkout Button</option>
                        <option value="Signup Form">Signup Form</option>
                        <option value="Nav Bar">Nav Bar</option>
                    </select>
                    <select 
                        value={adjustment}
                        onChange={(e) => setAdjustment(e.target.value)}
                        style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)', color: '#fff' }}
                    >
                        <option value="center">Move to Center</option>
                        <option value="larger">Increase Size</option>
                        <option value="blue">Change to Blue</option>
                    </select>
                </div>
                
                <button 
                    onClick={runSim} 
                    disabled={loading}
                    style={{ 
                        padding: '0.75rem', 
                        borderRadius: '8px', 
                        background: 'var(--primary)', 
                        color: '#000', 
                        border: 'none', 
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Simulating...' : 'Predict Impact'}
                </button>

                {prediction && (
                    <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(0, 242, 234, 0.05)', borderRadius: '12px', border: '1px solid rgba(0, 242, 234, 0.2)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Friction Improvement</span>
                            <span style={{ color: prediction.improvement.includes('-') ? '#ef4444' : '#10b981', fontWeight: 'bold' }}>{prediction.improvement}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', margin: 0 }}>
                            <strong>Analysis:</strong> {prediction.recommendation}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
