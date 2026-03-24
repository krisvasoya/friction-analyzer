import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../api';

export default function Login({ sessionId, onAuthSuccess }) {
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
                if (onAuthSuccess) onAuthSuccess(); // Refresh session ID
                navigate('/');
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
            background: 'var(--bg-dark)',
            padding: '2rem'
        }}>
            <div className="card card-hover animate-fade-in" style={{ 
                maxWidth: '450px',
                width: '100%',
                padding: '3rem', 
                border: '1px solid var(--border)', 
                borderRadius: '32px',
            }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        width: '64px', 
                        height: '64px', 
                        background: 'linear-gradient(135deg, var(--primary), var(--accent))', 
                        borderRadius: '18px',
                        marginBottom: '1.5rem',
                        fontSize: '2rem',
                        boxShadow: '0 10px 20px var(--primary-glow)'
                    }}>🔑</div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '-0.04em' }}>Welcome Back</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>Sign in to continue your optimization.</p>
                </div>
                
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input 
                            name="email" 
                            type="email" 
                            required 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="john@example.com" 
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            name="password" 
                            type="password" 
                            required 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="••••••••" 
                        />
                    </div>

                    {error && (
                        <div className="error animate-fade-in">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading} 
                        style={{ 
                            marginTop: '1rem',
                            boxShadow: '0 10px 20px var(--primary-glow)',
                        }}
                    >
                        {loading ? 'Signing In...' : 'Log In'}
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', gap: '1rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Continue with</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <SocialButton icon="🌐" onClick={() => handleSocialLogin('google')} label="Google" />
                    <SocialButton icon="🐙" onClick={() => handleSocialLogin('github')} label="GitHub" />
                </div>

                <p style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
}

function SocialButton({ icon, onClick, label }) {
    return (
        <button 
            type="button"
            onClick={onClick}
            className="secondary"
            style={{ padding: '0.75rem' }}
            title={label}
        >
            <span style={{ fontSize: '1.2rem' }}>{icon}</span>
        </button>
    );
}
