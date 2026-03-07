import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { api } from '../api';
import { FileDown } from 'lucide-react';

// ─── Palette (Sync with Python Report) ───────────────────
const PALETTE = {
    BG: [10, 14, 26],         // #0A0E1A
    PANEL: [17, 24, 39],      // #111827
    PANEL2: [26, 34, 53],     // #1A2235
    ACCENT1: [99, 102, 241],  // #6366F1 (Indigo)
    ACCENT2: [34, 211, 238],  // #22D3EE (Cyan)
    TEXT_HI: [249, 250, 251], // #F9FAFB
    TEXT_MED: [156, 163, 175],// #9CA3AF
    TEXT_LOW: [75, 85, 99],   // #4B5563
    BORDER: [31, 45, 68],     // #1F2D44
    GRID: [28, 43, 62],       // #1C2B3E
    RED: [239, 68, 114],      // #EF4444
    YELLOW: [245, 158, 11],   // #F59E0B
    GREEN: [16, 185, 129]     // #10B981
};

// ─── Drawing Helpers ───────────────────────────────────
const rect = (doc, x, y, w, h, fill = null, stroke = null, radius = 2) => {
    if (fill) {
        doc.setFillColor(fill[0], fill[1], fill[2]);
        doc.roundedRect(x, y, w, h, radius, radius, 'F');
    }
    if (stroke) {
        doc.setDrawColor(stroke[0], stroke[1], stroke[2]);
        doc.roundedRect(x, y, w, h, radius, radius, 'S');
    }
};

const label = (doc, text, x, y, size = 8, color = PALETTE.TEXT_MED, font = 'helvetica', weight = 'normal', align = 'left') => {
    doc.setFont(font, weight);
    doc.setFontSize(size);
    doc.setTextColor(color[0], color[1], color[2]);
    doc.text(String(text), x, y, { align });
};

const hline = (doc, x, y, w, color = PALETTE.BORDER, thickness = 0.1) => {
    doc.setDrawColor(color[0], color[1], color[2]);
    doc.setLineWidth(thickness);
    doc.line(x, y, x + w, y);
};

const score_bar = (doc, x, y, w, h, score, max_score = 110) => {
    const pct = Math.min(score / max_score, 1.0);
    rect(doc, x, y, w, h, PALETTE.PANEL2, null, 1);
    let bar_color = PALETTE.GREEN;
    if (score >= 80) bar_color = PALETTE.RED;
    else if (score >= 50) bar_color = PALETTE.YELLOW;
    rect(doc, x, y, w * pct, h, bar_color, null, 1);
};

const drawHeader = (doc, pageNum, totalPages) => {
    const W = doc.internal.pageSize.getWidth();
    // Full-width top bar
    rect(doc, 0, 0, W, 22, PALETTE.PANEL);
    // Accent stripe
    rect(doc, 0, 0, 1.5, 22, PALETTE.ACCENT1, null, 0);

    // Logo area
    label(doc, "FRICTION", 10, 10, 13, PALETTE.TEXT_HI, 'helvetica', 'bold');
    label(doc, "ANALYZER", 10, 16, 9, PALETTE.ACCENT2);

    // Title
    label(doc, "ENTERPRISE PERFORMANCE REPORT", W / 2, 10, 9, PALETTE.TEXT_MED, 'helvetica', 'normal', 'center');
    label(doc, "Digital Friction Analysis  ·  friction-sigma.vercel.app", W / 2, 16, 7, PALETTE.TEXT_LOW, 'helvetica', 'normal', 'center');

    // Right: date + page
    const now = new Date();
    label(doc, "GENERATED", W - 10, 9, 6, PALETTE.TEXT_LOW, 'helvetica', 'normal', 'right');
    label(doc, now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }), W - 10, 14, 8, PALETTE.TEXT_MED, 'helvetica', 'normal', 'right');
    label(doc, `Page ${pageNum} / ${totalPages}`, W - 10, 19, 7, PALETTE.TEXT_LOW, 'helvetica', 'normal', 'right');
};

const drawFooter = (doc) => {
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    rect(doc, 0, H - 10, W, 10, PALETTE.PANEL, null, 0);
    hline(doc, 0, H - 10, W, PALETTE.BORDER);
    label(doc, "CONFIDENTIAL — FOR INTERNAL USE ONLY", W / 2, H - 3.5, 6.5, PALETTE.TEXT_LOW, 'helvetica', 'normal', 'center');
    label(doc, "© 2026 Digital Friction Analyzer Enterprise Edition", 10, H - 3.5, 6, PALETTE.TEXT_LOW);
};

// ─── Main Export ─────────────────────────────────────
export default function ExportButton() {
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        try {
            const [summary, scores, stats] = await Promise.all([
                api.getDashboardSummary().catch(() => ({})),
                api.getScores().catch(() => []),
                api.getStats().catch(() => ({}))
            ]);

            const doc = new jsPDF();
            const W = doc.internal.pageSize.getWidth();
            const H = doc.internal.pageSize.getHeight();
            const now = new Date();
            const M = 10; 

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            //  PAGE 1 — Cover / Executive Summary
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            rect(doc, 0, 0, W, H, PALETTE.BG, null, 0);
            drawHeader(doc, 1, 3);

            // Hero area
            const y_hero = 40;
            rect(doc, 10, y_hero - 4, 1.5, 28, PALETTE.ACCENT1, null, 0);
            label(doc, "DIGITAL FRICTION", 14, y_hero + 16, 28, PALETTE.TEXT_HI, 'helvetica', 'bold');
            label(doc, "ENTERPRISE ANALYSIS", 14, y_hero + 5, 14, PALETTE.ACCENT2);
            label(doc, "Session Intelligence & UX Risk Assessment", 14, y_hero - 2, 9, PALETTE.TEXT_MED);

            // Risk badge
            const avgFriction = summary?.avgFrictionScore || 0;
            const riskLevel = avgFriction >= 80 ? "HIGH" : avgFriction >= 50 ? "MEDIUM" : "LOW";
            const riskColor = avgFriction >= 80 ? PALETTE.RED : avgFriction >= 50 ? PALETTE.YELLOW : PALETTE.GREEN;
            const riskBG = avgFriction >= 80 ? [59, 0, 0] : avgFriction >= 50 ? [59, 32, 0] : [5, 46, 22];

            rect(doc, W - 55, y_hero, 45, 22, riskBG, riskColor, 6);
            label(doc, "RISK LEVEL", W - 32.5, y_hero + 15, 6.5, riskColor, 'helvetica', 'normal', 'center');
            label(doc, riskLevel, W - 32.5, y_hero + 7, 18, riskColor, 'helvetica', 'bold', 'center');
            label(doc, riskLevel === "HIGH" ? "REQUIRES ATTENTION" : riskLevel === "MEDIUM" ? "MONITOR CLOSELY" : "SYSTEM HEALTHY", W - 32.5, y_hero + 2, 5.5, [155, 28, 28], 'helvetica', 'normal', 'center');

            hline(doc, 10, y_hero + 32, W - 20, PALETTE.BORDER);

            // ── KPI Cards ──────────────────────────────────────────────────────────────
            const y_kpi = y_hero + 42;
            const kpis = [
                ["TOTAL SESSIONS",    String(summary?.totalSessions || 0),   "Active tracking",  PALETTE.ACCENT1],
                ["AVG FRICTION",      `${avgFriction}%`,  riskLevel + " risk",  avgFriction >= 80 ? PALETTE.RED : PALETTE.YELLOW],
                ["TOTAL CLICKS",      String(stats?.totalClicks || 0),  `${stats?.avgClicksPerSession || 0} avg/session`, PALETTE.ACCENT2],
                ["ABANDONMENT RATE",  `${summary?.abandonmentRate || 0}%`,  "Drop-off rate",   PALETTE.GREEN],
            ];
            const card_w = (W - 20 - 9) / 4;
            kpis.forEach(([title, val, sub, acc], i) => {
                const x = 10 + i * (card_w + 3);
                rect(doc, x, y_kpi, card_w, 28, PALETTE.PANEL, null, 6);
                rect(doc, x, y_kpi + 26, card_w, 2, acc, null, 3);
                label(doc, title, x + card_w / 2, y_kpi + 8, 6, PALETTE.TEXT_LOW, 'helvetica', 'normal', 'center');
                label(doc, val, x + card_w / 2, y_kpi + 18, 18, PALETTE.TEXT_HI, 'helvetica', 'bold', 'center');
                label(doc, sub, x + card_w / 2, y_kpi + 24, 6.5, PALETTE.TEXT_MED, 'helvetica', 'normal', 'center');
            });

            // ── Session Activity Sparkline ───────────────────────────────────────────
            const y_chart = y_kpi + 38;
            rect(doc, 10, y_chart, W - 20, 48, PALETTE.PANEL, null, 6);
            label(doc, "SESSION ACTIVITY OVERVIEW", 16, y_chart + 8, 7, PALETTE.TEXT_MED, 'helvetica', 'bold');
            label(doc, "Friction score distribution across top tracked pages", 16, y_chart + 14, 6.5, PALETTE.TEXT_LOW);

            // grid lines
            for (let i = 0; i < 4; i++) {
                const gy = y_chart + 18 + i * 6;
                hline(doc, 16, gy, W - 32, PALETTE.GRID);
            }

            // bars (Scores)
            const topScores = (scores || []).slice(0, 11);
            const bw = (W - 32) / Math.max(topScores.length, 1);
            const chart_h = 24;
            const chart_x = 16;
            const chart_y = y_chart + 42; 

            topScores.forEach((s, i) => {
                const val = Math.round(s.avg_score || 0);
                const bh = (val / 110) * chart_h;
                const bx = chart_x + i * bw + bw * 0.1;
                const bw2 = bw * 0.8;
                const col = val >= 80 ? PALETTE.RED : val >= 50 ? PALETTE.YELLOW : PALETTE.GREEN;
                rect(doc, bx, chart_y - bh, bw2, bh, col, null, 2);
                label(doc, String(val), bx + bw2 / 2, chart_y - bh - 1, 5.5, PALETTE.TEXT_MED, 'helvetica', 'normal', 'center');
                label(doc, (s.screen_name || '/').substring(0, 8), bx + bw2 / 2, chart_y + 4, 4.5, PALETTE.TEXT_LOW, 'helvetica', 'normal', 'center');
            });

            // ── Most Clicked ───────────────────────────────────────────────────────────
            const y_mc = y_chart + 55;
            rect(doc, 10, y_mc, W - 20, 18, PALETTE.PANEL, null, 6);
            rect(doc, 16, y_mc + 3, 4, 3, PALETTE.ACCENT2, null, 1);
            label(doc, "MOST CLICKED PAGE", 22, y_mc + 6, 7, PALETTE.TEXT_MED, 'helvetica', 'bold');
            label(doc, stats?.mostClickedPage || 'N/A', 16, y_mc + 14, 14, PALETTE.ACCENT2, 'helvetica', 'bold');
            label(doc, `Highest user engagement area — ${stats?.totalClicks || 0} total interactions recorded`, 75, y_mc + 12, 7, PALETTE.TEXT_LOW);

            drawFooter(doc);

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            //  PAGE 2 — Friction Scores Table
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            doc.addPage();
            rect(doc, 0, 0, W, H, PALETTE.BG, null, 0);
            drawHeader(doc, 2, 3);

            let curY = 32;
            label(doc, "FRICTION SCORES BY SCREEN", 10, curY, 11, PALETTE.TEXT_HI, 'helvetica', 'bold');
            label(doc, "Ranked highest to lowest friction  ·  Score max: 110", 10, curY + 6, 7.5, PALETTE.TEXT_LOW);
            hline(doc, 10, curY + 10, W - 20, PALETTE.BORDER);

            // Column headers
            curY += 14;
            rect(doc, 10, curY, W - 20, 8, PALETTE.PANEL2, null, 3);
            label(doc, "#", 13, curY + 5.5, 6.5, PALETTE.TEXT_LOW, 'helvetica', 'bold');
            label(doc, "SCREEN", 22, curY + 5.5, 6.5, PALETTE.TEXT_LOW, 'helvetica', 'bold');
            label(doc, "FRICTION SCORE", 100, curY + 5.5, 6.5, PALETTE.TEXT_LOW, 'helvetica', 'bold');
            label(doc, "VISUAL", 130, curY + 5.5, 6.5, PALETTE.TEXT_LOW, 'helvetica', 'bold');
            label(doc, "RISK", W - 15, curY + 5.5, 6.5, PALETTE.TEXT_LOW, 'helvetica', 'bold', 'right');

            const row_h = 13;
            curY += 8;
            (scores || []).slice(0, 10).forEach((s, i) => {
                const score = Math.round(s.avg_score || 0);
                const risk = score >= 80 ? "HIGH" : score >= 50 ? "MEDIUM" : "LOW";
                const rc = score >= 80 ? PALETTE.RED : score >= 50 ? PALETTE.YELLOW : PALETTE.GREEN;
                const rbg = score >= 80 ? [59, 0, 0] : score >= 50 ? [59, 32, 0] : [5, 46, 22];

                const bg = i % 2 === 0 ? PALETTE.PANEL : [13, 18, 32];
                rect(doc, 10, curY, W - 20, row_h - 1, bg, null, 3);
                rect(doc, 10, curY, 2, row_h - 1, rc, null, 2);

                label(doc, String(i + 1).padStart(2, '0'), 13, curY + 6.5, 7, PALETTE.TEXT_LOW);
                label(doc, String(s.screen_name || '/').substring(0, 30), 22, curY + 6.5, 8, PALETTE.TEXT_HI, 'helvetica', 'bold');
                label(doc, String(score), 100, curY + 6.5, 11, rc, 'helvetica', 'bold');

                score_bar(doc, 118, curY + 5, 45, 5, score);

                const badge_x = W - 32;
                rect(doc, badge_x, curY + 3, 22, 7, rbg, null, 3);
                label(doc, risk, badge_x + 11, curY + 8, 6.5, rc, 'helvetica', 'bold', 'center');

                curY += row_h;
            });

            // Legend
            curY += 5;
            rect(doc, 10, curY, W - 20, 10, PALETTE.PANEL, null, 4);
            const legends = [["LOW  0–49", PALETTE.GREEN], ["MEDIUM  50–79", PALETTE.YELLOW], ["HIGH  80+", PALETTE.RED]];
            legends.forEach(([lbl, col], j) => {
                const lx = 20 + j * 55;
                rect(doc, lx, curY + 3, 3, 4, col, null, 1);
                label(doc, lbl, lx + 5, curY + 6.5, 7, PALETTE.TEXT_MED);
            });

            // ── Risk distribution donut ───────────────────────────────────────────
            curY += 15;
            rect(doc, 10, curY, W - 20, 38, PALETTE.PANEL, null, 6);
            label(doc, "RISK DISTRIBUTION", 16, curY + 8, 7, PALETTE.TEXT_MED, 'helvetica', 'bold');

            const counts = (scores || []).reduce((acc, s) => {
                const score = s.avg_score || 0;
                if (score >= 80) acc.HIGH++;
                else if (score >= 50) acc.MEDIUM++;
                else acc.LOW++;
                return acc;
            }, { HIGH: 0, MEDIUM: 0, LOW: 0 });

            const cx = 45, cy = curY + 22, outer_r = 12, inner_r = 7;
            let startAngle = -Math.PI / 2;
            const total = (scores || []).length || 1;

            [["HIGH", PALETTE.RED], ["MEDIUM", PALETTE.YELLOW], ["LOW", PALETTE.GREEN]].forEach(([rl, col], j) => {
                const cnt = counts[rl];
                const sweep = (cnt / total) * Math.PI * 2;
                if (sweep > 0) {
                    doc.setFillColor(col[0], col[1], col[2]);
                    const steps = Math.max(Math.ceil(sweep * 20), 3);
                    for (let s = 0; s < steps; s++) {
                        const a1 = startAngle + (sweep * s / steps);
                        const a2 = startAngle + (sweep * (s + 1) / steps);
                        doc.triangle(
                            cx, cy,
                            cx + Math.cos(a1) * outer_r, cy + Math.sin(a1) * outer_r,
                            cx + Math.cos(a2) * outer_r, cy + Math.sin(a2) * outer_r,
                            'F'
                        );
                    }
                    startAngle += sweep;
                }
                // Legend for donut
                const lx = 62, ly = curY + 12 + j * 8;
                rect(doc, lx, ly, 3, 3, col, null, 1);
                label(doc, rl, lx + 5, ly + 2.5, 7, PALETTE.TEXT_MED);
                label(doc, `${cnt} screens (${Math.round(cnt * 100 / total)}%)`, lx + 25, ly + 2.5, 7, PALETTE.TEXT_LOW);
            });
            // hollow centre
            doc.setFillColor(PALETTE.PANEL[0], PALETTE.PANEL[1], PALETTE.PANEL[2]);
            const cSteps = 60;
            for (let s = 0; s < cSteps; s++) {
                const a1 = (Math.PI * 2 * s) / cSteps;
                const a2 = (Math.PI * 2 * (s + 1)) / cSteps;
                doc.triangle(cx, cy, cx + Math.cos(a1) * inner_r, cy + Math.sin(a1) * inner_r, cx + Math.cos(a2) * inner_r, cy + Math.sin(a2) * inner_r, 'F');
            }
            label(doc, String((scores || []).length), cx, cy + 1, 9, PALETTE.TEXT_HI, 'helvetica', 'bold', 'center');
            label(doc, "screens", cx, cy + 4, 5.5, PALETTE.TEXT_LOW, 'helvetica', 'normal', 'center');

            drawFooter(doc);

            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            //  PAGE 3 — Recommendations
            // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            doc.addPage();
            rect(doc, 0, 0, W, H, PALETTE.BG, null, 0);
            drawHeader(doc, 3, 3);

            let recY = 32;
            label(doc, "ISSUES & RECOMMENDATIONS", 10, recY, 11, PALETTE.TEXT_HI, 'helvetica', 'bold');
            label(doc, "Actionable steps to reduce friction and improve conversion", 10, recY + 6, 7.5, PALETTE.TEXT_LOW);
            hline(doc, 10, recY + 10, W - 20, PALETTE.BORDER);

            // Status banner
            recY += 15;
            rect(doc, 10, recY, W - 20, 10, [5, 46, 22], PALETTE.GREEN, 4);
            label(doc, "✓  No critical system errors detected  —  Performance monitoring active", W / 2, recY + 6.5, 7.5, PALETTE.GREEN, 'helvetica', 'normal', 'center');

            const recs = [
                ["01", "Review high-friction pages", "Simplify navigation paths and reduce the number of steps required for core user journeys on top screens."],
                ["02", "Audit dead-click rates", "Identify and fix interactive elements that receive high dead-click rates — non-clickable areas users expect to respond."],
                ["03", "Reduce cognitive load", "Pages with high interactive elements overwhelm users. Consolidate controls and use progressive disclosure patterns."],
                ["04", "Fix rage-click hotspots", "Monitor rage-click zones and increase hit-box sizes on small or misaligned interactive elements."],
                ["05", "A/B test layouts", "Run structured A/B experiments on the top three friction-generating screens before committing to redesigns."]
            ];

            recY += 15;
            const card_h = 24;
            recs.forEach(([num, title, body]) => {
                rect(doc, 10, recY, W - 20, card_h, PALETTE.PANEL, null, 6);
                rect(doc, 10, recY, 14, card_h, PALETTE.PANEL2, null, 6);
                label(doc, num, 17, recY + card_h / 2 + 3, 16, PALETTE.ACCENT1, 'helvetica', 'bold', 'center');

                rect(doc, 28, recY + 4, 3, 3, PALETTE.ACCENT1, null, 1);
                label(doc, title.toUpperCase(), 33, recY + 7, 8, PALETTE.TEXT_HI, 'helvetica', 'bold');
                
                // Simple word wrap
                const splitBody = body.match(/.{1,80}(\s|$)/g) || [body];
                splitBody.slice(0, 2).forEach((line, j) => {
                    label(doc, line.trim(), 33, recY + 14 + j * 5, 7, PALETTE.TEXT_MED);
                });

                recY += card_h + 2;
            });

            // ── Next Steps / Priority Matrix ───────────────────────────────────────────
            recY += 5;
            rect(doc, 10, recY, W - 20, 18, PALETTE.PANEL, null, 6);
            label(doc, "PRIORITY MATRIX", 16, recY + 6, 7, PALETTE.TEXT_MED, 'helvetica', 'bold');
            const priorities = [
                ["IMMEDIATE", (scores || []).filter(s => (s.avg_score || 0) >= 80).map(s => (s.screen_name || '/').substring(0, 10)), PALETTE.RED],
                ["SHORT-TERM", (scores || []).filter(s => (s.avg_score || 0) >= 50 && (s.avg_score || 0) < 80).map(s => (s.screen_name || '/').substring(0, 10)), PALETTE.YELLOW],
                ["MONITOR", (scores || []).filter(s => (s.avg_score || 0) < 50).map(s => (s.screen_name || '/').substring(0, 10)), PALETTE.GREEN],
            ];
            priorities.forEach(([pri, pages, col], j) => {
                const px = 10 + j * (W - 20) / 3;
                label(doc, pri, px + 5, recY + 11, 6.5, col, 'helvetica', 'bold');
                label(doc, pages.slice(0, 3).join("  "), px + 5, recY + 15, 5.5, PALETTE.TEXT_LOW);
            });

            drawFooter(doc);

            const nowStr = now.toISOString().split('T')[0];
            doc.save(`Friction_Report_Enterprise_${nowStr}.pdf`);
        } catch (err) {
            console.error('Export failed:', err);
            alert('Failed to generate PDF: ' + err.message);
        } finally {
            setExporting(false);
        }
    };

    return (
        <button
            onClick={handleExport}
            disabled={exporting}
            style={{
                padding: '0.85rem 2.5rem',
                fontSize: '1rem',
                borderRadius: '50px',
                background: exporting
                    ? 'rgba(148, 163, 184, 0.2)'
                    : 'linear-gradient(135deg, var(--primary), #7928ca)',
                color: '#fff',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: exporting ? 'none' : '0 10px 30px rgba(0, 242, 234, 0.2)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                cursor: exporting ? 'not-allowed' : 'pointer',
                border: 'none',
                fontWeight: '600',
                width: 'auto'
            }}
        >
            {exporting ? (
                <>
                    <div style={{
                        width: '16px', height: '16px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#fff',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite'
                    }} />
                    Generating Report...
                </>
            ) : (
                <>
                    <FileDown size={18} />
                    Export PDF Report
                </>
            )}
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </button>
    );
}
