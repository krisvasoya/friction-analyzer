const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'friction.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log('Connected to the SQLite database for migration.');
});

db.serialize(() => {
    // Add missing 'timestamp' column to friction_scores
    db.run("ALTER TABLE friction_scores ADD COLUMN timestamp INTEGER", (err) => {
        if (err) {
            if (err.message.includes('duplicate column name')) {
                console.log('Column "timestamp" already exists.');
            } else {
                console.error('Error adding column:', err.message);
            }
        } else {
            console.log('Successfully added "timestamp" column to friction_scores.');
        }
    });

    // Verify
    db.all("PRAGMA table_info(friction_scores)", (err, rows) => {
        if (err) console.error(err.message);
        else console.log('friction_scores columns:', rows.map(r => r.name));
    });
});

db.close();
