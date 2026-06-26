import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Pricing() {
    const gridRef = useRef(null);
    const headerRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(headerRef.current.children, {
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out"
            });

            gsap.from(".pricing-card", {
                scrollTrigger: {
                    trigger: gridRef.current,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out"
            });
        });
        return () => ctx.revert();
    }, []);

    const plans = [
        {
            name: 'Starter',
            price: '$0',
            period: '/month',
            description: 'Perfect for small projects and individual developers.',
            features: ['5,000 Events/month', 'Basic Heatmaps', '7-day Data Retention', 'Community Support'],
            cta: 'Get Started',
            highlight: false
        },
        {
            name: 'Pro',
            price: '$49',
            period: '/month',
            description: 'Advanced analytics for growing businesses.',
            features: ['100,000 Events/month', 'Friction Scoring', 'Session Replay (30 days)', 'Priority Support', 'Funnel Analysis'],
            cta: 'Start Free Trial',
            highlight: true
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            period: '',
            description: 'Full-scale behavioral intelligence for large teams.',
            features: ['Unlimited Events', 'Self-Hosted Option', 'SSO & Audit Logs', 'Dedicated Success Manager', 'Raw Data Export'],
            cta: 'Contact Sales',
            highlight: false
        }
    ];

    return (
        <div style={{ padding: '8rem 2rem 4rem', minHeight: '100vh', background: 'var(--bg-dark)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                <h1 ref={headerRef} style={{ 
                    fontSize: '3.5rem', 
                    fontWeight: '800', 
                    marginBottom: '1rem',
                    background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                }}>
                   Transparent Pricing
                </h1>
                <p style={{ 
                    color: 'var(--text-secondary)', 
                    fontSize: '1.2rem', 
                    maxWidth: '600px', 
                    margin: '0 auto 4rem'
                }}>
                    Choose the plan that fits your growth. No hidden fees.
                </p>

                <div ref={gridRef} style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                    gap: '2rem',
                    perspective: '1000px'
                }}>
                    {plans.map((plan, index) => (
                        <div key={index} className="pricing-card" style={{
                            background: 'rgba(255, 255, 255, 0.03)',
                            border: plan.highlight ? '1px solid var(--primary)' : '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '20px',
                            padding: '3rem 2rem',
                            textAlign: 'left',
                            position: 'relative',
                            overflow: 'hidden',
                            transition: `all 0.6s ease-out`,
                            boxShadow: plan.highlight ? '0 0 40px rgba(6, 182, 212, 0.15)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-10px)';
                            e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = plan.highlight ? '0 0 40px rgba(6, 182, 212, 0.15)' : 'none';
                        }}
                        >
                            {plan.highlight && (
                                <div style={{
                                    position: 'absolute',
                                    top: '20px',
                                    right: '20px',
                                    background: 'var(--primary)',
                                    color: '#000',
                                    padding: '0.25rem 0.75rem',
                                    borderRadius: '20px',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    boxShadow: '0 0 20px var(--primary)'
                                }}>
                                    RECOMMENDED
                                </div>
                            )}

                            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: '#fff' }}>{plan.name}</h3>
                            <div style={{ display: 'flex', alignItems: 'baseline', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '3rem', fontWeight: '800', color: '#fff' }}>{plan.price}</span>
                                <span style={{ color: 'var(--text-secondary)', marginLeft: '0.5rem' }}>{plan.period}</span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', height: '3rem' }}>{plan.description}</p>

                            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '2.5rem' }}>
                                {plan.features.map((feature, i) => (
                                    <li key={i} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', color: '#cbd5e1' }}>
                                        <Check size={18} color="var(--primary)" style={{ marginRight: '0.75rem', flexShrink: 0 }} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: '12px',
                                background: plan.highlight ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                                color: plan.highlight ? '#000' : '#fff',
                                border: 'none',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                cursor: 'pointer',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.02)';
                                if (!plan.highlight) e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                if (!plan.highlight) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                            }}
                            >
                                {plan.cta}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

