import { useEffect, useState } from 'react';
import { api } from '../api';
import { Accessibility, AlertTriangle } from 'lucide-react';

export default function AccessibilityAuditor() {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        api.getAccessibilityReport().then(setReports);
    }, []);

    return (
        <div className="card" style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Accessibility size={18} color="var(--primary)" /> Accessibility Watchdog
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {reports.map((r, i) => (
                    <div key={i} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#ff6b6b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <AlertTriangle size={14} /> {r.severity}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{r.page}</span>
                        </div>
                        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem' }}>Element: &lt;{r.element}&gt;</h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                            {r.recommendation}
                        </p>
                    </div>
                ))}
                {reports.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '1rem' }}>No critical accessibility violations found.</p>
                )}
            </div>
        </div>
    );
}
