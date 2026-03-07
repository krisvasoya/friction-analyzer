import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HelpCircle, X, Info } from 'lucide-react';

export default function AutoHelpWidget() {
    const [isVisible, setIsVisible] = useState(false);
    const [struggleCount, setStruggleCount] = useState(0);
    const [isSnoozed, setIsSnoozed] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleStruggle = (e) => {
            // Listen for custom struggle events or track dead clicks locally
            if (e.detail?.type === 'dead_click' || e.detail?.type === 'rage_click') {
                setStruggleCount(prev => prev + 1);
            }
        };

        window.addEventListener('friction-event', handleStruggle);
        
        // Also listen for rapid consecutive clicks (potential rage)
        let lastClickTime = 0;
        let clickGapCount = 0;
        
        const monitorClicks = () => {
            const now = Date.now();
            if (now - lastClickTime < 300) {
                clickGapCount++;
                if (clickGapCount > 4) {
                    setStruggleCount(prev => prev + 1);
                    clickGapCount = 0;
                }
            } else {
                clickGapCount = 0;
            }
            lastClickTime = now;
        };

        window.addEventListener('click', monitorClicks);

        return () => {
            window.removeEventListener('friction-event', handleStruggle);
            window.removeEventListener('click', monitorClicks);
        };
    }, []);

    useEffect(() => {
        if (struggleCount >= 3 && !isVisible && !isSnoozed) {
            setIsVisible(true);
            // Auto hide after 10 seconds if no action
            setTimeout(() => setIsVisible(false), 10000);
        }
    }, [struggleCount, isVisible, isSnoozed]);

    if (!isVisible) return null;

    return (
        <div 
            onClick={(e) => e.stopPropagation()}
            style={{
                position: 'fixed',
                bottom: '2rem',
                right: '2rem',
                width: '320px',
                background: 'rgba(15, 23, 42, 0.9)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(0, 242, 234, 0.4)',
                borderRadius: '24px',
                padding: '1.75rem',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 20px rgba(0, 242, 234, 0.1)',
                zIndex: 10000,
                animation: 'premiumSlideIn 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards',
                color: '#fff',
                cursor: 'default'
            }}
        >
            <style>{`
                @keyframes premiumSlideIn {
                    from { transform: translateY(50px) scale(0.95); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
            `}</style>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ 
                    width: '44px', 
                    height: '44px', 
                    background: 'linear-gradient(135deg, #00f2ea, #7928ca)', 
                    borderRadius: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    boxShadow: '0 8px 16px rgba(0, 242, 234, 0.3)'
                }}><HelpCircle size={24} /></div>
                <div style={{ flex: 1 }}>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', letterSpacing: '-0.02em' }}>Quick Assist</h4>
                    <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8' }}>Friction detected</p>
                </div>
                <button 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        setIsVisible(false);
                        setStruggleCount(0);
                    }}
                    style={{ 
                        background: 'rgba(255,255,255,0.05)', 
                        border: 'none', 
                        color: '#94a3b8', 
                        cursor: 'pointer',
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                    onMouseOut={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                ><X size={16} /></button>
            </div>

            <p style={{ fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem', color: '#e2e8f0' }}>
                It seems like some elements aren't responding as expected. Would you like a quick walkthrough of this page?
            </p>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        navigate('/details'); // Navigate to help/details
                        setIsVisible(false); 
                        setStruggleCount(0);
                    }}
                    style={{
                        flex: 1.5,
                        padding: '0.75rem',
                        borderRadius: '12px',
                        border: 'none',
                        background: 'linear-gradient(90deg, #00f2ea, #00d4ff)',
                        color: '#010816',
                        fontWeight: '700',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        transition: 'transform 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
                    onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
                >View Guide</button>
                <button 
                    onClick={(e) => { 
                        e.stopPropagation(); 
                        setIsVisible(false); 
                        setIsSnoozed(true); // Snooze for this session
                        setTimeout(() => setIsSnoozed(false), 300000); // 5 min cooldown
                        setStruggleCount(0);
                    }}
                    style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.05)',
                        color: '#fff',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >Dismiss</button>
            </div>
        </div>
    );
}
