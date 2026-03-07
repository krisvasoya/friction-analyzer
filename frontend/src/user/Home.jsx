import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
    Rocket, 
    PlayCircle, 
    CheckCircle2, 
    Sparkles, 
    Activity, 
    BarChart3, 
    Zap,
    Quote,
    ArrowRight
} from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import InteractiveFriction from '../components/InteractiveFriction';

gsap.registerPlugin(ScrollTrigger);

// Magnetic Button Component
function MagneticButton({ children, style, ...props }) {
    const btnRef = useRef();

    const handleMouseMove = (e) => {
        const rect = btnRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        gsap.to(btnRef.current, {
            x: x * 0.3,
            y: y * 0.3,
            duration: 0.4,
            ease: 'power2.out'
        });
    };

    const handleMouseLeave = () => {
        gsap.to(btnRef.current, {
            x: 0, y: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.3)'
        });
    };

    return (
        <div
            ref={btnRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ display: 'inline-block', ...style }}
            {...props}
        >
            {children}
        </div>
    );
}

// 3D Tilt Card Component
function TiltCard({ children, style }) {
    const cardRef = useRef();

    const handleMouseMove = (e) => {
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const rotateX = (0.5 - y) * 20;
        const rotateY = (x - 0.5) * 20;

        gsap.to(cardRef.current, {
            rotateX, rotateY,
            transformPerspective: 800,
            duration: 0.4,
            ease: 'power2.out'
        });
    };

    const handleMouseLeave = () => {
        gsap.to(cardRef.current, {
            rotateX: 0, rotateY: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.4)'
        });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ transformStyle: 'preserve-3d', ...style }}
        >
            {children}
        </div>
    );
}

export default function Home() {
    const heroRef = useRef();
    const titleRef = useRef();
    const descRef = useRef();
    const btnsRef = useRef();
    const cardsRef = useRef([]);
    const statsRef = useRef([]);
    const [liveCount, setLiveCount] = useState(12842);

    // Live counter animation
    useEffect(() => {
        const interval = setInterval(() => {
            setLiveCount(c => c + Math.floor(Math.random() * 5) + 1);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Hero Animation - staggered entrance
        const tl = gsap.timeline();
        tl.fromTo(titleRef.current, 
            { y: 80, opacity: 0, rotateX: 15 }, 
            { y: 0, opacity: 1, rotateX: 0, duration: 1.2, ease: 'power4.out' }
        )
        .fromTo(descRef.current, 
            { y: 40, opacity: 0, filter: 'blur(10px)' }, 
            { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1, ease: 'power3.out' }, 
            '-=0.8'
        )
        .fromTo(btnsRef.current, 
            { scale: 0.8, opacity: 0, y: 30 }, 
            { scale: 1, opacity: 1, y: 0, duration: 0.9, ease: 'back.out(1.7)' }, 
            '-=0.6'
        );

        // Cards Scroll Animation
        cardsRef.current.forEach((card, i) => {
            if (!card) return;
            gsap.fromTo(card, 
                { y: 120, opacity: 0, scale: 0.9, rotateY: -10 },
                { 
                    y: 0, 
                    opacity: 1, 
                    scale: 1,
                    rotateY: 0,
                    duration: 0.9, 
                    delay: i * 0.15,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                    }
                }
            );
        });

        // Stats counter animation
        statsRef.current.forEach((stat, i) => {
            if (!stat) return;
            gsap.fromTo(stat,
                { y: 50, opacity: 0 },
                {
                    y: 0, opacity: 1,
                    duration: 0.6,
                    delay: i * 0.1,
                    scrollTrigger: {
                        trigger: stat,
                        start: 'top 90%'
                    }
                }
            );
        });
    }, []);

    return (
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1rem' }}>
            <div ref={heroRef} style={{ padding: '6rem 0', textAlign: 'center', position: 'relative', minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                {/* Interactive 3D Background */}
                <InteractiveFriction />

                <h1 ref={titleRef} style={{ 
                    fontSize: '4.5rem', marginBottom: '1.5rem', fontWeight: '800', 
                    lineHeight: '1.1', letterSpacing: '-0.02em',
                    textShadow: '0 0 80px rgba(0, 242, 234, 0.15)'
                }}>
                    Stop Losing Users to <br />
                    <span style={{ 
                        color: 'var(--primary)', 
                        background: 'linear-gradient(45deg, var(--primary), #7928ca)', 
                        WebkitBackgroundClip: 'text', 
                        WebkitTextFillColor: 'transparent',
                        position: 'relative'
                    }}>
                        Digital Friction
                        <span style={{
                            position: 'absolute', bottom: '-4px', left: 0, width: '100%',
                            height: '3px', background: 'linear-gradient(90deg, var(--primary), #7928ca)',
                            borderRadius: '2px',
                            animation: 'underlineGlow 3s ease-in-out infinite'
                        }} />
                    </span>
                </h1>
                
                {/* Live Counter */}
                <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ 
                        padding: '0.5rem 1.25rem', 
                        background: 'rgba(0, 242, 234, 0.06)', 
                        border: '1px solid rgba(0, 242, 234, 0.15)', 
                        borderRadius: '30px', 
                        fontSize: '0.9rem', 
                        color: 'var(--primary)', 
                        fontWeight: 'bold', 
                        display: 'flex', 
                        alignItems: 'center',
                        backdropFilter: 'blur(10px)'
                    }}>
                        <span style={{ 
                            display: 'inline-block', width: '8px', height: '8px', 
                            background: '#22c55e', borderRadius: '50%', marginRight: '0.6rem', 
                            boxShadow: '0 0 10px #22c55e',
                            animation: 'liveDot 2s ease-in-out infinite'
                        }}></span>
                        {liveCount.toLocaleString()} Live events analyzed today
                    </div>
                </div>

                <p ref={descRef} style={{ fontSize: '1.4rem', color: 'var(--text-secondary)', marginBottom: '3.5rem', maxWidth: '800px', margin: '0 auto 3.5rem', lineHeight: '1.6' }}>
                    The next generation of user experience monitoring. We don't just track clicks—we analyze the psychology behind every interaction to build smoother, faster digital journeys.
                </p>
                <div ref={btnsRef} style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <MagneticButton>
                        <Link to="/signup">
                            <button style={{ 
                                display: 'flex', alignItems: 'center', gap: '0.6rem', 
                                padding: '1.25rem 3rem', fontSize: '1.2rem', 
                                background: 'linear-gradient(135deg, var(--primary), #0891b2)',
                                color: '#000', border: 'none', borderRadius: '16px', 
                                fontWeight: 'bold', cursor: 'pointer', 
                                transition: 'all 0.3s',
                                boxShadow: '0 10px 40px rgba(0, 242, 234, 0.25)'
                            }}>
                                <Rocket size={20} /> Get Started Free
                                <ArrowRight size={16} style={{ marginLeft: '0.25rem' }} />
                            </button>
                        </Link>
                    </MagneticButton>
                    <MagneticButton>
                        <Link to="/details">
                            <button style={{ 
                                display: 'flex', alignItems: 'center', gap: '0.6rem', 
                                padding: '1.25rem 3rem', fontSize: '1.2rem', 
                                backgroundColor: 'rgba(255,255,255,0.04)', 
                                color: 'var(--text-primary)', 
                                border: '1px solid rgba(255,255,255,0.1)', 
                                borderRadius: '16px', fontWeight: 'bold', cursor: 'pointer', 
                                transition: 'all 0.3s',
                                backdropFilter: 'blur(10px)'
                            }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.borderColor = 'var(--primary)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                }}>
                                <PlayCircle size={20} /> How it Works
                            </button>
                        </Link>
                    </MagneticButton>
                </div>
            </div>

            {/* Social Proof Stats */}
            <div style={{ 
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem',
                marginBottom: '6rem', padding: '2rem 0'
            }}>
                {[
                    { value: '50K+', label: 'Sessions Analyzed' },
                    { value: '99.9%', label: 'Uptime SLA' },
                    { value: '<50ms', label: 'SDK Footprint' },
                    { value: '4.9★', label: 'Developer Rating' }
                ].map((stat, i) => (
                    <div key={i} ref={el => statsRef.current[i] = el} style={{
                        textAlign: 'center', padding: '1.5rem',
                        background: 'rgba(255,255,255,0.02)',
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.05)',
                        transition: 'all 0.3s'
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(0, 242, 234, 0.2)';
                        e.currentTarget.style.background = 'rgba(0, 242, 234, 0.03)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                        e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                    }}>
                        <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '0.25rem' }}>{stat.value}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{stat.label}</div>
                    </div>
                ))}
            </div>

            {/* Trusted By Ticker */}
            <div style={{ overflow: 'hidden', whiteSpace: 'nowrap', marginBottom: '6rem', opacity: 0.7, position: 'relative' }}>
                <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '2rem', letterSpacing: '2px', textTransform: 'uppercase' }}>Trusted by innovative teams</p>
                <div className="ticker-container" style={{ display: 'flex', width: '200%' }}>
                     <div className="ticker-content" style={{ display: 'flex', gap: '4rem', animation: 'ticker 20s linear infinite' }}>
                        {['Acme Corp', 'GlobalTech', 'Nebula Inc', 'Stark Industries', 'Wayne Enterprises', 'Cyberdyne Systems'].map((company, i) => (
                             <span key={i} style={{ fontSize: '1.8rem', fontWeight: '700', color: '#555' }}>{company}</span>
                        ))}
                        {['Acme Corp', 'GlobalTech', 'Nebula Inc', 'Stark Industries', 'Wayne Enterprises', 'Cyberdyne Systems'].map((company, i) => (
                             <span key={`dup-${i}`} style={{ fontSize: '1.8rem', fontWeight: '700', color: '#555' }}>{company}</span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Session Replay Teaser */}
            <section style={{ margin: '6rem 0' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                     <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Session Replay Technology</h2>
                     <p style={{ color: 'var(--text-secondary)' }}>Watch users struggle in real-time with our lightweight vector engine.</p>
                </div>
                <TiltCard>
                    <div style={{ 
                        background: '#0f172a', borderRadius: '24px', 
                        border: '1px solid var(--border)', height: '400px', 
                        position: 'relative', overflow: 'hidden',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
                    }}>
                        <div style={{ padding: '2rem', opacity: 0.3 }}>
                            <div style={{ height: '20px', width: '200px', background: '#334155', borderRadius: '4px', marginBottom: '1rem' }}></div>
                            <div style={{ height: '10px', width: '80%', background: '#1e293b', borderRadius: '4px', marginBottom: '0.5rem' }}></div>
                            <div style={{ height: '10px', width: '60%', background: '#1e293b', borderRadius: '4px', marginBottom: '2rem' }}></div>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <div style={{ height: '150px', width: '30%', background: '#1e293b', borderRadius: '8px' }}></div>
                                <div style={{ height: '150px', width: '30%', background: '#1e293b', borderRadius: '8px' }}></div>
                                <div style={{ height: '150px', width: '30%', background: '#1e293b', borderRadius: '8px' }}></div>
                            </div>
                        </div>

                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                            <path 
                                d="M 100 200 Q 300 100 500 250 T 900 200" 
                                fill="none" 
                                stroke="var(--primary)" 
                                strokeWidth="3"
                                strokeDasharray="1000"
                                strokeDashoffset="1000"
                                style={{ animation: 'dash 3s linear infinite' }} 
                            />
                            <circle cx="0" cy="0" r="8" fill="var(--primary)" style={{ offsetPath: 'path("M 100 200 Q 300 100 500 250 T 900 200")', animation: 'moveAlong 3s linear infinite' }}>
                                 <animate attributeName="r" values="8;12;8" dur="1s" repeatCount="indefinite" />
                            </circle>
                        </svg>

                        <div style={{ 
                            position: 'absolute', bottom: '2rem', right: '2rem', 
                            background: 'rgba(0,0,0,0.8)', padding: '1rem', 
                            borderRadius: '12px', border: '1px solid var(--primary)',
                            display: 'flex', alignItems: 'center', gap: '1rem',
                            boxShadow: '0 0 30px rgba(6, 182, 212, 0.3)'
                        }}>
                            <div style={{ width: '10px', height: '10px', background: '#22c55e', borderRadius: '50%', boxShadow: '0 0 10px #22c55e' }}></div>
                            <span style={{ color: '#fff', fontSize: '0.9rem', fontFamily: 'monospace' }}>LIVE REPLAY: 98% Compression</span>
                        </div>
                    </div>
                </TiltCard>
            </section>

            <section style={{ margin: '4rem 0' }}>
                <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>The Frictionless Workflow</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>Automated insights from capture to visualization.</p>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '2rem' }}>
                    <div ref={el => cardsRef.current[0] = el}><TiltCard><StepCard icon={<Sparkles color="var(--primary)" />} title="Capture" desc="Our lightweight SDK silently records every micro-interaction without affecting page performance." step="01" /></TiltCard></div>
                    <div ref={el => cardsRef.current[1] = el}><TiltCard><StepCard icon={<Activity color="var(--primary)" />} title="Identify" desc="Advanced heuristics detect rage clicks, hesitations, and abandonment patterns in real-time." step="02" /></TiltCard></div>
                    <div ref={el => cardsRef.current[2] = el}><TiltCard><StepCard icon={<BarChart3 color="var(--primary)" />} title="Analyze" desc="Data is processed through our engine to calculate comprehensive friction scores per screen." step="03" /></TiltCard></div>
                    <div ref={el => cardsRef.current[3] = el}><TiltCard><StepCard icon={<Zap color="var(--primary)" />} title="Optimize" desc="Get actionable insights and metrics to improve conversion rates and user satisfaction." step="04" /></TiltCard></div>
                </div>
            </section>

            {/* Testimonials */}
            <section style={{ margin: '6rem 0', textAlign: 'center' }}>
                <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem' }}>Loved by Developers</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    <TiltCard><Testimonial quote="FrictionApp helped us find a critical bug in our checkout flow that was costing us $10k/month." author="Sarah J., CTO" role="FinTech Startup" /></TiltCard>
                    <TiltCard><Testimonial quote="The session replay is smoother than any other tool we've used. And the AI insights are spot on." author="Mike T., Lead Dev" role="SaaS Platform" /></TiltCard>
                    <TiltCard><Testimonial quote="Implemented in 5 minutes. The friction scores gave us immediate clarity on where to focus." author="Alex R., PM" role="E-commerce Giant" /></TiltCard>
                </div>
            </section>

            <section style={{ margin: '8rem 0', background: 'rgba(0, 242, 234, 0.03)', padding: '4rem', borderRadius: '32px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>Why It Matters</h2>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            <li style={{ display: 'flex', gap: '1rem' }}>
                                <CheckCircle2 color="var(--primary)" size={24} />
                                <div>
                                    <strong style={{ display: 'block' }}>Reduce Churn</strong>
                                    <span style={{ color: 'var(--text-secondary)' }}>Identify the exact moment users get frustrated and leave.</span>
                                </div>
                            </li>
                            <li style={{ display: 'flex', gap: '1rem' }}>
                                <CheckCircle2 color="var(--primary)" size={24} />
                                <div>
                                    <strong style={{ display: 'block' }}>Improve Conversion</strong>
                                    <span style={{ color: 'var(--text-secondary)' }}>Streamline complex forms and navigation paths effortlessly.</span>
                                </div>
                            </li>
                            <li style={{ display: 'flex', gap: '1rem' }}>
                                <CheckCircle2 color="var(--primary)" size={24} />
                                <div>
                                    <strong style={{ display: 'block' }}>Data-Driven Design</strong>
                                    <span style={{ color: 'var(--text-secondary)' }}>Base your UI decisions on actual behavioral data, not guesses.</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                    <TiltCard>
                        <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
                            <code style={{ color: 'var(--primary)', fontSize: '0.9rem' }}>
                                // Integration is simple <br />
                                import FrictionSDK from 'friction-app'; <br /><br />
                                FrictionSDK.init('YOUR_API_KEY'); <br />
                                FrictionSDK.track();
                            </code>
                        </div>
                    </TiltCard>
                </div>
            </section>
        </div>
    );
}

function StepCard({ icon, title, desc, step }) {
    return (
        <div style={{ 
            padding: '2rem', background: 'var(--bg-card)', borderRadius: '16px', 
            border: '1px solid var(--border)', textAlign: 'left', 
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
            cursor: 'default', height: '100%', position: 'relative',
            overflow: 'hidden'
        }}
            onMouseEnter={(e) => { 
                e.currentTarget.style.borderColor = 'var(--primary)'; 
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(6, 182, 212, 0.15)'; 
            }}
            onMouseLeave={(e) => { 
                e.currentTarget.style.borderColor = 'var(--border)'; 
                e.currentTarget.style.boxShadow = 'none'; 
            }}
        >
            {/* Step Number */}
            <div style={{
                position: 'absolute', top: '1rem', right: '1rem',
                fontSize: '3rem', fontWeight: '900', color: 'rgba(0, 242, 234, 0.06)',
                lineHeight: 1
            }}>{step}</div>
            
            <div style={{ marginBottom: '1.5rem' }}>{icon}</div>
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', lineHeight: '1.5' }}>{desc}</p>
        </div>
    );
}

function Testimonial({ quote, author, role }) {
    return (
         <div style={{ 
             padding: '2rem', background: 'var(--bg-card)', borderRadius: '16px', 
             border: '1px solid var(--border)', textAlign: 'left', cursor: 'default', 
             position: 'relative', height: '100%',
             transition: 'all 0.3s'
         }}
            onMouseEnter={(e) => { 
                e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; 
                e.currentTarget.style.borderColor = 'rgba(0, 242, 234, 0.2)';
            }}
            onMouseLeave={(e) => { 
                e.currentTarget.style.background = 'var(--bg-card)'; 
                e.currentTarget.style.borderColor = 'var(--border)';
            }}
         >
            <Quote size={40} color="var(--primary)" style={{ position: 'absolute', top: '1rem', right: '1rem', opacity: 0.1 }} />
            <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '1.5rem', color: '#cbd5e1', position: 'relative', zIndex: 1 }}>"{quote}"</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ 
                    width: '40px', height: '40px', 
                    background: 'linear-gradient(135deg, var(--primary), #7928ca)', 
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#fff', fontWeight: '700', fontSize: '1rem'
                }}>{author[0]}</div>
                <div>
                    <strong style={{ display: 'block', color: '#fff' }}>{author}</strong>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{role}</span>
                </div>
            </div>
         </div>
    );
}

// CSS Animations
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes dash {
        to { stroke-dashoffset: 0; }
    }
    @keyframes moveAlong {
        0% { offset-distance: 0%; }
        100% { offset-distance: 100%; }
    }
    @keyframes ticker {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); } 
    }
    @keyframes liveDot {
        0%, 100% { opacity: 1; box-shadow: 0 0 10px #22c55e; }
        50% { opacity: 0.4; box-shadow: 0 0 20px #22c55e; }
    }
    @keyframes underlineGlow {
        0%, 100% { opacity: 0.6; }
        50% { opacity: 1; box-shadow: 0 0 20px rgba(0, 242, 234, 0.5); }
    }
`;
document.head.appendChild(styleSheet);
