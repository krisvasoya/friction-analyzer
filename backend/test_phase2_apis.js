const http = require('http');

function get(path) {
    return new Promise((resolve, reject) => {
        http.get(`http://localhost:3000${path}`, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

async function test() {
    console.log('Testing Phase 2 APIs...');
    
    try {
        const stats = await get('/api/dashboard/stats');
        console.log('Stats:', stats);
        if (stats.totalClicks === undefined) throw new Error('Stats API missing fields');

        const charts = await get('/api/dashboard/charts');
        console.log('Charts Keys:', Object.keys(charts));
        if (!charts.pie || !charts.line) throw new Error('Charts API missing pie/line data');

        const heatmap = await get('/api/dashboard/heatmap/%2F'); // Test home page
        console.log('Heatmap Points:', heatmap.length);
        
        const elements = await get('/api/dashboard/elements');
        console.log('Top Elements:', elements.length);

        console.log('SUCCESS: All Phase 2 APIs are working.');
    } catch (e) {
        console.error('FAILURE:', e.message);
        process.exit(1);
    }
}

test();
