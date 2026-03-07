import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Signup({ sessionId }) {
    const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        api.track(sessionId, 'page_view', '/signup');
    }, [sessionId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const res = await api.register(formData.email, formData.password, formData.fullName);
            if (res.error) {
                setError(res.error);
                api.track(sessionId, 'error', 'signup-error', { error: res.error });
            } else {
                api.track(sessionId, 'click', 'signup-success');
                navigate('/login');
            }
        } catch (err) {
            console.error('Signup error:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialSignup = async (provider) => {
        try {
            const res = await api.socialLogin(provider);
            if (res.user) {
                api.track(sessionId, 'click', `social-signup-${provider}`);
                navigate('/home');
            }
        } catch (err) {
            console.error(`${provider} signup error:`, err);
            setError(`${provider} signup failed.`);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)',
            padding: '2rem'
        }}>
            <div className="card" style={{ 
                maxWidth: '480px',
                width: '100%',
                padding: '3rem', 
                background: 'rgba(30, 41, 59, 0.4)', 
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.08)', 
                borderRadius: '32px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        width: '64px', 
                        height: '64px', 
                        background: 'linear-gradient(135deg, #00f2ea, #7928ca)', 
                        borderRadius: '18px',
                        marginBottom: '1.5rem',
                        fontSize: '2rem',
                        boxShadow: '0 10px 20px rgba(0, 242, 234, 0.2)'
                    }}>⚡</div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '-0.04em' }}>Create Account</h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.05rem' }}>Join the next generation of UX optimization.</p>
                </div>
                
                <form onSubmit={handleSignup}>
                    <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#cbd5e1' }}>Full Name</label>
                        <input 
                            name="fullName" 
                            type="text" 
                            required 
                            value={formData.fullName} 
                            onChange={handleChange} 
                            placeholder="John Doe" 
                            style={{ 
                                width: '100%',
                                padding: '0.875rem 1.25rem',
                                background: 'rgba(15, 23, 42, 0.5)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '14px',
                                color: '#fff',
                                fontSize: '1rem',
                                transition: 'all 0.3s'
                            }}
                        />
                    </div>
                    <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#cbd5e1' }}>Email Address</label>
                        <input 
                            name="email" 
                            type="email" 
                            required 
                            value={formData.email} 
                            onChange={handleChange} 
                            placeholder="john@example.com" 
                            style={{ 
                                width: '100%',
                                padding: '0.875rem 1.25rem',
                                background: 'rgba(15, 23, 42, 0.5)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '14px',
                                color: '#fff',
                                fontSize: '1rem'
                            }}
                        />
                    </div>
                    <div className="input-group" style={{ marginBottom: '1.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#cbd5e1' }}>Password</label>
                        <input 
                            name="password" 
                            type="password" 
                            required 
                            value={formData.password} 
                            onChange={handleChange} 
                            placeholder="••••••••" 
                            style={{ 
                                width: '100%',
                                padding: '0.875rem 1.25rem',
                                background: 'rgba(15, 23, 42, 0.5)',
                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                borderRadius: '14px',
                                color: '#fff',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    {error && (
                        <div style={{ 
                            background: 'rgba(239, 68, 68, 0.1)', 
                            border: '1px solid rgba(239, 68, 68, 0.2)', 
                            color: '#fca5a5', 
                            padding: '0.75rem 1rem', 
                            borderRadius: '12px', 
                            marginBottom: '1.5rem',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem'
                        }}>
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading} 
                        style={{ 
                            width: '100%', 
                            padding: '1rem',
                            borderRadius: '16px',
                            border: 'none',
                            background: 'linear-gradient(90deg, #00f2ea, #7928ca)',
                            color: '#fff',
                            fontWeight: '700',
                            fontSize: '1.1rem',
                            cursor: 'pointer',
                            boxShadow: '0 10px 20px rgba(0, 242, 234, 0.2)',
                            transition: 'all 0.3s'
                        }}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', gap: '1rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }}></div>
                    <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>Continue with</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }}></div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <SocialButton icon="🌐" onClick={() => handleSocialSignup('google')} label="Google" />
                    <SocialButton icon="🐙" onClick={() => handleSocialSignup('github')} label="GitHub" />
                </div>

                <p style={{ textAlign: 'center', marginTop: '2.5rem', color: '#94a3b8', fontSize: '0.95rem' }}>
                    Already have an account? <Link to="/login" style={{ color: '#00f2ea', fontWeight: '700', textDecoration: 'none' }}>Log In</Link>
                </p>
            </div>
        </div>
    );
}

function SocialButton({ icon, onClick, label }) {
    return (
        <button 
            onClick={onClick}
            style={{ 
                flex: 1, 
                padding: '0.75rem', 
                background: 'rgba(255,255,255,0.05)', 
                border: '1px solid var(--border)', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                fontSize: '0.9rem',
                cursor: 'pointer',
                color: 'var(--text-primary)'
            }}
            title={label}
        >
            <span style={{ fontSize: '1.2rem' }}>{icon}</span>
        </button>
    );
}
