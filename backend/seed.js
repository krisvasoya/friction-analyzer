const db = require('./database');
const crypto = require('crypto');

const screens = ['/login', '/form', '/confirmation', '/home', '/services', '/details'];
const eventTypes = ['click', 'dead_click', 'rage_click', 'scroll_depth', 'time_to_first_click'];

const seedSessions = (count = 10) => {
    for (let i = 0; i < count; i++) {
        const sessionId = crypto.randomUUID();
        const startTime = Date.now() - Math.floor(Math.random() * 10000000);
        const status = Math.random() > 0.2 ? 'completed' : 'abandoned';
        
        db.run(`INSERT INTO sessions (id, start_time, status, total_friction_score) VALUES (?, ?, ?, ?)`,
            [sessionId, startTime, status, Math.floor(Math.random() * 100)],
            (err) => {
                if (err) return console.error(err);
                seedLogs(sessionId, startTime);
                seedMetrics(sessionId, startTime);
            }
        );
    }
    console.log(`Seeding ${count} sessions...`);
};

const seedLogs = (sessionId, startTime) => {
    screens.forEach(screen => {
        // Random clicks
        const clicks = Math.floor(Math.random() * 10);
        for (let j = 0; j < clicks; j++) {
            db.run(`INSERT INTO interaction_logs (session_id, event_type, target_element, timestamp, page_url, x_pos, y_pos) 
                VALUES (?, 'click', 'button-${j}', ?, ?, ?, ?)`,
                [sessionId, startTime + j * 1000, screen, Math.floor(Math.random() * 1000), Math.floor(Math.random() * 800)]);
        }

        // Dead clicks
        if (Math.random() > 0.5) {
            db.run(`INSERT INTO interaction_logs (session_id, event_type, target_element, timestamp, page_url) 
                VALUES (?, 'dead_click', 'div-empty', ?, ?)`,
                [sessionId, startTime + 500, screen]);
        }

        // Rage clicks
        if (Math.random() > 0.7) {
            db.run(`INSERT INTO interaction_logs (session_id, event_type, target_element, timestamp, page_url) 
                VALUES (?, 'rage_click', 'submit-btn', ?, ?)`,
                [sessionId, startTime + 2000, screen]);
        }
    });
};

const seedMetrics = (sessionId, startTime) => {
    screens.forEach(screen => {
        db.run(`INSERT INTO page_metrics (session_id, page_url, time_to_first_click, max_scroll_depth, click_count, is_abandoned, timestamp) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [sessionId, screen, Math.floor(Math.random() * 8000), Math.floor(Math.random() * 100), Math.floor(Math.random() * 20), Math.random() > 0.8 ? 1 : 0, startTime]);
        
        db.run(`INSERT INTO friction_scores (session_id, screen_name, score, click_score, time_score, nav_score) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [sessionId, screen, Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100]);
    });
};

seedSessions(15);
setTimeout(() => {
    console.log("Seeding complete. Exit with Ctrl+C");
    process.exit();
}, 2000);
