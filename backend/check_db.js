const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'friction.db');
const db = new sqlite3.Database(dbPath, sqlite3.OPEN_READONLY, (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log('Connected to the SQLite database.');
});

db.serialize(() => {
    db.get("SELECT count(*) as count FROM users", (err, row) => {
        if (err) console.error(err.message);
        else console.log('Users count:', row.count);
    });
    db.get("SELECT count(*) as count FROM sessions", (err, row) => {
        if (err) console.error(err.message);
        else console.log('Sessions count:', row.count);
    });
    db.all("PRAGMA table_info(friction_scores)", (err, rows) => {
        if (err) console.error(err.message);
        else console.log('friction_scores columns:', rows.map(r => r.name));
    });
});

db.close();
