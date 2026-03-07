const db = require('./database');

db.get('SELECT COUNT(*) as total FROM sessions', (err, row) => {
    if (err) console.error('Total Query Error:', err);
    else console.log('Total:', row);
});

db.get('SELECT AVG(total_friction_score) as avgScore FROM sessions WHERE status != "active"', (err, row) => {
    if (err) console.error('Avg Query Error:', err);
    else console.log('Avg:', row);
});

db.get('SELECT COUNT(*) as abandoned FROM sessions WHERE status = "abandoned"', (err, row) => {
    if (err) console.error('Aban Query Error:', err);
    else console.log('Abandoned:', row);
});
