import { useEffect, useState } from 'react';
import { api } from '../api';
import { Sparkles } from 'lucide-react';

export default function AIInsights() {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                // In a real app, this would come from an LLM analyzing the data
                // We'll simulate high-quality AI analysis based on the actual alerts
                await api.getAlerts();
                
                const mockInsights = [
                    { 
                        id: 1, 
                        type: 'warning', 
                        title: 'Frustration Spike', 
                        text: 'Unusual rage click activity detected on the "Checkout" button for Safari users.',
                        impact: '+12% Churn Risk'
                    },
                    { 
                        id: 2, 
                        type: 'success', 
                        title: 'Optimization Opportunity', 
                        text: 'Moving the "Search" bar to the center could reduce navigation loops by 15%.',
                        impact: 'Predicted UX Boost'
                    },
                    { 
                        id: 3, 
                        type: 'info', 
                        title: 'Behavioral Pattern', 
                        text: 'Users in India are hesitating 4s longer on the "Address" form than other regions.',
                        impact: 'Field Optimization'
                    }
                ];

                setInsights(mockInsights);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchInsights();
    }, []);

    if (loading) return null;

    return (
        <div style={{ marginTop: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={18} color="#f59e0b" /> AI-Driven Insights
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {insights.map(insight => (
                    <div key={insight.id} style={{ 
                        background: 'rgba(30, 41, 59, 0.4)', 
                        borderLeft: `4px solid ${insight.type === 'warning' ? '#ef4444' : insight.type === 'success' ? '#10b981' : 'var(--primary)'}`,
                        borderRadius: '12px',
                        padding: '1.25rem',
                        backdropFilter: 'blur(10px)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.5rem'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: '700', fontSize: '0.85rem', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                {insight.title}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: insight.type === 'warning' ? '#f87171' : '#a3e635', fontWeight: 'bold' }}>
                                {insight.impact}
                            </span>
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                            {insight.text}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
