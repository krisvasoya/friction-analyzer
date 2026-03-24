const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const db = require('./database');
const { analyzeSession } = require('./analyzer');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.send('Digital Friction Analyzer API is running. Access frontend at http://localhost:5173');
});

// --- AUTH HELPERS ---
const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex');
};

// --- AUTH ROUTES ---

// API: Register
app.post('/api/auth/register', (req, res) => {
    console.log('Registration request body:', req.body);
    const { email, password, fullName, provider = 'local' } = req.body;
    const createdAt = Date.now();

    if (!email || !password || !fullName) {
        return res.status(400).json({ error: 'Please provide email, password, and full name.' });
    }

    const hashedPassword = hashPassword(password);

    db.run(`INSERT INTO users (email, password, full_name, provider, created_at) VALUES (?, ?, ?, ?, ?)`,
        [email, hashedPassword, fullName, provider, createdAt],
        function(err) {
            if (err) {
                console.error('DB Insert Error (Register):', err.message);
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(400).json({ error: 'This email is already registered.' });
                }
                return res.status(500).json({ error: 'Server error during registration. Please try again later.' });
            }
            console.log('User registered successfully, ID:', this.lastID);
            res.json({ message: 'User registered successfully', userId: this.lastID });
        }
    );
});

// API: Login
app.post('/api/auth/login', (req, res) => {
    console.log('Login request body:', req.body);
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }

    const hashedPassword = hashPassword(password);

    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) {
            console.error('DB Select Error (Login):', err.message);
            return res.status(500).json({ error: 'Internal server error during login.' });
        }
        if (!user || user.password !== hashedPassword) {
            console.warn('Invalid login attempt for email:', email);
            return res.status(401).json({ error: 'Invalid email or password.' });
        }
        console.log('Login successful for user:', user.email);
        res.json({ 
            message: 'Login successful', 
            user: { id: user.id, email: user.email, fullName: user.full_name } 
        });
    });
});

// API: Social Auth (Mock)
app.post('/api/auth/social', (req, res) => {
    console.log('Social Auth request body:', req.body);
    const { email, fullName, provider } = req.body;
    const createdAt = Date.now();

    // Check if user exists
    db.get(`SELECT * FROM users WHERE email = ?`, [email], (err, user) => {
        if (err) {
            console.error('DB Select Error (Social):', err.message);
            return res.status(500).json({ error: 'Social Auth failed' });
        }
        if (user) {
            console.log('Existing social user found:', user.email);
            return res.json({ message: 'Login successful', user });
        }
        // Register if not exists
        db.run(`INSERT INTO users (email, full_name, provider, created_at) VALUES (?, ?, ?, ?)`,
            [email, fullName, provider, createdAt],
            function(err) {
                if (err) {
                    console.error('DB Insert Error (Social):', err.message);
                    return res.status(500).json({ error: 'Social Auth failed' });
                }
                console.log('New social user registered, ID:', this.lastID);
                res.json({ message: 'Registration successful', user: { id: this.lastID, email, fullName, provider } });
            }
        );
    });
});

// --- SESSION ROUTES ---
app.post('/api/session/start', (req, res) => {
    const sessionId = crypto.randomUUID();
    const startTime = Date.now();
    const { browser = 'Unknown', deviceType = 'Desktop' } = req.body;
    
    // Mock Country Detection (In real app, use GeoIP)
    const countries = ['USA', 'UK', 'India', 'Germany', 'Japan', 'Canada'];
    const country = countries[Math.floor(Math.random() * countries.length)];

    db.run(`INSERT INTO sessions (id, start_time, status, browser, device_type, country) VALUES (?, ?, 'active', ?, ?, ?)`, 
        [sessionId, startTime, browser, deviceType, country], 
        (err) => {
            if (err) {
                console.error('Error starting session:', err);
                return res.status(500).json({ error: 'Failed to start session' });
            }
            res.json({ sessionId, startTime });
        }
    );
});

// API: End Session
app.post('/api/session/end', (req, res) => {
    const { sessionId } = req.body;
    const endTime = Date.now();

    // Ideally, here we would also trigger analysis
    db.run(`UPDATE sessions SET end_time = ?, status = 'completed' WHERE id = ?`, 
        [endTime, sessionId], 
        (err) => {
            if (err) {
                console.error('Error ending session:', err);
                return res.status(500).json({ error: 'Failed to end session' });
            }
            // Trigger Analysis
            analyzeSession(sessionId); 
            
            res.json({ message: 'Session ended', endTime });
        }
    );
});

// API: Track Interaction
app.post('/api/track', (req, res) => {
    const { sessionId, eventType, targetElement, metadata, x, y, page } = req.body;
    const timestamp = Date.now();

    // Store metadata as JSON string if it's an object
    const metaString = typeof metadata === 'object' ? JSON.stringify(metadata) : metadata;

    db.run(`INSERT INTO interaction_logs (session_id, event_type, target_element, timestamp, metadata, x_pos, y_pos, page_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [sessionId, eventType, targetElement, timestamp, metaString, x || 0, y || 0, page],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            
            // Post-tracking analysis for Academic Metrics
            handleAcademicEvents(sessionId, eventType, metadata, page);
            
            res.json({ status: 'success' });
        }
    );
});

// Helper: Academic Logic
async function handleAcademicEvents(sessionId, type, meta, page) {
    let frictionPoints = 0;
    let reason = '';

    if (type === 'micro_hesitation') {
        frictionPoints = 10;
        reason = 'Micro-Hesitation';
    } else if (type === 'intent_mismatch') {
        frictionPoints = 25;
        reason = 'Intent Mismatch';
    } else if (type === 'rage_click') {
        frictionPoints = 15;
        reason = 'Rage Click';
    } else if (type === 'dead_click') {
        frictionPoints = 5;
        reason = 'Dead Click';
    } else if (type === 'decision_paralysis') {
        frictionPoints = meta.paralysis_score || 20;
        reason = 'Decision Paralysis';
    }

    if (frictionPoints > 0) {
        // Log to friction_scores
        db.run(`INSERT INTO friction_scores (session_id, screen_name, score, reason, timestamp) VALUES (?, ?, ?, ?, ?)`,
            [sessionId, page, frictionPoints, reason, Date.now()]);
        
        // Update UX Debt Index
        db.run(`INSERT INTO ux_debt_index (page_url, accumulated_friction, session_count, debt_index, last_updated) 
                VALUES (?, ?, 1, ?, ?) 
                ON CONFLICT(page_url) DO UPDATE SET 
                accumulated_friction = accumulated_friction + ?,
                session_count = session_count + 1,
                debt_index = (accumulated_friction + ?) / (session_count + 1),
                last_updated = ?`,
            [page, frictionPoints, frictionPoints, Date.now(), frictionPoints, frictionPoints, Date.now()]);

        // Store friction timeline snapshot
        db.run(`INSERT INTO friction_timeline (session_id, timestamp, friction_snapshot) VALUES (?, ?, ?)`,
            [sessionId, Date.now(), frictionPoints]);
    }

    // Advanced Analytics: Metadata Updates
    if (type === 'page_view' && meta) {
        if (meta.cognitive_load) {
            db.run(`UPDATE sessions SET cognitive_proxy_score = ? WHERE id = ?`, [meta.cognitive_load, sessionId]);
        }
        if (meta.is_returning_user !== undefined) {
            db.run(`UPDATE sessions SET is_returning_user = ? WHERE id = ?`, [meta.is_returning_user ? 1 : 0, sessionId]);
        }
        if (meta.entry_page) {
            db.run(`UPDATE sessions SET entry_page = ? WHERE id = ?`, [meta.entry_page, sessionId]);
        }
    }

    if (type === 'advanced_metrics_update' && meta) {
        db.run(`UPDATE sessions SET confidence_score = ?, click_waste_ratio = ?, decision_paralysis_score = ? WHERE id = ?`,
            [meta.confidence_score || 100, parseFloat(meta.click_waste_ratio) || 0, meta.paralysis_score || 0, sessionId]);
    }

    if (type === 'friction_recovery' && meta) {
        db.run(`UPDATE sessions SET recovery_detected = 1 WHERE id = ?`, [sessionId]);
    }

    if (type === 'page_complexity_warning' && meta) {
        db.run(`INSERT INTO issues (session_id, screen_name, severity, description, timestamp) VALUES (?, ?, 'Medium', ?, ?)`,
            [sessionId, page, `Page has ${meta.element_count} interactive elements (threshold: ${meta.threshold})`, Date.now()]);
    }

    // Re-classify session pattern
    classifyPrimaryPattern(sessionId);
}

async function classifyPrimaryPattern(sessionId) {
    db.all(`SELECT event_type FROM interaction_logs WHERE session_id = ?`, [sessionId], (err, logs) => {
        if (err || !logs.length) return;
        
        const counts = logs.reduce((acc, log) => {
            acc[log.event_type] = (acc[log.event_type] || 0) + 1;
            return acc;
        }, {});

        let pattern = 'Explorer';
        if (counts.rage_click > 0 || counts.intent_mismatch > 0) pattern = 'Frustrated';
        else if (logs.length < 5 && counts.page_view > 0) pattern = 'Efficient';
        else if (counts.micro_hesitation > 2) pattern = 'Hesitant';

        db.get(`SELECT SUM(score) as total FROM friction_scores WHERE session_id = ?`, [sessionId], (err, row) => {
            const total = row ? row.total : 0;
            let level = 'Low';
            if (total > 60) level = 'High';
            else if (total > 30) level = 'Medium';

            db.run(`UPDATE sessions SET primary_pattern = ?, friction_level = ?, total_friction_score = ? WHERE id = ?`, 
                [pattern, level, total, sessionId]);
        });
    });
}

// API: Dashboard Summary
app.get('/api/dashboard/summary', async (req, res) => {
    try {
        db.all("SELECT * FROM sessions", (err, rows) => {
            if (err) return res.status(500).json({ error: err.message });
            
            const total = rows.length;
            const completedOrAbandoned = rows.filter(r => r.status !== 'active');
            
            const totalScore = completedOrAbandoned.reduce((sum, r) => sum + (r.total_friction_score || 0), 0);
            const avgScore = completedOrAbandoned.length ? Math.round(totalScore / completedOrAbandoned.length) : 0;
            
            const abandoned = rows.filter(r => r.status === 'abandoned').length;
            
            res.json({
                totalSessions: total,
                avgFrictionScore: avgScore,
                abandonmentRate: total ? ((abandoned / total) * 100).toFixed(1) : 0
            });
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// API: Friction Scores by Screen
app.get('/api/dashboard/scores', (req, res) => {
    db.all('SELECT screen_name, AVG(score) as avg_score FROM friction_scores GROUP BY screen_name', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API: Issues List
app.get('/api/dashboard/issues', (req, res) => {
    db.all('SELECT * FROM issues ORDER BY timestamp DESC LIMIT 50', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API: Export Report (JSON/CSV)
app.get('/api/export', (req, res) => {
    const format = req.query.format || 'json';
    
    db.all('SELECT * FROM sessions', (err, sessions) => {
        if (err) return res.status(500).json({ error: err.message });
        
        db.all('SELECT * FROM issues', (err, issues) => {
            if (format === 'csv') {
                // Simplified CSV generation
                let csv = 'SessionID,Status,Score\n';
                sessions.forEach(s => csv += `${s.id},${s.status},${s.total_friction_score}\n`);
                csv += '\nIssues\nSessionID,Screen,Severity,Description\n';
                issues.forEach(i => csv += `${i.session_id},${i.screen_name},${i.severity},${i.description}\n`);
                
                res.header('Content-Type', 'text/csv');
                res.attachment('report.csv');
                return res.send(csv);
            }
            
            // JSON by default
            res.json({ sessions, issues });
        });
    });
});

// API: Real-time Stats (Summary)
app.get('/api/dashboard/stats', (req, res) => {
    db.serialize(() => {
        db.get('SELECT COUNT(*) as totalSessions FROM sessions', (err, sess) => {
            db.get('SELECT COUNT(*) as totalClicks FROM interaction_logs WHERE event_type = "click"', (err, clicks) => {
                db.get('SELECT page_url, COUNT(*) as count FROM interaction_logs WHERE event_type="click" GROUP BY page_url ORDER BY count DESC LIMIT 1', (err, topPage) => {
                    if (err) return res.status(500).json({ error: err.message });
                    const avg = sess.totalSessions ? (clicks.totalClicks / sess.totalSessions).toFixed(1) : 0;
                    res.json({
                        totalSessions: sess.totalSessions,
                        totalClicks: clicks.totalClicks,
                        avgClicksPerSession: avg,
                        mostClickedPage: topPage ? topPage.page_url : 'N/A'
                    });
                });
            });
        });
    });
});

// API: Friction Breakdown (Stacked Bar)
app.get('/api/dashboard/friction-breakdown', (req, res) => {
    // Average scores per screen
    db.all(`SELECT screen_name, 
            AVG(click_score) as click, 
            AVG(time_score) as time, 
            AVG(nav_score) as nav 
            FROM friction_scores 
            GROUP BY screen_name`, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API: Page Metrics (Line interactions)
app.get('/api/dashboard/metrics', (req, res) => {
     db.all(`SELECT page_url, 
             AVG(time_to_first_click) as avg_tti,
             AVG(max_scroll_depth) as avg_scroll,
             SUM(is_abandoned) as total_abandoned
             FROM page_metrics 
             GROUP BY page_url`, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API: Dead Clicks per Page
app.get('/api/dashboard/dead-clicks', (req, res) => {
    db.all(`SELECT page_url, COUNT(*) as count 
            FROM interaction_logs 
            WHERE event_type='dead_click' 
            GROUP BY page_url`, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API: User Journey Funnels
app.get('/api/dashboard/funnels', (req, res) => {
    // Define the standard funnel stages
    const stages = ['/home', '/signup', '/dashboard']; 
    
    db.all(`SELECT session_id, page_url, MIN(timestamp) as first_visit 
            FROM interaction_logs 
            WHERE page_url IN (${stages.map(() => '?').join(',')})
            GROUP BY session_id, page_url 
            ORDER BY session_id, first_visit`, stages, (err, logs) => {
        if (err) return res.status(500).json({ error: err.message });

        const sessionJourneys = {};
        logs.forEach(log => {
            if (!sessionJourneys[log.session_id]) sessionJourneys[log.session_id] = [];
            sessionJourneys[log.session_id].push(log.page_url);
        });

        const funnelCounts = stages.map(stage => ({ stage, count: 0 }));
        
        Object.values(sessionJourneys).forEach(path => {
            for (let i = 0; i < stages.length; i++) {
                if (path.includes(stages[i])) {
                    // Check if it's a valid sequential step or just "any step reached"
                    // For now, let's count if they reached the stage at all in their session
                    funnelCounts[i].count++;
                } else {
                    break; // Funnel logic: must hit stage i to be counted for i+1
                }
            }
        });

        res.json(funnelCounts);
    });
});

// API: Live Sessions Feed (Enhanced)
app.get('/api/dashboard/live-sessions', (req, res) => {
    const query = `
        SELECT s.id, s.start_time, s.status, s.country, s.browser, s.device_type,
               (SELECT page_url FROM interaction_logs WHERE session_id = s.id ORDER BY timestamp DESC LIMIT 1) as current_page,
               (SELECT target_element FROM interaction_logs WHERE session_id = s.id ORDER BY timestamp DESC LIMIT 1) as last_element,
               (SELECT timestamp FROM interaction_logs WHERE session_id = s.id ORDER BY timestamp DESC LIMIT 1) as last_interaction,
               (SELECT MIN(timestamp) FROM interaction_logs WHERE session_id = s.id AND page_url = (SELECT page_url FROM interaction_logs WHERE session_id = s.id ORDER BY timestamp DESC LIMIT 1)) as page_start_time
        FROM sessions s
        WHERE s.status = 'active' OR s.start_time > (strftime('%s','now') * 1000 - 600000) -- Active or started in last 10 mins
        ORDER BY s.start_time DESC
        LIMIT 20
    `;
    
    db.all(query, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const processedRows = rows.map(r => ({
            ...r,
            duration_on_page: r.last_interaction && r.page_start_time ? Math.floor((r.last_interaction - r.page_start_time) / 1000) : 0
        }));
        
        res.json(processedRows);
    });
});

// API: Geo Distribution
app.get('/api/dashboard/geo-distribution', (req, res) => {
    db.all(`SELECT country, COUNT(*) as count, AVG(total_friction_score) as avg_friction FROM sessions GROUP BY country`, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API: Device & Browser Distribution
app.get('/api/dashboard/device-distribution', (req, res) => {
    db.all(`SELECT device_type, browser, COUNT(*) as count FROM sessions GROUP BY device_type, browser`, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API: A/B Simulation (Mocked Prediction)
app.get('/api/dashboard/ab-simulation', (req, res) => {
    const { element, adjustment } = req.query;
    // Prediction logic: random reduction in friction if moved to 'center'
    const baseFriction = Math.floor(Math.random() * 40) + 20;
    const predictedFriction = adjustment === 'center' ? baseFriction * 0.7 : baseFriction * 1.1;
    
    res.json({
        element: element || 'Main Button',
        currentFriction: baseFriction,
        predictedFriction: Math.round(predictedFriction),
        improvement: adjustment === 'center' ? '30%' : '-10%',
        recommendation: adjustment === 'center' ? 'Proceed with change' : 'Re-evaluate design'
    });
});

// API: Accessibility Auditor
app.get('/api/dashboard/acc-report', (req, res) => {
    db.all(`SELECT target_element, page_url, COUNT(*) as dead_click_count 
            FROM interaction_logs 
            WHERE event_type='dead_click' 
            GROUP BY target_element, page_url 
            HAVING dead_click_count > 5`, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        
        const reports = rows.map(r => ({
            element: r.target_element,
            page: r.page_url,
            issue: 'High Dead Click Volume',
            severity: 'High',
            recommendation: 'Target element is too small or non-interactive. Add aria-label or increase hit box.'
        }));
        
        res.json(reports);
    });
});

// API: Custom Alerts
app.get('/api/dashboard/alerts', (req, res) => {
    db.all(`SELECT s.id, s.total_friction_score, i.screen_name 
            FROM sessions s 
            JOIN friction_scores i ON s.id = i.session_id 
            WHERE i.score > 80 
            ORDER BY s.start_time DESC LIMIT 10`, (err, rows) => {
        if (err) res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API: Charts Data (Pie & Line legacy support + new)
app.get('/api/dashboard/charts', (req, res) => {
    const charts = { pie: {}, line: {} };
    
    // Pie: Clicks per Page
    db.all('SELECT page_url, COUNT(*) as count FROM interaction_logs WHERE event_type="click" GROUP BY page_url', (err, rows) => {
        charts.pie = rows;
        
        // Line: Clicks over Time (Sessions)
        db.all('SELECT session_id, COUNT(*) as count FROM interaction_logs WHERE event_type="click" GROUP BY session_id LIMIT 20', (err, timeline) => {
            charts.line = timeline;
            res.json(charts);
        });
    });
});

// API: Heatmap Data
app.get('/api/dashboard/heatmap/:page', (req, res) => {
    const page = decodeURIComponent(req.params.page); // e.g., '/home'
    // Simple exact match or like query
    db.all('SELECT x_pos, y_pos FROM interaction_logs WHERE event_type="click" AND page_url = ?', [page], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows); // Returns array of {x, y}
    });
});

// API: Top Elements
app.get('/api/dashboard/elements', (req, res) => {
    db.all('SELECT target_element, COUNT(*) as count FROM interaction_logs WHERE event_type="click" GROUP BY target_element ORDER BY count DESC LIMIT 10', (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API: Academic Dashboard Stats
app.get('/api/dashboard/academic-stats', (req, res) => {
    const stats = {};
    
    // 1. Pattern Distribution
    db.all(`SELECT primary_pattern, COUNT(*) as count FROM sessions GROUP BY primary_pattern`, (err, patterns) => {
        stats.patterns = patterns;
        
        // 2. UX Debt Leaderboard
        db.all(`SELECT page_url, debt_index FROM ux_debt_index ORDER BY debt_index DESC LIMIT 10`, (err, debt) => {
            stats.uxDebt = debt;
            
            // 3. Friction Escalation (Latest Sessions)
            db.all(`SELECT id, friction_level, total_friction_score, primary_pattern FROM sessions ORDER BY start_time DESC LIMIT 10`, (err, escalation) => {
                stats.escalation = escalation;
                
                // 4. Cognitive Load Proxy
                db.all(`SELECT page_url, AVG(cognitive_proxy_score) as avg_load FROM interaction_logs l JOIN sessions s ON l.session_id = s.id WHERE event_type='page_view' GROUP BY page_url`, (err, load) => {
                    stats.cognitiveLoad = load;
                    res.json(stats);
                });
            });
        });
    });
});

// API: Academic Dashboard Stats
app.get('/api/dashboard/academic-stats', (req, res) => {
    const stats = {};
    
    // 1. Pattern Distribution
    db.all(`SELECT primary_pattern, COUNT(*) as count FROM sessions GROUP BY primary_pattern`, (err, patterns) => {
        stats.patterns = patterns;
        
        // 2. UX Debt Leaderboard
        db.all(`SELECT page_url, debt_index FROM ux_debt_index ORDER BY debt_index DESC LIMIT 10`, (err, debt) => {
            stats.uxDebt = debt;
            
            // 3. Friction Escalation (Latest Sessions)
            db.all(`SELECT id, friction_level, total_friction_score, primary_pattern FROM sessions ORDER BY start_time DESC LIMIT 10`, (err, escalation) => {
                stats.escalation = escalation;
                
                // 4. Cognitive Load Proxy
                db.all(`SELECT page_url, AVG(cognitive_proxy_score) as avg_load FROM interaction_logs l JOIN sessions s ON l.session_id = s.id WHERE event_type='page_view' GROUP BY page_url`, (err, load) => {
                    stats.cognitiveLoad = load;
                    res.json(stats);
                });
            });
        });
    });
});

// API: Sessions List (For viewer)
app.get('/api/dashboard/sessions-list', (req, res) => {
    db.all(`SELECT id, start_time, status, browser, device_type, country, total_friction_score 
            FROM sessions ORDER BY start_time DESC LIMIT 100`, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API: Session Events (Chronological Journey)
app.get('/api/dashboard/sessions/:sessionId/events', (req, res) => {
    const { sessionId } = req.params;
    db.all(`SELECT * FROM interaction_logs WHERE session_id = ? ORDER BY timestamp ASC`, [sessionId], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// API: Advanced Analytics Stats
app.get('/api/dashboard/advanced-stats', (req, res) => {
    const stats = {};
    
    // 1. Confidence Score Average
    db.get(`SELECT 
        AVG(confidence_score) as avg_confidence,
        AVG(quality_score) as avg_quality,
        AVG(attention_drift_score) as avg_drift,
        AVG(interaction_density_score) as avg_density,
        AVG(entry_expectation_score) as avg_entry_expectation,
        AVG(friction_confidence_score) as avg_friction_confidence
        FROM sessions WHERE confidence_score IS NOT NULL`, (err, conf) => {
        stats.avgConfidence = conf ? conf.avg_confidence : 100;
        stats.avgQuality = conf ? conf.avg_quality : 100;
        stats.avgDrift = conf ? conf.avg_drift : 0;
        stats.avgDensity = conf ? conf.avg_density : 0;
        stats.avgEntryExpectation = conf ? conf.avg_entry_expectation : 0;
        stats.frictionConfidence = conf ? conf.avg_friction_confidence : 0;
        
        // 2. First-Time vs Returning Comparison
        db.all(`SELECT is_returning_user, AVG(total_friction_score) as avg_friction, COUNT(*) as count FROM sessions GROUP BY is_returning_user`, (err, comparison) => {
            stats.userComparison = comparison;
            
            // 3. Entry-Point Friction Analysis
            db.all(`SELECT entry_page, AVG(total_friction_score) as avg_friction, COUNT(*) as visits FROM sessions WHERE entry_page IS NOT NULL GROUP BY entry_page ORDER BY avg_friction DESC LIMIT 10`, (err, entryPoints) => {
                stats.entryPointFriction = entryPoints;
                
                // 4. Recovery Rate
                db.get(`SELECT 
                    COUNT(CASE WHEN recovery_detected = 1 THEN 1 END) as recovered,
                    COUNT(*) as total 
                    FROM sessions WHERE total_friction_score > 0`, (err, recovery) => {
                    stats.recoveryRate = recovery ? ((recovery.recovered / recovery.total) * 100).toFixed(1) : 0;
                    stats.recoveryStats = recovery;
                    
                    // 5. Decision Paralysis Alerts
                    db.all(`SELECT id, decision_paralysis_score, entry_page FROM sessions WHERE decision_paralysis_score > 30 ORDER BY decision_paralysis_score DESC LIMIT 10`, (err, paralysis) => {
                        stats.decisionParalysis = paralysis;
                        
                        // 6. Click Efficiency (Waste Ratio)
                        db.all(`SELECT id, click_waste_ratio, total_friction_score FROM sessions WHERE click_waste_ratio > 0 ORDER BY click_waste_ratio DESC LIMIT 10`, (err, efficiency) => {
                            stats.clickEfficiency = efficiency;
                            
                            // 7. Friction Evolution (Timeseries for last session)
                            db.all(`SELECT session_id, timestamp, friction_snapshot FROM friction_timeline ORDER BY timestamp DESC LIMIT 50`, (err, evolution) => {
                                stats.frictionEvolution = evolution;
                                
                                // 8. Page Complexity Warnings
                                db.all(`SELECT screen_name, COUNT(*) as warning_count FROM issues WHERE description LIKE '%interactive elements%' GROUP BY screen_name ORDER BY warning_count DESC LIMIT 5`, (err, complexity) => {
                                    stats.complexityWarnings = complexity;
                                    res.json(stats);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

// API: UX Regression Tracking
app.post('/api/dashboard/version-snapshot', (req, res) => {
    const { versionId } = req.body;
    
    if (!versionId) return res.status(400).json({ error: 'versionId required' });
    
    // Calculate current average friction
    db.get(`SELECT AVG(total_friction_score) as avg_friction, COUNT(*) as total FROM sessions WHERE status = 'completed'`, (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        
        db.run(`INSERT INTO version_snapshots (version_id, avg_friction, total_sessions, timestamp) VALUES (?, ?, ?, ?)`,
            [versionId, row.avg_friction || 0, row.total || 0, Date.now()], (err) => {
                if (err) return res.status(500).json({ error: 'Version already exists or DB error' });
                res.json({ message: 'Version snapshot created', avgFriction: row.avg_friction });
            });
    });
});

app.get('/api/dashboard/version-regression', (req, res) => {
    db.all(`SELECT * FROM version_snapshots ORDER BY timestamp DESC LIMIT 10`, (err, versions) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ versions });
    });
});

// API: Live Interaction Feed (Real-time Events)
app.get('/api/dashboard/live-feed', (req, res) => {
    db.all(`SELECT id, session_id, event_type, target_element, timestamp, page_url, x_pos, y_pos 
            FROM interaction_logs 
            ORDER BY timestamp DESC 
            LIMIT 50`, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
