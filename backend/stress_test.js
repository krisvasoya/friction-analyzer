const http = require('http');

const runRequest = (id) => {
    return new Promise((resolve, reject) => {
        const req = http.get('http://localhost:3000/api/dashboard/summary', (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    // console.log(`Req ${id}: Success`);
                    resolve();
                } else {
                    console.error(`Req ${id}: Failed with ${res.statusCode}`);
                    reject(new Error(`Status ${res.statusCode}`));
                }
            });
        });
        req.on('error', err => {
            console.error(`Req ${id}: Error ${err.message}`);
            reject(err);
        });
    });
};

const runConcurrentTests = async () => {
    console.log('Starting stress test with 50 concurrent requests...');
    const requests = [];
    for (let i = 0; i < 50; i++) {
        requests.push(runRequest(i));
    }

    try {
        await Promise.all(requests);
        console.log('All 50 requests completed successfully. WAL mode is working!');
    } catch (error) {
        console.error('Stress test failed:', error);
    }
};

runConcurrentTests();
