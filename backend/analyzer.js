const db = require('./database');

const ANALYSIS_RULES = {
    RAGE_CLICK_PENALTY: 10,
    DEAD_CLICK_PENALTY: 5,
    ABANDONMENT_PENALTY: 30,
    LOOP_PENALTY: 15,
    SCREENS: ['/login', '/form', '/confirmation', '/home'],
    THRESHOLDS: {
        TIME_TO_FIRST_CLICK: 5000,
        SCROLL_LOW_INTERACTION: 0.8,
        CRITICAL_MOMENT_DELTA: 15, // Friction spike threshold
        REDUNDANCY_WINDOW: 2000, // 2s window for repeated actions
        EXPECTATION_FAST: 2000, // 2s for immediate action
        EXPECTATION_SLOW: 10000 // 10s for hesitation
    }
};

function analyzeSession(sessionId) {
    console.log(`Starting analysis for session: ${sessionId}`);

    // Get session and logs
    db.get('SELECT * FROM sessions WHERE id = ?', [sessionId], (err, session) => {
        if (err || !session) return console.error('Session not found', err);

        db.all('SELECT * FROM interaction_logs WHERE session_id = ? ORDER BY timestamp ASC', [sessionId], (err, logs) => {
            if (err) return console.error('Error fetching logs', err);

            const result = performAnalysis(session, logs);
            saveAnalysisResults(sessionId, result);
        });
    });
}

function performAnalysis(session, logs) {
    let clickScore = 100;
    let timeScore = 100;
    let navScore = 100;
    let qualityScore = 100; // TIER-1: Session Quality
    let issues = [];
    
    // Advanced Metrics
    let redundantActions = 0;
    let criticalMoments = 0;
    let entryExpectationScore = 0;
    let frictionConfidence = 0; // TIER-3
    let uniqueTargets = new Set();

    
    // Track per-page metrics
    let pageMetrics = {}; // url -> { metrics... }

    // --- 1. Process Logs ---
    
    // Sort logs by time just in case
    logs.sort((a, b) => a.timestamp - b.timestamp);

    // Identify Navigation Flow using page_url
    const navPath = logs.filter(l => l.event_type === 'page_view').map(l => l.page_url);
    
    // Detect Loops: A -> B -> A
    for (let i = 0; i < navPath.length - 2; i++) {
        if (navPath[i] === navPath[i+2] && navPath[i] !== navPath[i+1]) {
            navScore -= ANALYSIS_RULES.LOOP_PENALTY;
            issues.push({
                screen: navPath[i],
                severity: 'Medium',
                timestamp: Date.now(), // Added timestamp
                description: `Navigation loop detected: ${navPath[i]} -> ${navPath[i+1]} -> ${navPath[i]}`
            });
        }
    }

    let entryPageProcessed = false;

    logs.forEach((log, index) => {
        const page = log.page_url || 'unknown';
        if (!pageMetrics[page]) pageMetrics[page] = { 
            time_to_first_click: null, 
            max_scroll: 0, 
            clicks: 0, 
            dead_clicks: 0, 
            rage_clicks: 0 
        };

        // TIER-2: Page Entry Expectation (First action on entry page)
        if (!entryPageProcessed && log.event_type !== 'page_view') {
            const timeSinceStart = log.timestamp - session.start_time;
            if (timeSinceStart < ANALYSIS_RULES.THRESHOLDS.EXPECTATION_FAST) {
                entryExpectationScore += 10; // Immediate intent
                qualityScore += 2;
            } else if (timeSinceStart > ANALYSIS_RULES.THRESHOLDS.EXPECTATION_SLOW) {
                entryExpectationScore -= 5; // Hesitation
            }
            entryPageProcessed = true;
        }

        if (log.event_type === 'click') {
            pageMetrics[page].clicks++;
            uniqueTargets.add(log.target_element);
            
            // TIER-1: Interaction Redundancy Detector
            // Check previous log for same target within short window
            if (index > 0) {
                const prev = logs[index-1];
                if (prev.event_type === 'click' && 
                    prev.target_element === log.target_element && 
                    (log.timestamp - prev.timestamp) < ANALYSIS_RULES.THRESHOLDS.REDUNDANCY_WINDOW) {
                    
                    redundantActions++;
                    qualityScore -= 2; // Minor penalty
                    issues.push({
                         screen: page,
                         severity: 'Low',
                         timestamp: log.timestamp,
                         description: `Redundant interaction detected on ${log.target_element}`
                    });
                }
            }

        } else if (log.event_type === 'dead_click') {
            pageMetrics[page].dead_clicks++;
            clickScore -= ANALYSIS_RULES.DEAD_CLICK_PENALTY;
            qualityScore -= 5;
            issues.push({
                screen: page,
                severity: 'Low',
                timestamp: log.timestamp,
                description: 'Dead click detected (non-interactive element)'
            });
        } else if (log.event_type === 'rage_click') {
            pageMetrics[page].rage_clicks++;
            clickScore -= ANALYSIS_RULES.RAGE_CLICK_PENALTY;
            qualityScore -= 10;
             issues.push({
                screen: page,
                severity: 'High',
                timestamp: log.timestamp,
                description: `Rage click detected on ${log.target_element}`
            });
        } else if (log.event_type === 'time_to_first_click') {
            const data = JSON.parse(log.metadata || '{}');
            pageMetrics[page].time_to_first_click = data.duration;
            if (data.duration > ANALYSIS_RULES.THRESHOLDS.TIME_TO_FIRST_CLICK) {
                timeScore -= 5;
                qualityScore -= 2;
                issues.push({
                    screen: page,
                    severity: 'Low',
                    timestamp: log.timestamp,
                    description: 'High time-to-first-click (Hesitation)'
                });
            }
        } else if (log.event_type === 'scroll_depth') {
            const data = JSON.parse(log.metadata || '{}');
            if (data.depth > pageMetrics[page].max_scroll) {
                pageMetrics[page].max_scroll = data.depth;
            }
        }
    });

    // --- 2. Scroll/Click Correlation (Confusion) ---
    Object.entries(pageMetrics).forEach(([page, m]) => {
        if (m.max_scroll > 80 && m.clicks < 2) {
            // High scroll, low interaction -> confusion?
            issues.push({
                screen: page,
                severity: 'Medium',
                timestamp: Date.now(),
                description: 'High scroll depth with low interaction (Content Clarity?)'
            });
            navScore -= 5;
        }
    });

    // --- 3. Abandonment ---
    // If session closed without "success" event.
    // Define success? Maybe reaching /confirmation or staying active?
    // User definition: "exit a page without performing any click interactions" -> Page Abandonment.
    // "Sessions where users exit a page without performing any click interactions"
    Object.entries(pageMetrics).forEach(([page, m]) => {
        if (m.clicks === 0 && m.rage_clicks === 0) { // No interaction
             // Only if they left the page. If it's the last page and session ended 'completed', maybe valid?
             // But let's flag as high friction entry point if it happens.
             // We'll mark the page as abandoned in metrics.
             m.is_abandoned = 1;
             navScore -= 5;
        } else {
            m.is_abandoned = 0;
        }
    });

    // Average Friction Score
    let totalScore = (clickScore + timeScore + navScore) / 3;

    // --- 4. Unresolved Friction ---
    if (session.status === 'abandoned' && totalScore < 50) {
        // High friction + Abandoned = Unresolved
        issues.push({
             screen: 'Session',
             severity: 'High',
             timestamp: Date.now(),
             description: 'Unresolved Friction: User abandoned due to high friction.'
        });
    }

    // --- 5. Attention Drift Calculation ---
    // Entropy of navigation: unique pages / total transitions
    const attentionDrift = navPath.length > 2 ? (new Set(navPath).size / navPath.length) : 1; 
    let attentionDriftScore = 100 * attentionDrift; 
    // If they visit many pages but unique count is low -> looping -> drift score drops? 
    // Actually: High Ratio = Exploring new things (Good/Bad?).
    // Attention Drift: bouncing between unrelated areas.
    // If (transitions > 5 && unique < transitions * 0.5) -> drifting back and forth?
    
    // --- 6. Interaction Density ---
    const totalClicks = logs.filter(l => l.event_type === 'click').length;
    const interactionDensityScore = totalClicks > 0 ? (uniqueTargets.size / totalClicks) : 1;
    if (interactionDensityScore < 0.3) {
         issues.push({
             screen: 'Global',
             severity: 'Medium',
             timestamp: Date.now(),
             description: 'Low Interaction Density: High click count on few elements (Flailing?).'
        });
        qualityScore -= 5;
    }

    // --- 7. Friction Confidence Level ---
    // Rule: events > 5 and duration > 10s = High confidence
    if (logs.length > 5 && (session.end_time - session.start_time > 10000)) {
        frictionConfidence = 0.9;
    } else {
        frictionConfidence = 0.4; // Low sample size
    }

    // Cap metrics
    clickScore = Math.max(0, clickScore);
    timeScore = Math.max(0, timeScore);
    navScore = Math.max(0, navScore);
    qualityScore = Math.max(0, Math.min(100, qualityScore));
    
    return { 
        totalScore, clickScore, timeScore, navScore, issues, pageMetrics,
        qualityScore, attentionDriftScore, interactionDensityScore, 
        entryExpectationScore, frictionConfidence
    };
}

function clearAnalysisForSession(sessionId, callback) {
    db.serialize(() => {
        db.run('DELETE FROM issues WHERE session_id = ?', [sessionId]);
        db.run('DELETE FROM friction_scores WHERE session_id = ?', [sessionId]);
        db.run('DELETE FROM page_metrics WHERE session_id = ?', [sessionId], callback);
    });
}

function saveAnalysisResults(sessionId, result) {
    clearAnalysisForSession(sessionId, () => {
        const { 
            totalScore, clickScore, timeScore, navScore, issues, pageMetrics,
            qualityScore, attentionDriftScore, interactionDensityScore, 
            entryExpectationScore, frictionConfidence
        } = result;

        // Update Session
        db.run(`UPDATE sessions SET 
            total_friction_score = ?, 
            status = 'completed',
            quality_score = ?,
            attention_drift_score = ?,
            interaction_density_score = ?,
            entry_expectation_score = ?,
            friction_confidence_score = ?
            WHERE id = ?`, 
            [totalScore, qualityScore, attentionDriftScore, interactionDensityScore, entryExpectationScore, frictionConfidence, sessionId]);

        const lastScreen = Object.keys(pageMetrics).pop() || 'Global';
        
        db.run(`INSERT INTO friction_scores (session_id, screen_name, score, click_score, time_score, nav_score) VALUES (?, ?, ?, ?, ?, ?)`,
            [sessionId, lastScreen, totalScore, clickScore, timeScore, navScore]);

        // Save Page Metrics
        Object.entries(pageMetrics).forEach(([page, m]) => {
            db.run(`INSERT INTO page_metrics (session_id, page_url, time_to_first_click, max_scroll_depth, click_count, is_abandoned, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                [sessionId, page, m.time_to_first_click, m.max_scroll, m.clicks, m.is_abandoned, Date.now()]);
        });

        // Save Issues
        issues.forEach(issue => {
            db.run(`INSERT INTO issues (session_id, screen_name, severity, description, timestamp) VALUES (?, ?, ?, ?, ?)`,
                [sessionId, issue.screen, issue.severity, issue.description, issue.timestamp || Date.now()]);
        });

        console.log(`Analysis complete for ${sessionId}. Score: ${totalScore.toFixed(2)}`);
    });
}

module.exports = { analyzeSession };
