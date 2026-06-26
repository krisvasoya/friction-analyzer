import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

export default function Signup({ sessionId, onAuthSuccess }) {
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
                if (onAuthSuccess) onAuthSuccess(); // Refresh session ID
                navigate('/'); // Land on home page
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
            background: 'var(--bg-dark)',
            padding: '2rem'
        }}>
            <div className="card card-hover animate-fade-in" style={{ 
                maxWidth: '480px',
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
                    }}>⚡</div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.75rem', letterSpacing: '-0.04em' }}>Create Account</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem' }}>Join the next generation of UX optimization.</p>
                </div>
                
                <form onSubmit={handleSignup}>
                    <div className="input-group">
                        <label>Full Name</label>
                        <input 
                            name="fullName" 
                            type="text" 
                            required 
                            value={formData.fullName} 
                            onChange={handleChange} 
                            placeholder="John Doe" 
                        />
                    </div>
                    <div className="input-group">
                        <label>Email Address</label>
                        <input 
                            name="email" 
                            type="email" 
                            required 
                            value={formData.email} 
                            onChange={handleChange} 
                            placeholder="john@example.com" 
                        />
                    </div>
                    <div className="input-group">
                        <label>Password</label>
                        <input 
                            name="password" 
                            type="password" 
                            required 
                            value={formData.password} 
                            onChange={handleChange} 
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
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0', gap: '1rem' }}>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Continue with</span>
                    <div style={{ flex: 1, height: '1px', background: 'var(--border)' }}></div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                    <SocialButton icon="🌐" onClick={() => handleSocialSignup('google')} label="Google" />
                    <SocialButton icon="🐙" onClick={() => handleSocialSignup('github')} label="GitHub" />
                </div>

                <p style={{ textAlign: 'center', marginTop: '2.5rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>Log In</Link>
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

