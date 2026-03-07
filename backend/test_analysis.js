const http = require('http');

function request(path, method, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: { 'Content-Type': 'application/json' }
        };
        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => resolve(JSON.parse(body)));
        });
        req.on('error', reject);
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

async function runScenario() {
    try {
        console.log('1. Start Session');
        const { sessionId } = await request('/api/session/start', 'POST', {});
        console.log('Session:', sessionId);

        console.log('2. Simulate Rage Clicks (4 clicks in < 1s)');
        for(let i=0; i<4; i++) {
            await request('/api/track', 'POST', {
                sessionId, eventType: 'click', targetElement: 'buggy-button', metadata: { page: '/login' }
            });
        }

        console.log('3. Simulate Abandonment (End session without Confirmation)');
        // Just end it
        await request('/api/session/end', 'POST', { sessionId });

        console.log('4. Wait for Analysis (Async)...');
        await delay(2000); 

        // 5. Verify Database
        const db = require('./database');
        db.get('SELECT * FROM sessions WHERE id = ?', [sessionId], (err, row) => {
            if (err) console.error(err);
            console.log('Session Result:', row);
            
            db.all('SELECT * FROM issues WHERE session_id = ?', [sessionId], (err, issues) => {
                console.log('Issues Found:', issues);
                
                const hasRageClick = issues.find(i => i.description.includes('Rage click'));
                const hasAbandon = issues.find(i => i.description.includes('Abandoned'));
                
                if (hasRageClick && hasAbandon) {
                    console.log('SUCCESS: Rage click and Abandonment detected.');
                    process.exit(0);
                } else {
                    console.log('FAILURE: Issues missing.');
                    process.exit(1);
                }
            });
        });

    } catch (e) {
        console.error(e);
    }
}

// Start server first? No, server.js needs to be running separately or we require it?
// We will run this script while `node server.js` is running in another proc.
runScenario();
