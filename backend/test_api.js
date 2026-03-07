const http = require('http');

function request(path, method, data) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let body = '';
            res.on('data', (chunk) => body += chunk);
            res.on('end', () => resolve(JSON.parse(body)));
        });

        req.on('error', (e) => reject(e));
        if (data) req.write(JSON.stringify(data));
        req.end();
    });
}

async function test() {
    try {
        // 1. Start Session
        console.log('Starting session...');
        const startRes = await request('/api/session/start', 'POST', {});
        console.log('Start Res:', startRes);
        const sessionId = startRes.sessionId;

        if (!sessionId) throw new Error('No session ID returned');

        // 2. Track Interaction
        console.log('Tracking interaction...');
        const trackRes = await request('/api/track', 'POST', {
            sessionId: sessionId,
            eventType: 'click',
            targetElement: 'submit-btn',
            metadata: { x: 100, y: 200 }
        });
        console.log('Track Res:', trackRes);

        // 3. End Session
        console.log('Ending session...');
        const endRes = await request('/api/session/end', 'POST', { sessionId });
        console.log('End Res:', endRes);

        console.log('API Test Passed');
        process.exit(0);
    } catch (e) {
        console.error('API Test Failed:', e);
        process.exit(1);
    }
}

// Wait for server to be ready? We assume server is running. 
// Ah, I need to start the server first!
// I will assume the server is NOT running and start it in this script?
// No, better to start server in background and run this.

test();
