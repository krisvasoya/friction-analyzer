import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Login({ sessionId }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        api.track(sessionId, 'page_view', '/login');
    }, [sessionId]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const res = await api.login(email, password);
            if (res.error) {
                setError(res.error);
                api.track(sessionId, 'error', 'login-error', { error: res.error });
            } else {
                api.track(sessionId, 'click', 'login-success');
                navigate('/home');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = async (provider) => {
        try {
            const res = await api.socialLogin(provider);
            if (res.user) {
                api.track(sessionId, 'click', `social-login-${provider}`);
                navigate('/home');
            }
        } catch (err) {
            console.error(`${provider} login error:`, err);
            setError(`${provider} login failed.`);
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
                maxWidth: '450px',
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
                    }}>🔑</div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '-0.04em' }}>Welcome Back</h1>
                    <p style={{ color: '#94a3b8', fontSize: '1.05rem' }}>Sign in to continue your optimization.</p>
                </div>
                
                <form onSubmit={handleLogin}>
                    <div className="input-group" style={{ marginBottom: '1.25rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: '600', color: '#cbd5e1' }}>Email Address</label>
                        <input 
                            name="email" 
                            type="email" 
                            required 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
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
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
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
                        {loading ? 'Signing In...' : 'Log In'}
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', gap: '1rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }}></div>
                    <span style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: '700', textTransform: 'uppercase' }}>Continue with</span>
                    <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.08)' }}></div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <SocialButton icon="🌐" onClick={() => handleSocialLogin('google')} label="Google" />
                    <SocialButton icon="🐙" onClick={() => handleSocialLogin('github')} label="GitHub" />
                </div>

                <p style={{ textAlign: 'center', marginTop: '2.5rem', color: '#94a3b8', fontSize: '0.95rem' }}>
                    Don't have an account? <Link to="/signup" style={{ color: '#00f2ea', fontWeight: '700', textDecoration: 'none' }}>Sign Up</Link>
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
