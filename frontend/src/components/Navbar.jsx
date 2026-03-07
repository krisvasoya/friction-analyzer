import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    Home, 
    LayoutDashboard, 
    Sparkles, 
    Zap, 
    CreditCard, 
    Info, 
    MessageSquare 
} from 'lucide-react';

export default function Navbar() {
    const location = useLocation();

    return (
        <aside className="sidebar" style={{
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            width: '260px',
            background: 'rgba(10, 10, 15, 0.6)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '2rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 1000
        }}>
            {/* Logo Section */}
            <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', gap: '1rem', paddingLeft: '0.5rem' }}>
                <div style={{ 
                    width: '40px', 
                    height: '40px', 
                    background: 'linear-gradient(135deg, #06b6d4 0%, #4ade80 100%)', 
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#000',
                    fontWeight: '800',
                    fontSize: '1.2rem',
                    boxShadow: '0 0 15px rgba(6, 182, 212, 0.3)'
                }}>F</div>
                <div>
                    <div style={{ fontWeight: '700', fontSize: '1.2rem', color: '#fff', letterSpacing: '-0.5px' }}>
                        FrictionApp
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                        Analytics Suite v2.0
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
                <SectionLabel>platform</SectionLabel>
                <NavLink to="/" icon={<Home size={20} />} label="Home" active={location.pathname === '/'} />
                <NavLink to="/dashboard" icon={<LayoutDashboard size={20} />} label="Dashboard" active={location.pathname === '/dashboard'} />
                
                <SectionLabel>explore</SectionLabel>
                <NavLink to="/features" icon={<Sparkles size={20} />} label="Features" active={location.pathname.startsWith('/features')} />
                <NavLink to="/services" icon={<Zap size={20} />} label="Services" active={location.pathname === '/services'} />
                <NavLink to="/pricing" icon={<CreditCard size={20} />} label="Pricing" active={location.pathname === '/pricing'} />
                
                <SectionLabel>support</SectionLabel>
                <NavLink to="/details" icon={<Info size={20} />} label="Details" active={location.pathname === '/details'} />
                <NavLink to="/form" icon={<MessageSquare size={20} />} label="Contact" active={location.pathname === '/form'} />
            </nav>

            {/* System Identity Footer */}
            <div style={{ 
                marginTop: 'auto', 
                padding: '1rem', 
                background: 'rgba(255,255,255,0.03)', 
                borderRadius: '12px', 
                fontSize: '0.8rem',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
            }}>
                <div style={{ 
                    width: '8px', 
                    height: '8px', 
                    background: '#4ade80', 
                    borderRadius: '50%', 
                    boxShadow: '0 0 10px #4ade80' 
                }}></div>
                <div>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>System Status</p>
                    <p style={{ fontWeight: '600', color: '#fff' }}>Operational • 07-X</p>
                </div>
            </div>
        </aside>
    );
}

function SectionLabel({ children }) {
    return (
        <div style={{ 
            fontSize: '0.7rem', 
            textTransform: 'uppercase', 
            color: 'var(--text-secondary)', 
            fontWeight: '600', 
            letterSpacing: '1px',
            margin: '1rem 0 0.5rem 0.75rem',
            opacity: 0.7
        }}>
            {children}
        </div>
    );
}

function NavLink({ to, icon, label, active }) {
    return (
        <Link to={to} style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '1rem', 
            padding: '0.8rem 1rem', 
            textDecoration: 'none', 
            color: active ? '#fff' : 'var(--text-secondary)',
            background: active ? 'linear-gradient(90deg, rgba(6, 182, 212, 0.15) 0%, rgba(6, 182, 212, 0) 100%)' : 'transparent',
            borderRadius: '12px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            fontSize: '0.95rem',
            fontWeight: active ? '600' : '400',
            borderLeft: active ? '3px solid #06b6d4' : '3px solid transparent',
            position: 'relative',
            overflow: 'hidden'
        }}
        onMouseOver={(e) => {
            if (!active) {
                e.currentTarget.style.color = '#fff';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.transform = 'translateX(4px)';
            }
        }}
        onMouseOut={(e) => {
            if (!active) {
                e.currentTarget.style.color = 'var(--text-secondary)';
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateX(0)';
            }
        }}
        >
            <span style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                color: active ? '#06b6d4' : 'inherit'
            }}>{icon}</span>
            <span>{label}</span>
            {active && (
                <div style={{
                    position: 'absolute',
                    right: '1rem',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: '#06b6d4'
                }} />
            )}
        </Link>
    );
}
