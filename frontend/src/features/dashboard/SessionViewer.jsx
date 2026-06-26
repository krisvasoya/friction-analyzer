import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { Clock, Monitor, Globe, Activity, Layout, MousePointer2, LogIn, Navigation, ArrowRight, X, Calendar } from 'lucide-react';

export default function SessionViewer() {
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [detailsLoading, setDetailsLoading] = useState(false);

    useEffect(() => {
        const fetchSessions = async () => {
            try {
                const data = await api.getSessionsList();
                setSessions(data);
                setLoading(false);
            } catch (err) {
                console.error('Error fetching sessions:', err);
                setLoading(false);
            }
        };
        fetchSessions();
    }, []);

    const handleSessionClick = async (session) => {
        setSelectedSession(session);
        setDetailsLoading(true);
        try {
            const eventData = await api.getSessionEvents(session.id);
            setEvents(eventData);
            setDetailsLoading(false);
        } catch (err) {
            console.error('Error fetching session events:', err);
            setDetailsLoading(false);
        }
    };

    if (loading) return <div style={{ color: '#94a3b8', padding: '2rem' }}>Loading Session Intel...</div>;

    return (
        <div style={{ display: 'grid', gridTemplateColumns: selectedSession ? '1fr 1.5fr' : '1fr', gap: '1.5rem', transition: 'all 0.4s ease' }}>
            
            {/* ═══ SESSIONS LIST ═══ */}
            <div className="card" style={cardStyle}>
                <div style={headerStyle}>
                    <Activity size={18} color="var(--primary)" />
                    <h3 style={titleStyle}>User Sessions</h3>
                </div>
                
                <div style={tableWrapperStyle}>
                    <table style={tableStyle}>
                        <thead>
                            <tr>
                                <th style={thStyle}>Session ID</th>
                                <th style={thStyle}>Time</th>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}>Score</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sessions.map((s) => (
                                <tr 
                                    key={s.id} 
                                    onClick={() => handleSessionClick(s)}
                                    style={{ 
                                        ...trStyle, 
                                        background: selectedSession?.id === s.id ? 'rgba(0, 242, 234, 0.05)' : 'transparent',
                                        borderLeft: selectedSession?.id === s.id ? '2px solid var(--primary)' : '2px solid transparent'
                                    }}
                                >
                                    <td style={{ ...tdStyle, color: 'var(--primary)', fontWeight: '700' }}>
                                        {s.id.substring(0, 8)}...
                                    </td>
                                    <td style={tdStyle}>{new Date(s.start_time).toLocaleTimeString()}</td>
                                    <td style={tdStyle}>
                                        <span style={{ 
                                            padding: '0.2rem 0.5rem', borderRadius: '6px', fontSize: '0.65rem',
                                            background: s.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                                            color: s.status === 'completed' ? '#10b981' : '#f59e0b'
                                        }}>
                                            {s.status}
                                        </span>
                                    </td>
                                    <td style={{ ...tdStyle, fontWeight: '800' }}>{Math.round(s.total_friction_score || 0)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ═══ SESSION TIMELINE ═══ */}
            {selectedSession && (
                <div className="card" style={{ ...cardStyle, animation: 'slideIn 0.4s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
                                <Calendar size={12} />
                                <span>{new Date(selectedSession.start_time).toLocaleDateString()}</span>
                                <span>•</span>
                                <Monitor size={12} />
                                <span>{selectedSession.browser} ({selectedSession.device_type})</span>
                                <span>•</span>
                                <Globe size={12} />
                                <span>{selectedSession.country}</span>
                            </div>
                            <h2 style={{ fontSize: '1.2rem', fontWeight: '800', margin: 0 }}>Session Details</h2>
                        </div>
                        <button onClick={() => setSelectedSession(null)} style={closeBtnStyle}><X size={18} /></button>
                    </div>

                    {detailsLoading ? (
                        <div style={{ color: '#64748b', textAlign: 'center', padding: '4rem' }}>Reconstructing User Journey...</div>
                    ) : (
                        <div style={timelineContainerStyle}>
                            {events.length === 0 ? (
                                <div style={{ textAlign: 'center', color: '#64748b', padding: '2rem' }}>No events recorded for this session</div>
                            ) : (
                                <div style={timelineStyle}>
                                    {events.map((event, idx) => {
                                        const isPage = event.event_type === 'page_view' || event.event_type === 'navigation';
                                        return (
                                            <div key={idx} style={timelineItemStyle}>
                                                <div style={timeLineLineStyle} />
                                                <div style={{ 
                                                    ...dotStyle, 
                                                    background: isPage ? 'var(--primary)' : (event.event_type.includes('click') ? '#a855f7' : '#94a3b8'),
                                                    boxShadow: `0 0 10px ${isPage ? 'rgba(0, 242, 234, 0.3)' : 'rgba(168, 85, 247, 0.2)'}`
                                                }}>
                                                    {isPage ? <Layout size={10} color="#fff" /> : <MousePointer2 size={10} color="#fff" />}
                                                </div>
                                                <div style={eventCardStyle}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                                                        <span style={eventTypeStyle}>{event.event_type.replace('_', ' ').toUpperCase()}</span>
                                                        <span style={eventTimeStyle}>{new Date(event.timestamp).toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })}</span>
                                                    </div>
                                                    <div style={eventActionStyle}>
                                                        {isPage ? (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                                                                <Navigation size={12} />
                                                                <span>Visited <strong>{event.page_url}</strong></span>
                                                            </div>
                                                        ) : (
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <ArrowRight size={12} color="#64748b" />
                                                                <span>Click on <strong>{event.target_element || 'unknown element'}</strong></span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            <style>{`
                @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
                table { border-collapse: collapse; width: 100%; }
            `}</style>
        </div>
    );
}

// Styles
const cardStyle = {
    background: 'var(--bg-card)',
    padding: '1.5rem',
    borderRadius: '20px',
    border: '1px solid var(--border)',
    backdropFilter: 'blur(20px)',
};

const headerStyle = { display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' };
const titleStyle = { margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' };

const tableWrapperStyle = { maxHeight: '600px', overflowY: 'auto' };
const tableStyle = { width: '100%', fontSize: '0.8rem' };
const thStyle = { textAlign: 'left', padding: '1rem 0.75rem', color: '#64748b', borderBottom: '1px solid var(--border)', fontWeight: '600' };
const trStyle = { cursor: 'pointer', transition: 'all 0.2s', borderBottom: '1px solid rgba(255,255,255,0.02)' };
const tdStyle = { padding: '1rem 0.75rem', color: 'var(--text-primary)' };

const closeBtnStyle = { 
    background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', 
    padding: '0.5rem', borderRadius: '8px', transition: 'all 0.2s' 
};

const timelineContainerStyle = { maxHeight: '600px', overflowY: 'auto', paddingRight: '1rem' };
const timelineStyle = { display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' };

const timelineItemStyle = { display: 'flex', gap: '1.5rem', position: 'relative', paddingBottom: '1.5rem' };
const timeLineLineStyle = { 
    position: 'absolute', left: '11px', top: '24px', bottom: 0, width: '2px', 
    background: 'linear-gradient(to bottom, var(--border) 0%, transparent 100%)' 
};

const dotStyle = { 
    width: '24px', height: '24px', borderRadius: '50%', flexShrink: 0, zIndex: 1,
    display: 'flex', alignItems: 'center', justifyContent: 'center' 
};

const eventCardStyle = { 
    flex: 1, background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', 
    border: '1px solid rgba(255,255,255,0.03)' 
};

const eventTypeStyle = { fontSize: '0.6rem', color: '#64748b', fontWeight: '700', letterSpacing: '0.5px' };
const eventTimeStyle = { fontSize: '0.65rem', color: '#475569' };
const eventActionStyle = { fontSize: '0.85rem' };

