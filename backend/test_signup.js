const http = require('http');

const data = JSON.stringify({
    email: 'CHECK_DB_EMAIL_PLACEHOLDER', // Will replace manually or just use the one found
    password: 'password123' // Try common passwords or just check response
});

// Since I don't know the password, I can't really login easily unless I reset it.
// But I can try to signup a NEW user to verify the flow.

// Better approach: Test SIGNUP with a random user.

const randomUser = 'user' + Math.floor(Math.random() * 10000);
const signupData = JSON.stringify({
    fullName: 'Test User',
    email: `${randomUser}@example.com`,
    password: 'password123'
});

const options = {
    hostname: 'localhost',
    port: 3000,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': signupData.length
    }
};

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log(`BODY: ${chunk}`);
    });
});

req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
});

req.write(signupData);
req.end();
