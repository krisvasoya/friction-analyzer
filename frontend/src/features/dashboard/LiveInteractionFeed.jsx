import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Activity, MousePointerClick, Eye, AlertTriangle, Navigation, Timer, Zap } from 'lucide-react';

const EVENT_CONFIG = {
    click:              { icon: MousePointerClick, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)',  label: 'Click' },
    page_view:          { icon: Eye,               color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)',  label: 'Page View' },
    rage_click:         { icon: AlertTriangle,     color: '#ef4444', bg: 'rgba(239,68,68,0.1)',   label: 'Rage Click' },
    dead_click:         { icon: MousePointerClick, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',  label: 'Dead Click' },
    micro_hesitation:   { icon: Timer,             color: '#f97316', bg: 'rgba(249,115,22,0.1)',  label: 'Hesitation' },
    intent_mismatch:    { icon: Navigation,        color: '#ec4899', bg: 'rgba(236,72,153,0.1)',  label: 'Mismatch' },
    scroll_depth:       { icon: Activity,          color: '#06b6d4', bg: 'rgba(6,182,212,0.1)',   label: 'Scroll' },
    default:            { icon: Zap,               color: '#10b981', bg: 'rgba(16,185,129,0.1)',  label: 'Event' }
};

function getConfig(type) {
    return EVENT_CONFIG[type] || EVENT_CONFIG.default;
}

function timeAgo(ts) {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 5) return 'just now';
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
}

export default function LiveInteractionFeed() {
    const [events, setEvents] = useState([]);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        const fetchFeed = async () => {
            try {
                const data = await api.getLiveFeed();
                setEvents(data);
            } catch (e) {
                console.error('Live feed error:', e);
            }
        };

        fetchFeed();

        // Listen for new interactions in real-time
        const unsubscribe = api.onNewInteraction((newEvent) => {
            setEvents(prev => [newEvent, ...prev].slice(0, 50));
        });

        return () => unsubscribe();
    }, []);

    const filteredEvents = filter === 'all' 
        ? events 
        : events.filter(e => e.event_type === filter);

    const filterOptions = ['all', 'click', 'page_view', 'rage_click', 'dead_click', 'micro_hesitation'];

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                flexWrap: 'wrap', gap: '1rem'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        background: '#22c55e',
                        boxShadow: '0 0 10px #22c55e',
                        animation: 'livePulse 2s ease-in-out infinite'
                    }} />
                    <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: '700' }}>
                        Live Interaction Feed
                    </h2>
                    <span style={{
                        fontSize: '0.8rem', color: 'var(--text-secondary)',
                        background: 'var(--bg-card)', padding: '0.25rem 0.75rem',
                        borderRadius: '20px', border: '1px solid var(--border)'
                    }}>
                        {events.length} events
                    </span>
                </div>

                {/* Filter Pills */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {filterOptions.map(opt => {
                        const cfg = opt === 'all' ? { color: 'var(--primary)', label: 'All' } : getConfig(opt);
                        return (
                            <button
                                key={opt}
                                onClick={() => setFilter(opt)}
                                style={{
                                    padding: '0.35rem 0.85rem',
                                    borderRadius: '20px',
                                    border: filter === opt ? `1px solid ${cfg.color}` : '1px solid var(--border)',
                                    background: filter === opt ? `${cfg.color}20` : 'transparent',
                                    color: filter === opt ? cfg.color : 'var(--text-secondary)',
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    textTransform: 'capitalize',
                                    transition: 'all 0.2s',
                                    width: 'auto'
                                }}
                            >
                                {cfg.label || opt}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Event Stream */}
            <div style={{
                maxHeight: '600px', overflowY: 'auto',
                display: 'flex', flexDirection: 'column', gap: '0.5rem',
                padding: '0.5rem'
            }}>
                {filteredEvents.length === 0 ? (
                    <div style={{
                        textAlign: 'center', padding: '3rem',
                        color: 'var(--text-secondary)', fontSize: '0.95rem'
                    }}>
                        <Activity size={32} color="var(--text-secondary)" style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>No events to display. Interact with the site to generate events.</p>
                    </div>
                ) : (
                    filteredEvents.map((event, idx) => {
                        const cfg = getConfig(event.event_type);
                        const Icon = cfg.icon;
                        return (
                            <div
                                key={event.id || idx}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '1rem',
                                    padding: '0.85rem 1.2rem',
                                    background: 'var(--bg-card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: '12px',
                                    transition: 'all 0.3s',
                                    animation: idx < 3 ? 'feedSlideIn 0.4s ease-out' : 'none',
                                    cursor: 'default'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = cfg.color + '60';
                                    e.currentTarget.style.boxShadow = `0 4px 20px ${cfg.color}15`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'var(--border)';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                {/* Icon */}
                                <div style={{
                                    width: '36px', height: '36px', borderRadius: '10px',
                                    background: cfg.bg, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    flexShrink: 0
                                }}>
                                    <Icon size={16} color={cfg.color} />
                                </div>

                                {/* Content */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                                        <span style={{
                                            fontSize: '0.7rem', fontWeight: '700',
                                            padding: '0.15rem 0.5rem', borderRadius: '6px',
                                            background: cfg.bg, color: cfg.color,
                                            textTransform: 'uppercase', letterSpacing: '0.05em'
                                        }}>
                                            {cfg.label}
                                        </span>
                                        <span style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: '500' }}>
                                            {event.page_url || '/unknown'}
                                        </span>
                                    </div>
                                    <div style={{
                                        fontSize: '0.75rem', color: 'var(--text-secondary)',
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                                    }}>
                                        {event.target_element || 'page interaction'}
                                    </div>
                                </div>

                                {/* Session + Time */}
                                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                    <div style={{
                                        fontSize: '0.7rem', color: 'var(--text-secondary)',
                                        fontFamily: 'monospace'
                                    }}>
                                        {event.session_id ? event.session_id.substring(0, 8) + '...' : '—'}
                                    </div>
                                    <div style={{ fontSize: '0.72rem', color: cfg.color, fontWeight: '600' }}>
                                        {timeAgo(event.timestamp)}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            <style>{`
                @keyframes livePulse {
                    0%, 100% { opacity: 1; transform: scale(1); }
                    50% { opacity: 0.5; transform: scale(1.2); }
                }
                @keyframes feedSlideIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

