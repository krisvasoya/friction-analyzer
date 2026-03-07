import React, { useEffect, useRef } from 'react';
import { 
    Brain, 
    Dna, 
    Shield, 
    Database, 
    Rocket, 
    Atom, 
    Activity, 
    MousePointer2,
    CheckCircle2,
    AlertCircle,
    Info
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Details() {
    const headerRef = useRef(null);
    const tableRef = useRef(null);
    const methodologyRef = useRef(null);
    const archRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(headerRef.current.children, {
                y: 30,
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out"
            });

            gsap.from(tableRef.current, {
                scrollTrigger: {
                    trigger: tableRef.current,
                    start: "top 80%",
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });

            gsap.from(".methodology-card", {
                scrollTrigger: {
                    trigger: methodologyRef.current,
                    start: "top 80%",
                },
                y: 40,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "power3.out"
            });

            gsap.from(".arch-item", {
                scrollTrigger: {
                    trigger: archRef.current,
                    start: "top 85%",
                },
                scale: 0.9,
                opacity: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "back.out(1.7)"
            });
        });
        return () => ctx.revert();
    }, []);

    const metrics = [
        { name: 'Rage Clicks', impact: 'Critical', desc: 'User clicks the same element rapidly 5+ times. Indicates frustration or broken UI.', trigger: '5 clicks < 1s' },
        { name: 'Dead Clicks', impact: 'High', desc: 'Clicks on non-interactive elements. Indicates expectation mismatch.', trigger: 'Click on <div>/<span>' },
        { name: 'Hesitation', impact: 'Medium', desc: 'Long delay (5s+) before first click on a new screen. Indicates confusion.', trigger: 'No event > 5000ms' },
        { name: 'Scroll Exhaustion', impact: 'Low', desc: 'User scrolls to bottom multiple times without clicking. Indicates missing content.', trigger: '3+ Full Scrolls' },
        { name: 'Nav Loops', impact: 'High', desc: 'Circular navigation pattern between two pages. Indicates system confusion.', trigger: 'A → B → A → B' },
    ];

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '4rem 1rem' }}>
            <header ref={headerRef} style={{ marginBottom: '5rem' }}>
                <h1 style={{ fontSize: '3rem', fontWeight: '800', marginBottom: '1rem' }}>
                    Technical <span style={{ color: 'var(--primary)' }}>Deep Dive</span>
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '700px' }}>
                    Understanding the methodology, architecture, and behavioral heuristics behind our friction analysis engine.
                </p>
            </header>

            <section ref={tableRef} style={{ marginBottom: '6rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Metric Heuristics</h2>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '24px', overflow: 'hidden' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,0.02)' }}>
                                <th style={{ padding: '1.5rem' }}>Metric</th>
                                <th style={{ padding: '1.5rem' }}>Trigger Logic</th>
                                <th style={{ padding: '1.5rem' }}>Impact</th>
                                <th style={{ padding: '1.5rem' }}>UX Definition</th>
                            </tr>
                        </thead>
                        <tbody>
                            {metrics.map((m, i) => (
                                <tr key={i} style={{ borderBottom: i === metrics.length - 1 ? 'none' : '1px solid var(--border)' }}>
                                    <td style={{ padding: '1.5rem', fontWeight: '600' }}>{m.name}</td>
                                    <td style={{ padding: '1.5rem', fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--primary)' }}>{m.trigger}</td>
                                    <td style={{ padding: '1.5rem' }}>
                                        <span style={{ 
                                            padding: '0.25rem 0.75rem', 
                                            borderRadius: '20px', 
                                            fontSize: '0.8rem', 
                                            background: m.impact === 'Critical' ? 'rgba(255, 107, 107, 0.1)' : m.impact === 'High' ? 'rgba(255, 169, 77, 0.1)' : 'rgba(77, 171, 255, 0.1)',
                                            color: m.impact === 'Critical' ? '#ff6b6b' : m.impact === 'High' ? '#ffa94d' : '#4dabff'
                                        }}>
                                            {m.impact}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{m.desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Session Replay Preview */}
            <section style={{ marginBottom: '6rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Session Replay (Teaser)</h2>
                <div style={{ 
                    height: '400px', 
                    background: 'rgba(15, 23, 42, 0.6)', 
                    borderRadius: '32px', 
                    border: '1px solid var(--border)', 
                    position: 'relative', 
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <div style={{ position: 'absolute', top: '10%', left: '10%', width: '150px', height: '40px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}></div>
                    <div style={{ position: 'absolute', top: '10%', right: '10%', width: '100px', height: '40px', background: 'var(--primary)', opacity: 0.2, borderRadius: '8px' }}></div>
                    
                    {/* Animated Mouse Trail */}
                    <div className="mouse-pointer" style={{ 
                        position: 'absolute', 
                        width: '20px', 
                        height: '20px', 
                        border: '2px solid var(--primary)', 
                        borderRadius: '50%',
                        zIndex: 10
                    }}><MousePointer2 size={12} color="var(--primary)" style={{ position: 'absolute', top: -10, left: -10 }} /></div>
                    <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                        <path className="mouse-path" d="M 100 100 Q 300 50 400 300 T 800 200" fill="none" stroke="var(--primary)" strokeWidth="2" strokeDasharray="5,5" />
                    </svg>
                    
                    <div style={{ textAlign: 'center', zIndex: 11 }}>
                        <h3 style={{ marginBottom: '1rem' }}>Vector Replay Technology</h3>
                        <p style={{ color: 'var(--text-secondary)', maxWidth: '500px' }}>
                            Our Replay engine uses lightweight DOM snapshots rather than video, reducing data usage by 98% while maintaining pixel-perfect accuracy.
                        </p>
                    </div>
                </div>
            </section>

            <section ref={methodologyRef} style={{ marginBottom: '6rem' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '2rem' }}>Core Methodology</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    <MethodologyCard 
                        title="Behavioral Heuristics" 
                        icon={<Brain size={40} color="var(--primary)" />}
                        content="Our system uses 12 distinct behavioral markers to quantify the digital experience. Unlike session replay, our engine converts raw events into structured 'friction scores' instantly."
                    />
                    <MethodologyCard 
                        title="The Analysis Pipeline" 
                        icon={<Dna size={40} color="var(--primary)" />}
                        content="Data flows from the client SDK to our global ingestion endpoints. Sessions are analyzed server-side using SQLite for high-performance ACID-compliant storage."
                    />
                    <MethodologyCard 
                        title="Privacy First" 
                        icon={<Shield size={40} color="var(--primary)" />}
                        content="Full PII masking is baked into the foundation. No keystrokes or sensitive input data are ever transmitted or stored, ensuring GDPR and CCPA compliance."
                    />
                </div>
            </section>

            <section ref={archRef} style={{ padding: '4rem', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '32px' }}>
                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>Architecture Overview</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', textAlign: 'center' }}>
                    <div className="arch-item">
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}><Atom size={48} color="var(--primary)" /></div>
                        <h4 style={{ marginBottom: '0.5rem' }}>Frontend</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>React 18 + Vite <br /> Chart.js Visualization</p>
                    </div>
                    <div className="arch-item">
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}><Rocket size={48} color="var(--primary)" /></div>
                        <h4 style={{ marginBottom: '0.5rem' }}>Backend</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Node.js + Express <br /> Custom Analysis Engine</p>
                    </div>
                    <div className="arch-item">
                        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center' }}><Database size={48} color="var(--primary)" /></div>
                        <h4 style={{ marginBottom: '0.5rem' }}>Storage</h4>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>SQLite Database <br /> Indexed Log Storage</p>
                    </div>
                </div>
            </section>

            <style>{`
                .mouse-pointer {
                    animation: moveMouse 5s infinite ease-in-out;
                }
                @keyframes moveMouse {
                    0% { top: 100px; left: 100px; }
                    25% { top: 50px; left: 300px; box-shadow: 0 0 20px var(--primary); }
                    50% { top: 300px; left: 400px; transform: scale(0.8); }
                    75% { top: 200px; left: 800px; box-shadow: 0 0 20px var(--primary); }
                    100% { top: 100px; left: 100px; }
                }
                .mouse-path {
                    stroke-dashoffset: 1000;
                    stroke-dasharray: 1000;
                    animation: dash 5s linear infinite;
                }
                @keyframes dash {
                    to { stroke-dashoffset: 0; }
                }
            `}</style>
        </div>
    );
}

function MethodologyCard({ title, icon, content }) {
    return (
        <div className="methodology-card" style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: '20px', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>{icon}</div>
            <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>{title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>{content}</p>
            </div>
        </div>
    );
}
