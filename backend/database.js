const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'friction.db');

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        // Enable WAL mode for better concurrency
        db.run('PRAGMA journal_mode = WAL;', (err) => {
            if (err) {
                console.error('Failed to enable WAL mode:', err.message);
            } else {
                console.log('WAL mode enabled.');
            }
            initializeDatabase();
        });
    }
});

function initializeDatabase() {
    db.serialize(() => {
        // Sessions Table
        db.run(`CREATE TABLE IF NOT EXISTS sessions (
            id TEXT PRIMARY KEY,
            start_time INTEGER,
            end_time INTEGER,
            status TEXT DEFAULT 'active', -- 'active', 'completed', 'abandoned'
            total_friction_score REAL,
            country TEXT,
            device_type TEXT,
            browser TEXT,
            friction_level TEXT DEFAULT 'Low', -- 'Low', 'Medium', 'High'
            primary_pattern TEXT DEFAULT 'Neutral', -- 'Explorer', 'Frustrated', 'Efficient', etc.
            cognitive_proxy_score REAL DEFAULT 0,
            -- Advanced Analytics
            is_returning_user INTEGER DEFAULT 0,
            entry_page TEXT,
            confidence_score REAL DEFAULT 100,
            recovery_detected INTEGER DEFAULT 0,
            decision_paralysis_score REAL DEFAULT 0,
            click_waste_ratio REAL DEFAULT 0,
            -- Advanced Metrics (Tier 1 & 2)
            quality_score REAL DEFAULT 100,
            attention_drift_score REAL DEFAULT 0,
            interaction_density_score REAL DEFAULT 0,
            entry_expectation_score REAL DEFAULT 0,
            friction_confidence_score REAL DEFAULT 0
        )`);

        // Interaction Logs Table
        db.run(`CREATE TABLE IF NOT EXISTS interaction_logs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            event_type TEXT, -- 'click', 'navigation', 'scroll', 'input'
            target_element TEXT,
            timestamp INTEGER,
            metadata TEXT,
            x_pos INTEGER,
            y_pos INTEGER,
            page_url TEXT,
            FOREIGN KEY(session_id) REFERENCES sessions(id)
        )`);

        // Friction Scores Table - Added Reason for Explainability
        db.run(`CREATE TABLE IF NOT EXISTS friction_scores (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            screen_name TEXT,
            score REAL,
            click_score REAL,
            time_score REAL,
            nav_score REAL,
            reason TEXT, -- e.g., 'Rage Click', 'Slow Hesitation', 'Intent Mismatch'
            timestamp INTEGER,
            FOREIGN KEY(session_id) REFERENCES sessions(id)
        )`);

        // UX Debt Index Table
        db.run(`CREATE TABLE IF NOT EXISTS ux_debt_index (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            page_url TEXT UNIQUE,
            accumulated_friction REAL DEFAULT 0,
            session_count INTEGER DEFAULT 0,
            debt_index REAL DEFAULT 0,
            last_updated INTEGER
        )`);

        // Page Metrics Table
        db.run(`CREATE TABLE IF NOT EXISTS page_metrics (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            page_url TEXT,
            time_to_first_click INTEGER,
            max_scroll_depth INTEGER,
            click_count INTEGER,
            is_abandoned INTEGER DEFAULT 0,
            timestamp INTEGER,
            FOREIGN KEY(session_id) REFERENCES sessions(id)
        )`);

        // Issues Table
        db.run(`CREATE TABLE IF NOT EXISTS issues (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            screen_name TEXT,
            severity TEXT, -- 'Low', 'Medium', 'High'
            description TEXT,
            timestamp INTEGER,
            FOREIGN KEY(session_id) REFERENCES sessions(id)
        )`);

        // Users Table
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE,
            password TEXT,
            full_name TEXT,
            provider TEXT DEFAULT 'local',
            created_at INTEGER
        )`);

        // Version Snapshots Table (UX Regression Tracking)
        db.run(`CREATE TABLE IF NOT EXISTS version_snapshots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            version_id TEXT UNIQUE,
            avg_friction REAL,
            total_sessions INTEGER,
            timestamp INTEGER
        )`);

        // Friction Timeline Table (Heat Evolution)
        db.run(`CREATE TABLE IF NOT EXISTS friction_timeline (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            timestamp INTEGER,
            friction_snapshot REAL,
            FOREIGN KEY(session_id) REFERENCES sessions(id)
        )`);

        console.log('Database tables initialized.');

        // Migration for existing databases
        const columnsToAdd = [
            { name: 'country', type: 'TEXT' },
            { name: 'device_type', type: 'TEXT' },
            { name: 'browser', type: 'TEXT' },
            { name: 'friction_level', type: 'TEXT' },
            { name: 'primary_pattern', type: 'TEXT' },
            { name: 'cognitive_proxy_score', type: 'REAL' },
            { name: 'is_returning_user', type: 'INTEGER' },
            { name: 'entry_page', type: 'TEXT' },
            { name: 'confidence_score', type: 'REAL' },
            { name: 'recovery_detected', type: 'INTEGER' },
            { name: 'decision_paralysis_score', type: 'REAL' },
            { name: 'click_waste_ratio', type: 'REAL' },
            { name: 'quality_score', type: 'REAL' },
            { name: 'attention_drift_score', type: 'REAL' },
            { name: 'interaction_density_score', type: 'REAL' },
            { name: 'entry_expectation_score', type: 'REAL' },
            { name: 'friction_confidence_score', type: 'REAL' }
        ];

        columnsToAdd.forEach(column => {
            db.get(`PRAGMA table_info(sessions)`, (err, tableInfo) => {
                if (err) return;
                // Check if column already exists
                db.all(`PRAGMA table_info(sessions)`, (err, rows) => {
                    if (rows && !rows.find(row => row.name === column.name)) {
                        db.run(`ALTER TABLE sessions ADD COLUMN ${column.name} ${column.type}`, (err) => {
                            if (!err) console.log(`Added column ${column.name} to sessions table.`);
                        });
                    }
                });
            });
        });

        // Migration for Users table (add provider if missing)
        db.all(`PRAGMA table_info(users)`, (err, rows) => {
            if (rows && !rows.find(row => row.name === 'provider')) {
                db.run(`ALTER TABLE users ADD COLUMN provider TEXT DEFAULT 'local'`, (err) => {
                    if (!err) console.log(`Added column provider to users table.`);
                });
            }
        });
    });
}

module.exports = db;
