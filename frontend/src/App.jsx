import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './features/user/Home';
import Services from './features/user/Services';
import Details from './features/user/Details';
import Login from './features/auth/Login';
import Signup from './features/auth/Signup';
import MultiStepForm from './features/user/MultiStepForm';
import Confirmation from './features/user/Confirmation';
import Pricing from './features/user/Pricing';
import Features from './features/user/Features';
import FeatureDetail from './features/user/FeatureDetail';
import Dashboard from './features/dashboard/Dashboard';
import AdminLogin from './features/auth/AdminLogin';
import AdminGuard from './components/layout/AdminGuard';
import ErrorBoundary from './components/common/ErrorBoundary';
import AutoHelpWidget from './components/common/AutoHelpWidget';
import { api } from './lib/api';

function App() {
    const [sessionId, setSessionId] = useState(null);

    const startNewSession = React.useCallback(async () => {
        try {
            const data = await api.startSession();
            if (data && data.sessionId) {
                setSessionId(data.sessionId);
            } else {
                throw new Error('No sessionId returned');
            }
        } catch (e) {
            console.error('Failed to start session', e);
            // Fallback: generate a local UUID so the app still loads
            setSessionId('local-' + crypto.randomUUID());
        }
    }, []);

    useEffect(() => {
        let ignore = false;

        async function init() {
            try {
                const data = await api.startSession();
                if (!ignore) {
                    if (data && data.sessionId) {
                        setSessionId(data.sessionId);
                    } else {
                        throw new Error('No sessionId returned');
                    }
                }
            } catch (e) {
                console.error('Failed to start session', e);
                if (!ignore) {
                    // Fallback: generate a local UUID so the app still loads
                    setSessionId('local-' + crypto.randomUUID());
                }
            }
        }

        init();
        return () => { ignore = true; };
    }, []);

    const refreshSession = () => {
        startNewSession();
    };

    if (!sessionId) return (
        <div style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'center', height: '100vh', background: '#0d1117', color: '#8b949e',
            fontFamily: 'Inter, sans-serif', gap: '12px'
        }}>
            <div style={{ fontSize: '14px' }}>Loading Session...</div>
        </div>
    );

    return (
        <Router>
            <Routes>
                {/* User Routes wrapped in Layout */}
                <Route path="/" element={<Layout sessionId={sessionId}><Home /></Layout>} />
                <Route path="/services" element={<Layout sessionId={sessionId}><Services /></Layout>} />
                <Route path="/details" element={<Layout sessionId={sessionId}><Details /></Layout>} />
                <Route path="/login" element={<Layout sessionId={sessionId}><Login sessionId={sessionId} onAuthSuccess={refreshSession} /></Layout>} />
                <Route path="/signup" element={<Layout sessionId={sessionId}><Signup sessionId={sessionId} onAuthSuccess={refreshSession} /></Layout>} />
                <Route path="/form" element={<Layout sessionId={sessionId}><MultiStepForm sessionId={sessionId} /></Layout>} />
                <Route path="/confirmation" element={<Layout sessionId={sessionId}><Confirmation sessionId={sessionId} /></Layout>} />
                <Route path="/pricing" element={<Layout sessionId={sessionId}><Pricing /></Layout>} />
                <Route path="/features" element={<Layout sessionId={sessionId}><Features /></Layout>} />
                <Route path="/features/:id" element={<Layout sessionId={sessionId}><FeatureDetail /></Layout>} />
                
                {/* Admin Login */}
                <Route path="/admin-login" element={<AdminLogin />} />

                {/* Dashboard Route wrapped in AdminGuard + ErrorBoundary */}
                <Route path="/dashboard" element={
                    <AdminGuard>
                        <ErrorBoundary>
                            <Dashboard />
                        </ErrorBoundary>
                    </AdminGuard>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <AutoHelpWidget />
        </Router>
    );
}

export default App;
