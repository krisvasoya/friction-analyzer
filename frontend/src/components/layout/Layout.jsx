import React from 'react';
import Navbar from './Navbar';
import Tracker from '../common/Tracker';

export default function Layout({ children, sessionId }) {
    return (
        <div className="app-layout">
            <Tracker sessionId={sessionId} />
            <Navbar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
