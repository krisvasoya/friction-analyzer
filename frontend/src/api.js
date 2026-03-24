const API_BASE = 'http://localhost:3000/api';

export const api = {
    startSession: async (metadata = {}) => {
        const res = await fetch(`${API_BASE}/session/start`, { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(metadata)
        });
        return res.json();
    },
    track: (sessionId, eventType, targetElement, metadata = {}, x = 0, y = 0) => {
        return fetch(`${API_BASE}/track`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                sessionId,
                eventType,
                targetElement,
                metadata,
                x,
                y,
                page: window.location.pathname
            }),
        });
    },
    endSession: async (sessionId) => {
        if (!sessionId) return;
        await fetch(`${API_BASE}/session/end`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId })
        });
    },
    getDashboardSummary: async () => {
        const res = await fetch(`${API_BASE}/dashboard/summary`);
        return res.json();
    },
    getScores: async () => {
        const res = await fetch(`${API_BASE}/dashboard/scores`);
        return res.json();
    },
    getGeoDistribution: async () => {
        const res = await fetch(`${API_BASE}/dashboard/geo-distribution`);
        return res.json();
    },
    getDeviceStats: async () => {
        const res = await fetch(`${API_BASE}/dashboard/device-distribution`);
        return res.json();
    },
    getABSimulation: async (element, adjustment) => {
        const res = await fetch(`${API_BASE}/dashboard/ab-simulation?element=${element}&adjustment=${adjustment}`);
        return res.json();
    },
    getAccessibilityReport: async () => {
        const res = await fetch(`${API_BASE}/dashboard/acc-report`);
        return res.json();
    },
    getLiveSessions: async () => {
        const res = await fetch(`${API_BASE}/dashboard/live-sessions`);
        return res.json();
    },
    getStats: async () => {
        const res = await fetch(`${API_BASE}/dashboard/stats`);
        return res.json();
    },
    getAlerts: async () => {
        const res = await fetch(`${API_BASE}/dashboard/alerts`);
        return res.json();
    },
    getAcademicStats: async () => {
        const res = await fetch(`${API_BASE}/dashboard/academic-stats`);
        return res.json();
    },
    getAdvancedStats: async () => {
        const res = await fetch(`${API_BASE}/dashboard/advanced-stats`);
        return res.json();
    },
    getIssues: async () => {
        const res = await fetch(`${API_BASE}/dashboard/issues`);
        return res.json();
    },
    getExportUrl: (format = 'json') => `${API_BASE}/export?format=${format}`,
    getFrictionBreakdown: async () => {
        const res = await fetch(`${API_BASE}/dashboard/friction-breakdown`);
        return res.json();
    },
    getPageMetrics: async () => {
        const res = await fetch(`${API_BASE}/dashboard/metrics`);
        return res.json();
    },
    getDeadClicks: async () => {
        const res = await fetch(`${API_BASE}/dashboard/dead-clicks`);
        return res.json();
    },
    getFunnels: async () => {
        const res = await fetch(`${API_BASE}/dashboard/funnels`);
        return res.json();
    },
    // --- Auth API ---
    register: async (email, password, fullName) => {
        const res = await fetch(`${API_BASE}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, fullName })
        });
        return res.json();
    },
    login: async (email, password) => {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        return res.json();
    },
    socialLogin: async (provider) => {
        const res = await fetch(`${API_BASE}/auth/social`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                email: `user_${provider}@example.com`, 
                fullName: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
                provider 
            })
        });
        return res.json();
    },
    getLiveFeed: async () => {
        const res = await fetch(`${API_BASE}/dashboard/live-feed`);
        return res.json();
    },
    getSessionsList: async () => {
        const res = await fetch(`${API_BASE}/dashboard/sessions-list`);
        return res.json();
    },
    getSessionEvents: async (sessionId) => {
        const res = await fetch(`${API_BASE}/dashboard/sessions/${sessionId}/events`);
        return res.json();
    }
};
