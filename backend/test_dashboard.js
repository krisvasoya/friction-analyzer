const http = require('http');

function request(path) {
    return new Promise((resolve, reject) => {
        http.get({ hostname: 'localhost', port: 3000, path }, (res) => {
            let body = '';
            res.on('data', c => body += c);
            res.on('end', () => resolve({ body, headers: res.headers }));
        }).on('error', reject);
    });
}

async function test() {
    try {
        console.log('Testing Dashboard Summary...');
        const summary = await request('/api/dashboard/summary');
        console.log('Summary:', JSON.parse(summary.body));

        console.log('Testing Issues List...');
        const issues = await request('/api/dashboard/issues');
        console.log('Issues Count:', JSON.parse(issues.body).length);

        console.log('Testing Export CSV...');
        const csv = await request('/api/export?format=csv');
        console.log('CSV Headers:', csv.headers['content-type']);
        console.log('CSV Start:', csv.body.substring(0, 50));

        if (csv.body.startsWith('SessionID,Status,Score')) {
            console.log('SUCCESS: Dashboard APIs working.');
            process.exit(0);
        } else {
            console.log('FAILURE: CSV format incorrect.');
            process.exit(1);
        }

    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

test();
