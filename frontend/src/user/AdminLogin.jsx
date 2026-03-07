import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, Lock, User, AlertTriangle } from 'lucide-react';

const ADMIN_ID = 'admin';
const ADMIN_PASSWORD = 'admin@123';

export default function AdminLogin() {
    const [adminId, setAdminId] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [shake, setShake] = useState(false);
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        setTimeout(() => {
            if (adminId === ADMIN_ID && password === ADMIN_PASSWORD) {
                sessionStorage.setItem('isAdmin', 'true');
                navigate('/dashboard');
            } else {
                setError('Invalid admin credentials. Access denied.');
                setShake(true);
                setTimeout(() => setShake(false), 600);
            }
            setLoading(false);
        }, 800);
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(ellipse at 20% 50%, rgba(0, 242, 234, 0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(121, 40, 202, 0.06) 0%, transparent 50%), #020617',
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated Background Grid */}
            <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(rgba(0, 242, 234, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 242, 234, 0.03) 1px, transparent 1px)',
                backgroundSize: '60px 60px',
                animation: 'gridFloat 20s linear infinite'
            }} />

            {/* Floating Orbs */}
            {[...Array(5)].map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    width: `${60 + i * 40}px`,
                    height: `${60 + i * 40}px`,
                    borderRadius: '50%',
                    background: `radial-gradient(circle, ${i % 2 === 0 ? 'rgba(0,242,234,0.1)' : 'rgba(121,40,202,0.1)'}, transparent 70%)`,
                    top: `${10 + i * 18}%`,
                    left: `${5 + i * 20}%`,
                    animation: `orbFloat ${6 + i * 2}s ease-in-out infinite alternate`,
                    pointerEvents: 'none'
                }} />
            ))}

            <div className={shake ? 'admin-shake' : ''} style={{
                maxWidth: '440px',
                width: '100%',
                padding: '3rem',
                background: 'rgba(15, 23, 42, 0.6)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(0, 242, 234, 0.15)',
                borderRadius: '28px',
                boxShadow: '0 30px 60px rgba(0, 0, 0, 0.5), 0 0 80px rgba(0, 242, 234, 0.05)',
                position: 'relative',
                zIndex: 1
            }}>
                {/* Shield Icon */}
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '80px',
                        height: '80px',
                        background: 'linear-gradient(135deg, rgba(0, 242, 234, 0.15), rgba(121, 40, 202, 0.15))',
                        borderRadius: '24px',
                        marginBottom: '1.5rem',
                        border: '1px solid rgba(0, 242, 234, 0.2)',
                        boxShadow: '0 0 40px rgba(0, 242, 234, 0.1)',
                        animation: 'shieldPulse 3s ease-in-out infinite'
                    }}>
                        <Shield size={36} color="#00f2ea" />
                    </div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '800',
                        marginBottom: '0.5rem',
                        letterSpacing: '-0.03em',
                        background: 'linear-gradient(135deg, #fff, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>Admin Access</h1>
                    <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
                        Restricted area. Authorized personnel only.
                    </p>
                </div>

                <form onSubmit={handleLogin}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            marginBottom: '0.6rem', fontSize: '0.85rem', fontWeight: '600',
                            color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em'
                        }}>
                            <User size={14} /> Admin ID
                        </label>
                        <input
                            type="text"
                            value={adminId}
                            onChange={(e) => setAdminId(e.target.value)}
                            placeholder="Enter admin ID"
                            required
                            style={{
                                width: '100%',
                                padding: '0.9rem 1.2rem',
                                background: 'rgba(2, 6, 23, 0.6)',
                                border: '1px solid rgba(0, 242, 234, 0.1)',
                                borderRadius: '14px',
                                color: '#e2e8f0',
                                fontSize: '1rem',
                                transition: 'all 0.3s',
                                outline: 'none'
                            }}
                            onFocus={(e) => {
                                e.target.style.borderColor = 'rgba(0, 242, 234, 0.4)';
                                e.target.style.boxShadow = '0 0 20px rgba(0, 242, 234, 0.08)';
                            }}
                            onBlur={(e) => {
                                e.target.style.borderColor = 'rgba(0, 242, 234, 0.1)';
                                e.target.style.boxShadow = 'none';
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            marginBottom: '0.6rem', fontSize: '0.85rem', fontWeight: '600',
                            color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.08em'
                        }}>
                            <Lock size={14} /> Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="••••••••"
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.9rem 3rem 0.9rem 1.2rem',
                                    background: 'rgba(2, 6, 23, 0.6)',
                                    border: '1px solid rgba(0, 242, 234, 0.1)',
                                    borderRadius: '14px',
                                    color: '#e2e8f0',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s',
                                    outline: 'none'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = 'rgba(0, 242, 234, 0.4)';
                                    e.target.style.boxShadow = '0 0 20px rgba(0, 242, 234, 0.08)';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = 'rgba(0, 242, 234, 0.1)';
                                    e.target.style.boxShadow = 'none';
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{
                                    position: 'absolute', right: '12px', top: '50%',
                                    transform: 'translateY(-50%)',
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    padding: '4px', color: '#64748b', width: 'auto'
                                }}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '0.6rem',
                            padding: '0.8rem 1rem',
                            background: 'rgba(248, 81, 73, 0.1)',
                            border: '1px solid rgba(248, 81, 73, 0.2)',
                            borderRadius: '12px',
                            marginBottom: '1.5rem',
                            color: '#fca5a5',
                            fontSize: '0.9rem'
                        }}>
                            <AlertTriangle size={16} />
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: '14px',
                            border: 'none',
                            background: loading
                                ? 'rgba(100, 116, 139, 0.3)'
                                : 'linear-gradient(135deg, #00f2ea, #7928ca)',
                            color: loading ? '#94a3b8' : '#fff',
                            fontWeight: '700',
                            fontSize: '1.05rem',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s',
                            boxShadow: loading ? 'none' : '0 10px 30px rgba(0, 242, 234, 0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem'
                        }}
                    >
                        {loading ? (
                            <>
                                <div style={{
                                    width: '18px', height: '18px',
                                    border: '2px solid rgba(148, 163, 184, 0.3)',
                                    borderTopColor: '#94a3b8',
                                    borderRadius: '50%',
                                    animation: 'spin 0.8s linear infinite'
                                }} />
                                Verifying...
                            </>
                        ) : (
                            <>
                                <Shield size={18} />
                                Access Dashboard
                            </>
                        )}
                    </button>
                </form>

                <div style={{
                    marginTop: '2rem', textAlign: 'center',
                    padding: '1rem',
                    background: 'rgba(0, 242, 234, 0.03)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0, 242, 234, 0.06)'
                }}>
                    <p style={{ color: '#475569', fontSize: '0.8rem', margin: 0 }}>
                        🔒 This is a secure admin portal. All access attempts are logged.
                    </p>
                </div>
            </div>

            {/* CSS Animations */}
            <style>{`
                @keyframes gridFloat {
                    0% { transform: translate(0, 0); }
                    100% { transform: translate(60px, 60px); }
                }
                @keyframes orbFloat {
                    0% { transform: translate(0, 0) scale(1); }
                    100% { transform: translate(30px, -20px) scale(1.1); }
                }
                @keyframes shieldPulse {
                    0%, 100% { box-shadow: 0 0 40px rgba(0, 242, 234, 0.1); }
                    50% { box-shadow: 0 0 60px rgba(0, 242, 234, 0.2); }
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
                .admin-shake {
                    animation: shakeIt 0.6s ease-in-out;
                }
                @keyframes shakeIt {
                    0%, 100% { transform: translateX(0); }
                    10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
                    20%, 40%, 60%, 80% { transform: translateX(8px); }
                }
            `}</style>
        </div>
    );
}
