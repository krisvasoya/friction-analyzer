import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../api';

const Tracker = ({ sessionId }) => {
    const location = useLocation();
    
    // Refs to maintain state without re-renders affecting listeners
    const clickHistory = useRef([]); // For Rage Clicks
    const pageLoadTime = useRef(null); // Init in useEffect
    const firstClickRecorded = useRef(false);
    const maxScrollDepth = useRef(0);
    const scrollBenchmarks = useRef(new Set()); // 25, 50, 75, 100
    
    // Academic Refs
    const mouseEnterTime = useRef({}); // { elementInfo: timestamp }
    const actionBuffer = useRef([]); // [{ type, target, timestamp }] for Intent Mismatch
    const cognitiveScore = useRef(0);

    // Advanced Analytics Refs
    const reversalCount = useRef(0);
    const pauseCount = useRef(0);
    const uniqueClicksSet = useRef(new Set());
    const meaningfulActionCount = useRef(0);
    const totalClicks = useRef(0);
    const entryPage = useRef(null);
    const isReturning = useRef(false);
    const frictionEvents = useRef([]);

    // Reset page-level metrics on location change
    useEffect(() => {
        pageLoadTime.current = Date.now();
        firstClickRecorded.current = false;
        maxScrollDepth.current = 0;
        scrollBenchmarks.current = new Set();
        clickHistory.current = [];
        actionBuffer.current = [];

        // Detect Returning User (localStorage)
        if (!entryPage.current) {
            entryPage.current = location.pathname;
            isReturning.current = !!localStorage.getItem('has_visited');
            localStorage.setItem('has_visited', 'true');
        }

        // Calculate Cognitive Load Proxy + Page Complexity Warning
        const interactiveElements = document.querySelectorAll('button, a, input, select, [onclick]');
        const density = (interactiveElements.length / (window.innerHeight * window.innerWidth)) * 1000000;
        cognitiveScore.current = Math.min(100, Math.round(density * 10));

        // Page Complexity Warning
        if (interactiveElements.length > 30) {
            api.track(sessionId, 'page_complexity_warning', location.pathname, { 
                element_count: interactiveElements.length,
                threshold: 30
            });
        }

        // Track Page View with Extended Metadata
        api.track(sessionId, 'page_view', 'body', { 
            url: location.pathname, 
            cognitive_load: cognitiveScore.current,
            is_returning_user: isReturning.current,
            entry_page: entryPage.current
        });

    }, [location.pathname, sessionId]);

    useEffect(() => {
        if (!sessionId) return;

        // --- Helper: Get Element Info ---
        const getElementInfo = (target) => {
             if (!target) return 'unknown';
             return target.tagName + 
                   (target.id ? `#${target.id}` : '') + 
                   (target.className && typeof target.className === 'string' ? `.${target.className.split(' ').join('.')}` : '') + 
                   (target.innerText ? `[text="${target.innerText.substring(0, 20)}..."]` : '');
        };

        // --- Helper: Check Interactive ---
        const isInteractive = (target) => {
            if (!target || target === document) return false;
            const interactiveTags = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA', 'LABEL'];
            return target.closest(interactiveTags.join(',')) || 
                   target.onclick || 
                   (target.style && target.style.cursor === 'pointer');
        };

        // --- Micro-Hesitation Handler ---
        const handleMouseEnter = (e) => {
            if (isInteractive(e.target)) {
                const info = getElementInfo(e.target);
                mouseEnterTime.current[info] = Date.now();
            }
        };

        // --- Click Handler (Dead Click, Rage Click, Timings, Academic) ---
        const handleClick = (e) => {
            const now = Date.now();
            const target = e.target;
            const elementInfo = getElementInfo(target);
            const x = e.pageX;
            const y = e.pageY;

            // 1. Micro-Hesitation Detection & Pause Count
            if (mouseEnterTime.current[elementInfo]) {
                const gap = now - mouseEnterTime.current[elementInfo];
                if (gap > 4000) { // 4 seconds threshold
                    pauseCount.current++;
                    api.track(sessionId, 'micro_hesitation', elementInfo, { duration: gap, url: location.pathname }, x, y);
                    frictionEvents.current.push({ type: 'hesitation', timestamp: now });
                }
                delete mouseEnterTime.current[elementInfo];
            }

            // 2. Intent Mismatch (Sequence Buffer) & Reversal Count
            const lastAction = actionBuffer.current[actionBuffer.current.length - 1];
            if (lastAction && (target.innerText === 'Back' || target.innerText === 'Cancel' || location.pathname === '/login')) {
                const timeSinceLast = now - lastAction.timestamp;
                if (timeSinceLast < 5000) { // 5s reversal
                    reversalCount.current++;
                    frictionEvents.current.push({ type: 'reversal', timestamp: now });
                    api.track(sessionId, 'intent_mismatch', elementInfo, { 
                        previous_action: lastAction.target,
                        time_to_reversal: timeSinceLast,
                        url: location.pathname 
                    }, x, y);
                }
            }
            actionBuffer.current.push({ type: 'click', target: elementInfo, timestamp: now });

            // 3. Time to First Click
            if (!firstClickRecorded.current) {
                const timeToClick = now - pageLoadTime.current;
                api.track(sessionId, 'time_to_first_click', 'page', { duration: timeToClick, url: location.pathname }, x, y);
                firstClickRecorded.current = true;
            }

            // 4. Dead Click Detection
            if (!isInteractive(target)) {
                api.track(sessionId, 'dead_click', elementInfo, { url: location.pathname }, x, y);
                window.dispatchEvent(new CustomEvent('friction-event', { detail: { type: 'dead_click' } }));
            }

            // 5. Rage Click Detection
            clickHistory.current = clickHistory.current.filter(c => now - c.timestamp < 2000);
            clickHistory.current.push({ target: elementInfo, timestamp: now });

            const clicksOnElement = clickHistory.current.filter(c => c.target === elementInfo);
            if (clicksOnElement.length === 3) {
                 api.track(sessionId, 'rage_click', elementInfo, { count: clicksOnElement.length, url: location.pathname }, x, y);
                 window.dispatchEvent(new CustomEvent('friction-event', { detail: { type: 'rage_click' } }));
            }

            api.track(sessionId, 'click', elementInfo, { url: location.pathname }, x, y);

            // Advanced Analytics: Click Tracking
            totalClicks.current++;
            uniqueClicksSet.current.add(elementInfo);

            // Meaningful Action Detection
            const meaningfulKeywords = ['submit', 'next', 'confirm', 'save', 'continue', 'buy', 'checkout'];
            const isMeaningful = meaningfulKeywords.some(keyword => 
                elementInfo.toLowerCase().includes(keyword) || 
                (target.innerText && target.innerText.toLowerCase().includes(keyword))
            );
            if (isMeaningful) {
                meaningfulActionCount.current++;
            }

            // Decision Paralysis Check (many unique clicks, few meaningful)
            if (uniqueClicksSet.current.size > 10 && meaningfulActionCount.current < 2) {
                const paralysisScore = (uniqueClicksSet.current.size / Math.max(meaningfulActionCount.current, 1)) * 10;
                api.track(sessionId, 'decision_paralysis', 'session', { 
                    unique_clicks: uniqueClicksSet.current.size,
                    meaningful_actions: meaningfulActionCount.current,
                    paralysis_score: Math.round(paralysisScore),
                    url: location.pathname 
                });
            }

            // Calculate and update advanced metrics periodically
            if (totalClicks.current % 5 === 0) {
                const wasteRatio = meaningfulActionCount.current > 0 
                    ? totalClicks.current / meaningfulActionCount.current 
                    : totalClicks.current;
                const confidenceScore = Math.max(0, 100 - (reversalCount.current * 10 + pauseCount.current * 5));

                api.track(sessionId, 'advanced_metrics_update', 'session', {
                    confidence_score: confidenceScore,
                    click_waste_ratio: wasteRatio.toFixed(2),
                    total_clicks: totalClicks.current,
                    meaningful_actions: meaningfulActionCount.current,
                    reversals: reversalCount.current,
                    pauses: pauseCount.current
                });

                // Recovery Detection: Check if friction was followed by meaningful action
                if (frictionEvents.current.length > 0 && meaningfulActionCount.current > 0) {
                    const lastFriction = frictionEvents.current[frictionEvents.current.length - 1];
                    if (isMeaningful && (now - lastFriction.timestamp < 10000)) {
                        api.track(sessionId, 'friction_recovery', 'session', {
                            friction_type: lastFriction.type,
                            recovery_time: now - lastFriction.timestamp
                        });
                    }
                }
            }
        };

        // --- Scroll Handler ---
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            
            const benchmarks = [25, 50, 75, 100];
            
            benchmarks.forEach(bm => {
                if (scrollPercent >= bm && !scrollBenchmarks.current.has(bm)) {
                    scrollBenchmarks.current.add(bm);
                    api.track(sessionId, 'scroll_depth', 'window', { depth: bm, url: location.pathname });
                }
            });

            if (scrollPercent > maxScrollDepth.current) {
                maxScrollDepth.current = scrollPercent;
            }
        };

        // Throttled Scroll Listener would be better, but basic one for now
        let scrollTimeout;
        const throttledScroll = () => {
            if (!scrollTimeout) {
                scrollTimeout = setTimeout(() => {
                    handleScroll();
                    scrollTimeout = null;
                }, 500);
            }
        };

        // Attach Listeners
        document.addEventListener('mouseover', handleMouseEnter);
        document.addEventListener('click', handleClick);
        window.addEventListener('scroll', throttledScroll);
        
        return () => {
            document.removeEventListener('mouseover', handleMouseEnter);
            document.removeEventListener('click', handleClick);
            window.removeEventListener('scroll', throttledScroll);
            if(scrollTimeout) clearTimeout(scrollTimeout);
        };
    }, [sessionId, location.pathname]); // Re-bind if session changes

    return null;
};

export default Tracker;
