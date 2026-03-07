import React, { useEffect } from 'react';
import { api } from '../api';

export default function Confirmation({ sessionId }) {
    useEffect(() => {
        api.track(sessionId, 'page_view', '/confirmation');
        
        // End session on confirmation load
        api.endSession(sessionId);
    }, [sessionId]);

    return (
        <div className="container" style={{textAlign: 'center'}}>
            <h1>Success!</h1>
            <p>Your submission has been received.</p>
            <div className="card">
                <p>Thank you for using our service.</p>
                <button onClick={() => window.location.href = '/'}>Start New Session</button>
                <div style={{marginTop: '20px'}}>
                    <a href="/dashboard">Go to Admin Dashboard</a>
                </div>
            </div>
        </div>
    );
}
