import { useEffect, useState } from 'react';
import { api } from '../api';
import { MapPin, Globe } from 'lucide-react';

export default function LiveUserFeed() {
    const [sessions, setSessions] = useState([]);

    useEffect(() => {
        const fetchSessions = () => {
            api.getLiveSessions().then(setSessions);
        };
        fetchSessions();
        const interval = setInterval(fetchSessions, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="card" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)' }}>
            <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--text-primary)' }}>Live Interaction Feed</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontSize: '0.75rem' }}>
                    <div className="pulse" style={{ width: '8px', height: '8px', background: 'var(--primary)', borderRadius: '50%' }}></div>
                    LIVE
                </div>
            </div>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)', fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            <th style={{ padding: '1rem 1.25rem' }}>Session / User</th>
                            <th style={{ padding: '1rem' }}>Location</th>
                            <th style={{ padding: '1rem' }}>Device</th>
                            <th style={{ padding: '1rem' }}>Current Page</th>
                            <th style={{ padding: '1rem' }}>Last Action</th>
                            <th style={{ padding: '1rem' }}>Time Spent</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map(s => (
                            <tr key={s.id} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.85rem', transition: 'background 0.2s', cursor: 'default' }}>
                                <td style={{ padding: '1rem 1.25rem' }}>
                                    <div style={{ fontWeight: '600', color: 'var(--text-primary)' }}>{s.id.slice(0, 8)}...</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{new Date(s.start_time).toLocaleTimeString()}</div>
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <MapPin size={14} style={{ verticalAlign: 'middle', marginRight: '0.3rem', color: 'var(--primary)' }} /> {s.country}
                                </td>
                                <td style={{ padding: '1rem' }}>
                                    <div style={{ fontSize: '0.8rem' }}>{s.device_type}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{s.browser}</div>
                                </td>
                                <td style={{ padding: '1rem', color: 'var(--primary)' }}>{s.current_page || 'Landing'}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{ padding: '0.2rem 0.6rem', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', fontSize: '0.75rem' }}>
                                        {s.last_element || 'None'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>{s.duration_on_page}s</td>
                            </tr>
                        ))}
                        {sessions.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>No active sessions detected</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
            <style>{`
                .pulse { animation: pulseAnim 1.5s infinite; }
                @keyframes pulseAnim {
                    0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 242, 234, 0.7); }
                    70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(0, 242, 234, 0); }
                    100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(0, 242, 234, 0); }
                }
            `}</style>
        </div>
    );
}
