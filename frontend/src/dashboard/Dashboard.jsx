import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { Sun, Moon, LogOut, Shield, LayoutDashboard, BarChart3, Brain, Globe, Search, Target, TrendingUp, Radio, ArrowLeft } from 'lucide-react';
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

const TAB_ICONS = {
    Summary: BarChart3, Insights: Brain, Distribution: Globe,
    Audits: Search, Behavioral: Target, Analytics: TrendingUp, 'Live Feed': Radio
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
        <div style={{ minHeight: '100vh', background: 'var(--bg-dark)', padding: '1.5rem 1rem', transition: 'background 0.4s ease' }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

                {/* ═══ HEADER ═══ */}
                <header style={{
                    marginBottom: '2rem',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: '1rem',
                    padding: '1rem 1.5rem',
                    borderRadius: '20px',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    backdropFilter: 'blur(20px)'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '48px', height: '48px', borderRadius: '14px',
                            background: 'linear-gradient(135deg, #00f2ea, #0891b2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 24px rgba(0,242,234,0.2)'
                        }}>
                            <LayoutDashboard size={22} color="#fff" />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                                Friction <span style={{ color: 'var(--primary)' }}>Analyzer</span>
                            </h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                <Shield size={10} />
                                <span>Enterprise Dashboard</span>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }} />
                                <span style={{ color: '#10b981' }}>Live</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <button
                            onClick={toggleTheme}
                            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                            style={{
                                width: '40px', height: '40px', borderRadius: '12px',
                                border: '1px solid var(--border)', background: 'var(--bg-dark)',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                                color: 'var(--text-primary)', boxShadow: 'none', padding: 0
                            }}
                        >
                            <div style={{ transition: 'transform 0.4s', transform: theme === 'dark' ? 'rotate(0)' : 'rotate(180deg)' }}>
                                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                            </div>
                        </button>

                        <button
                            onClick={handleLogout}
                            title="Logout"
                            style={{
                                width: '40px', height: '40px', borderRadius: '12px',
                                border: '1px solid rgba(248, 81, 73, 0.3)',
                                background: 'rgba(248, 81, 73, 0.06)',
                                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                transition: 'all 0.3s', color: '#f85149', boxShadow: 'none', padding: 0
                            }}
                        >
                            <LogOut size={16} />
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
                    {['Summary', 'Insights', 'Distribution', 'Audits', 'Behavioral', 'Analytics', 'Live Feed'].map(tab => (
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
