import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { featuresData } from './featuresData';

export default function FeatureDetail() {
    const { id } = useParams();
    // const navigate = useNavigate();
    const feature = featuresData.find(f => f.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!feature) {
        return (
            <div style={{ padding: '8rem 2rem', textAlign: 'center', color: '#fff', minHeight: '100vh', background: 'var(--bg-dark)' }}>
                <h1>Feature not found</h1>
                <Link to="/features" style={{ color: 'var(--primary)', marginTop: '20px', display: 'inline-block' }}>Back to Features</Link>
            </div>
        );
    }

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', color: '#fff' }}>
            {/* Hero Section */}
            <div style={{ 
                padding: '8rem 2rem 4rem', 
                background: 'radial-gradient(circle at 50% 20%, rgba(6, 182, 212, 0.15) 0%, rgba(0,0,0,0) 50%)',
                textAlign: 'center' 
            }}>
                <div style={{ 
                    fontSize: '5rem', 
                    marginBottom: '2rem',
                    animation: 'float 6s ease-in-out infinite'
                }}>
                    {feature.icon}
                </div>
                <h1 style={{ 
                    fontSize: '4rem', 
                    fontWeight: '800', 
                    marginBottom: '1.5rem',
                    background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    {feature.title}
                </h1>
                <p style={{ 
                    fontSize: '1.5rem', 
                    color: 'var(--text-secondary)', 
                    maxWidth: '800px', 
                    margin: '0 auto 3rem', 
                    lineHeight: '1.6' 
                }}>
                    {feature.description}
                </p>
                <Link 
                    to="/signup"
                    style={{
                        display: 'inline-block',
                        padding: '1rem 2.5rem',
                        background: 'linear-gradient(135deg, var(--primary) 0%, #0891b2 100%)',
                        color: '#000',
                        fontWeight: 'bold',
                        borderRadius: '50px',
                        textDecoration: 'none',
                        fontSize: '1.1rem',
                        boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
                        transition: 'transform 0.2s',
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
                >
                    Start Using {feature.title}
                </Link>
            </div>

            {/* Content Section */}
            <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 2rem 6rem' }}>
                
                {/* How It Works */}
                <div style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    borderRadius: '24px', 
                    padding: '3rem', 
                    marginBottom: '3rem',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--primary)' }}>How It Works</h2>
                    <p style={{ fontSize: '1.2rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                        {feature.howItWorks}
                    </p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                    {/* Deep Dive */}
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Deep Dive</h2>
                        <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
                            {feature.fullDescription}
                        </p>
                    </div>

                    {/* Benefits */}
                    <div>
                        <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Key Benefits</h2>
                        <ul style={{ listStyle: 'none', padding: 0 }}>
                            {feature.benefits.map((benefit, index) => (
                                <li key={index} style={{ 
                                    marginBottom: '1rem', 
                                    display: 'flex', 
                                    alignItems: 'start', 
                                    gap: '1rem',
                                    fontSize: '1.1rem',
                                    color: 'var(--text-secondary)'
                                }}>
                                    <span style={{ color: 'var(--primary)' }}>✓</span>
                                    {benefit}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

            </div>
            
            <style>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                    100% { transform: translateY(0px); }
                }
            `}</style>
        </div>
    );
}
