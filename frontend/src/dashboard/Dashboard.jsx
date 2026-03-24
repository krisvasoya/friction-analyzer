import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Sun, Moon, LogOut, Shield, LayoutDashboard, BarChart3, Brain, Globe, Search, Target, TrendingUp, Radio, ArrowLeft, Activity } from 'lucide-react';
import SummaryCards from './SummaryCards';
import RealTimeMetrics from './RealTimeMetrics';
import HeatmapOverlay from './HeatmapOverlay';
import TopElements from './TopElements';
import IssueList from './IssueList';
import ExportButton from './ExportButton';
import ClickDistributionGraphs from './ClickDistributionGraphs';
import ExtendedMetrics from './ExtendedMetrics';
import FunnelChart from './FunnelChart';
import AIInsights from './AIInsights';
import GeoFrictionMap from './GeoFrictionMap';
import DeviceBrowserPulse from './DeviceBrowserPulse';
import ABSimulator from './ABSimulator';
import AccessibilityAuditor from './AccessibilityAuditor';
import AcademicDashboard from './AcademicDashboard';
import AdvancedMetricsDashboard from './AdvancedMetricsDashboard';
import LiveInteractionFeed from './LiveInteractionFeed';
import SessionViewer from './SessionViewer';

const TAB_ICONS = {
    Summary: BarChart3, Insights: Brain, Distribution: Globe,
    Audits: Search, Behavioral: Target, Analytics: TrendingUp, 'Live Feed': Radio,
    Sessions: Search
};

export default function Dashboard() {
    const [summary, setSummary] = useState(null);
    const [activeTab, setActiveTab] = useState('Summary');
    const [theme, setTheme] = useState(() => localStorage.getItem('dashboard-theme') || 'dark');
    const [tabAnim, setTabAnim] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        api.getDashboardSummary().then(setSummary);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('dashboard-theme', theme);
        return () => document.documentElement.removeAttribute('data-theme');
    }, [theme]);

    const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

    const handleLogout = () => {
        sessionStorage.removeItem('isAdmin');
        document.documentElement.removeAttribute('data-theme');
        navigate('/admin-login');
    };

    const switchTab = (tab) => {
        setTabAnim(false);
        setActiveTab(tab);
        setTimeout(() => setTabAnim(true), 50);
    };



    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', padding: '1.5rem 1rem', transition: 'var(--transition-smooth)' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

                {/* ═══ HEADER ═══ */}
                <header className="animate-fade-in" style={{
                    marginBottom: '2rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: '1rem',
                    padding: '1.25rem 2rem',
                    borderRadius: '24px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    backdropFilter: 'blur(24px)',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.2)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <div style={{
                            width: '52px', height: '52px', borderRadius: '16px',
                            background: 'linear-gradient(135deg, var(--primary), #0891b2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 24px var(--primary-glow)'
                        }}>
                            <LayoutDashboard size={24} color="#000" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
                                Friction <span style={{ color: 'var(--primary)' }}>Analyzer</span>
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                                <Shield size={12} />
                                <span style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>Enterprise Suite</span>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--success)', animation: 'pulse 2s infinite' }} />
                                <span style={{ color: 'var(--success)' }}>Live</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <button
                            onClick={toggleTheme}
                            className="secondary"
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            style={{
                                width: '42px', height: '42px', borderRadius: '12px',
                                transition: 'var(--transition-smooth)',
                                padding: 0
                            }}
                        >
                            <div style={{ transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)', transform: theme === 'dark' ? 'rotate(0)' : 'rotate(180deg)' }}>
                                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                            </div>
                        </button>

                        <button
                            onClick={handleLogout}
                            className="secondary"
                            title="Logout"
                            style={{
                                width: '42px', height: '42px', borderRadius: '12px',
                                border: '1px solid rgba(244, 63, 94, 0.2)',
                                background: 'rgba(244, 63, 94, 0.05)',
                                color: 'var(--danger)',
                                transition: 'var(--transition-smooth)',
                                padding: 0
                            }}
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                </header>

                <SummaryCards data={summary} />

                {/* ═══ TABS ═══ */}
                <div style={{
                    marginBottom: '2rem',
                    display: 'flex', gap: '0.4rem',
                    padding: '0.4rem',
                    borderRadius: '14px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    overflowX: 'auto'
                }}>
                    {['Summary', 'Insights', 'Distribution', 'Audits', 'Sessions', 'Behavioral', 'Analytics', 'Live Feed'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => switchTab(tab)}
                            style={{
                                padding: '0.6rem 1.2rem',
                                color: activeTab === tab ? '#fff' : 'var(--text-secondary)',
                                background: activeTab === tab ? 'linear-gradient(135deg, var(--primary), #0891b2)' : 'transparent',
                                fontWeight: activeTab === tab ? '700' : '500',
                                fontSize: '0.78rem',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                                borderRadius: '10px',
                                border: 'none',
                                letterSpacing: '0.03em',
                                display: 'flex', alignItems: 'center', gap: '0.4rem',
                                whiteSpace: 'nowrap',
                                boxShadow: activeTab === tab ? '0 4px 16px rgba(0,242,234,0.2)' : 'none'
                            }}
                        >
                            {(() => { const TabIcon = TAB_ICONS[tab]; return <TabIcon size={13} />; })()}
                            {tab}
                        </button>
                    ))}
                </div>

                {/* ═══ CONTENT ═══ */}
                <div style={{
                    opacity: tabAnim ? 1 : 0,
                    transform: tabAnim ? 'translateY(0)' : 'translateY(12px)',
                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                    {activeTab === 'Summary' && (
                        <>
                            <RealTimeMetrics />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                <FunnelChart />
                                <ClickDistributionGraphs />
                            </div>
                            <IssueList />
                        </>
                    )}

                    {activeTab === 'Insights' && (
                        <>
                            <AIInsights />
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
                                <ABSimulator />
                                <AccessibilityAuditor />
                            </div>
                        </>
                    )}

                    {activeTab === 'Distribution' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <GeoFrictionMap />
                            <DeviceBrowserPulse />
                            <div style={{ gridColumn: '1 / -1' }}>
                                <ExtendedMetrics />
                            </div>
                        </div>
                    )}

                    {activeTab === 'Audits' && (
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                            <HeatmapOverlay />
                            <TopElements />
                        </div>
                    )}

                    {activeTab === 'Behavioral' && <AcademicDashboard />}
                    {activeTab === 'Analytics' && <AdvancedMetricsDashboard />}
                    {activeTab === 'Live Feed' && <LiveInteractionFeed />}
                    {activeTab === 'Sessions' && <SessionViewer />}
                </div>

                {/* ═══ FOOTER ═══ */}
                <footer style={{
                    marginTop: '3rem', textAlign: 'center', padding: '2rem',
                    borderTop: '1px solid var(--border)',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem'
                }}>
                    <ExportButton />
                    <a href="/" style={{
                        color: 'var(--text-secondary)', textDecoration: 'none',
                        fontSize: '0.85rem', transition: 'color 0.2s'
                    }}><ArrowLeft size={14} style={{ verticalAlign: 'middle', marginRight: '0.3rem' }} />Return to Home Page</a>
                </footer>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.4; }
                }
            `}</style>
        </div>
    );
}
