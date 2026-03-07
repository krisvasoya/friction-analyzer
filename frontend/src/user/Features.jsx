import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { featuresData } from './featuresData';


export default function Features() {
    const [visibleItems, setVisibleItems] = useState(new Set());
    const observer = useRef(null);

    useEffect(() => {
        observer.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = parseInt(entry.target.getAttribute('data-index'));
                    setVisibleItems(prev => new Set(prev).add(index));
                }
            });
        }, { threshold: 0.1 });

        const cards = document.querySelectorAll('.feature-card');
        cards.forEach(card => observer.current.observe(card));

        return () => observer.current.disconnect();
    }, []);

    return (
        <div style={{ padding: '8rem 2rem 4rem', minHeight: '100vh', background: 'var(--bg-dark)' }}>
             <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ textAlign: 'center', marginBottom: '6rem' }}>
                    <h1 style={{ 
                        fontSize: '3.5rem', 
                        fontWeight: '800', 
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, #4ade80 0%, #06b6d4 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}>
                       Powerful Features
                    </h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '700px', margin: '0 auto' }}>
                        Everything you need to build frictionless digital experiences.
                    </p>
                </div>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
                    gap: '2rem' 
                }}>
                    {featuresData.map((feature, index) => (
                        <Link 
                            to={`/features/${feature.id}`}
                            key={feature.id}
                            className="feature-card"
                            data-index={index}
                            style={{
                                display: 'block',
                                textDecoration: 'none',
                                background: 'rgba(255, 255, 255, 0.03)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: '16px',
                                padding: '2.5rem',
                                opacity: visibleItems.has(index) ? 1 : 0,
                                transform: visibleItems.has(index) ? 'translateY(0)' : 'translateY(50px)',
                                transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
                                transitionDelay: `${index * 50}ms`,
                                cursor: 'pointer'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-5px)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                                e.currentTarget.style.borderColor = 'var(--primary)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                            }}
                        >
                            <div style={{ 
                                fontSize: '3rem', 
                                marginBottom: '1.5rem',
                                background: 'rgba(6, 182, 212, 0.1)',
                                width: '80px',
                                height: '80px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: '50%'
                            }}>
                                {feature.icon}
                            </div>
                            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#fff' }}>{feature.title}</h3>
                            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>{feature.description}</p>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
