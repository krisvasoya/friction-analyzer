import React, { useEffect, useState } from 'react';

export default function TopElements() {
    const [elements, setElements] = useState([]);

    useEffect(() => {
        const fetchElements = async () => {
            try {
                const res = await fetch('http://localhost:3000/api/dashboard/elements');
                const data = await res.json();
                setElements(data);
            } catch (e) { console.error(e); }
        };
        fetchElements();
    }, []);

    return (
        <div className="card">
            <h3>Top Clicked Elements</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
                {elements.map((el, i) => (
                    <li key={i} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        padding: '10px 0',
                        borderBottom: '1px solid #f3f4f6'
                    }}>
                        <span style={{ fontFamily: 'monospace', color: '#6b7280' }}>
                            {el.target_element || 'Generic Body'}
                        </span>
                        <span style={{ fontWeight: 'bold' }}>{el.count} clicks</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
