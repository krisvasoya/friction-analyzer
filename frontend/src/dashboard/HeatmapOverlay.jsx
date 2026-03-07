import React, { useEffect, useState } from 'react';

export default function HeatmapOverlay() {
    const [page, setPage] = useState('/login');
    const [clicks, setClicks] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/dashboard/heatmap/${encodeURIComponent(page)}`);
                const data = await res.json();
                setClicks(data);
            } catch (e) { console.error(e); }
        };
        fetchData();
        const interval = setInterval(fetchData, 5000);
        return () => clearInterval(interval);
    }, [page]);

    // Grid Configuration
    const cellSize = 50;
    const rows = 20; // ~1000px height
    const cols = 30; // ~1500px width
    const grid = Array(rows).fill().map(() => Array(cols).fill(0));
    let maxClicks = 0;

    // Populate grid
    clicks.forEach(c => {
        const gx = Math.floor(c.x_pos / cellSize);
        const gy = Math.floor(c.y_pos / cellSize);
        if (gy < rows && gx < cols) {
            grid[gy][gx] += 1;
            if (grid[gy][gx] > maxClicks) maxClicks = grid[gy][gx];
        }
    });

    return (
        <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3>Click Heatmap</h3>
                <select value={page} onChange={e => setPage(e.target.value)} style={{ padding: '0.5rem' }}>
                    <option value="/">Home</option>
                    <option value="/login">Login</option>
                    <option value="/services">Services</option>
                    <option value="/details">Details</option>
                    <option value="/form">Form</option>
                </select>
            </div>
            
            <div style={{ 
                overflow: 'auto', 
                maxHeight: '500px', 
                background: '#f9fafb', 
                position: 'relative',
                border: '1px solid #e5e7eb'
            }}>
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
                    width: 'fit-content' 
                }}>
                    {grid.map((row, r) => (
                        row.map((count, c) => {
                            const intensity = maxClicks > 0 ? count / maxClicks : 0;
                            return (
                                <div key={`${r}-${c}`} style={{
                                    width: cellSize,
                                    height: cellSize,
                                    backgroundColor: count > 0 ? `rgba(255, 0, 0, ${Math.max(0.1, intensity)})` : 'transparent',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '10px',
                                    color: count > 0 ? 'white' : 'transparent',
                                    fontWeight: 'bold'
                                }} title={`Clicks: ${count}`}>
                                    {count > 0 ? count : ''}
                                </div>
                            );
                        })
                    ))}
                </div>
            </div>
            <div style={{ marginTop: '10px', fontSize: '0.8rem', color: '#6b7280', textAlign: 'center' }}>
                Grid displays approx click concentration. Darker red = More clicks.
            </div>
        </div>
    );
}
