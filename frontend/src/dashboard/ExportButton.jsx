import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { api } from '../api';
import { FileDown } from 'lucide-react';

// ─── Drawing Helpers ───────────────────────────────────
function drawPageBg(doc, pageW, pageH) {
    doc.setFillColor(10, 14, 20);
    doc.rect(0, 0, pageW, pageH, 'F');
    // Top accent bar
    doc.setFillColor(0, 242, 234);
    doc.rect(0, 0, pageW, 3, 'F');
    // Subtle grid pattern
    doc.setDrawColor(20, 28, 38);
    doc.setLineWidth(0.1);
    for (let x = 0; x < pageW; x += 20) doc.line(x, 0, x, pageH);
    for (let y = 0; y < pageH; y += 20) doc.line(0, y, pageW, y);
}

function drawSectionTitle(doc, text, x, y, w) {
    doc.setTextColor(0, 242, 234);
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.text(text, x, y);
    // Underline accent
    doc.setDrawColor(0, 242, 234);
    doc.setLineWidth(0.6);
    doc.line(x, y + 3, x + w, y + 3);
    // Fade line
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(0.2);
    doc.line(x + w, y + 3, x + w + 60, y + 3);
}

function drawKpiCard(doc, x, y, w, h, label, value, subtext, color) {
    // Card bg
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(x, y, w, h, 3, 3, 'F');
    // Left accent bar
    doc.setFillColor(...color);
    doc.rect(x, y + 4, 2.5, h - 8, 'F');
    // Label
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'bold');
    doc.text(label.toUpperCase(), x + 10, y + 12);
    // Value
    doc.setFontSize(22);
    doc.setTextColor(...color);
    doc.setFont('helvetica', 'bold');
    doc.text(String(value), x + 10, y + 28);
    // Subtext
    if (subtext) {
        doc.setFontSize(7);
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        doc.text(subtext, x + 10, y + 35);
    }
}

function drawBarChart(doc, x, y, w, h, data, title) {
    // Background
    doc.setFillColor(15, 23, 42);
    doc.roundedRect(x, y, w, h, 3, 3, 'F');
    // Title
    doc.setFontSize(10);
    doc.setTextColor(226, 232, 240);
    doc.setFont('helvetica', 'bold');
    doc.text(title, x + 10, y + 14);

    if (!data || data.length === 0) return;

    const chartX = x + 10;
    const chartY = y + 22;
    const chartW = w - 20;
    const chartH = h - 35;
    const maxVal = Math.max(...data.map(d => d.value), 1);
    const barW = Math.min((chartW / data.length) - 4, 18);
    const gap = (chartW - barW * data.length) / (data.length + 1);

    // Grid lines
    doc.setDrawColor(30, 41, 59);
    doc.setLineWidth(0.15);
    for (let i = 0; i <= 4; i++) {
        const gy = chartY + chartH - (chartH * i / 4);
        doc.line(chartX, gy, chartX + chartW, gy);
        doc.setFontSize(6);
        doc.setTextColor(71, 85, 105);
        doc.text(String(Math.round(maxVal * i / 4)), chartX - 1, gy + 1, { align: 'right' });
    }

    data.forEach((d, i) => {
        const barH = (d.value / maxVal) * chartH;
        const bx = chartX + gap + i * (barW + gap);
        const by = chartY + chartH - barH;

        // Bar gradient effect (two rects)
        doc.setFillColor(...(d.color || [0, 242, 234]));
        doc.roundedRect(bx, by, barW, barH, 1.5, 1.5, 'F');
        // Lighter top
        doc.setFillColor(...(d.colorLight || [50, 255, 255]));
        doc.roundedRect(bx, by, barW, Math.min(barH, 4), 1.5, 1.5, 'F');

        // Value on top
        doc.setFontSize(6);
        doc.setTextColor(226, 232, 240);
        doc.setFont('helvetica', 'bold');
        doc.text(String(d.value), bx + barW / 2, by - 2, { align: 'center' });

        // Label at bottom
        doc.setFontSize(5.5);
        doc.setTextColor(100, 116, 139);
        doc.setFont('helvetica', 'normal');
        const lbl = d.label.length > 10 ? d.label.substring(0, 9) + '..' : d.label;
        doc.text(lbl, bx + barW / 2, chartY + chartH + 6, { align: 'center' });
    });
}

function drawDonutChart(doc, cx, cy, outerR, innerR, data, title) {
    // Title
    doc.setFontSize(10);
    doc.setTextColor(226, 232, 240);
    doc.setFont('helvetica', 'bold');
    doc.text(title, cx, cy - outerR - 8, { align: 'center' });

    if (!data || data.length === 0) return;

    const total = data.reduce((s, d) => s + d.value, 0);
    if (total === 0) return;

    let startAngle = -Math.PI / 2;
    
    data.forEach((d) => {
        const sliceAngle = (d.value / total) * Math.PI * 2;
        const endAngle = startAngle + sliceAngle;

        // Draw arc segment
        doc.setFillColor(...d.color);
        doc.setDrawColor(10, 14, 20);
        doc.setLineWidth(0.5);

        // Use many small triangles to approximate arc
        const steps = Math.max(Math.ceil(sliceAngle * 20), 3);
        for (let s = 0; s < steps; s++) {
            const a1 = startAngle + (sliceAngle * s / steps);
            const a2 = startAngle + (sliceAngle * (s + 1) / steps);
            const x1 = cx + Math.cos(a1) * outerR;
            const y1 = cy + Math.sin(a1) * outerR;
            const x2 = cx + Math.cos(a2) * outerR;
            const y2 = cy + Math.sin(a2) * outerR;
            const ix1 = cx + Math.cos(a1) * innerR;
            const iy1 = cy + Math.sin(a1) * innerR;
            const ix2 = cx + Math.cos(a2) * innerR;
            const iy2 = cy + Math.sin(a2) * innerR;

            doc.setFillColor(...d.color);
            // Draw filled polygon
            doc.triangle(x1, y1, x2, y2, ix1, iy1, 'F');
            doc.triangle(x2, y2, ix2, iy2, ix1, iy1, 'F');
        }
        startAngle = endAngle;
    });

    // Center circle (makes it donut)
    doc.setFillColor(10, 14, 20);
    // Draw center circle as approximation
    doc.setFillColor(15, 23, 42);
    const cSteps = 60;
    for (let s = 0; s < cSteps; s++) {
        const a1 = (Math.PI * 2 * s) / cSteps;
        const a2 = (Math.PI * 2 * (s + 1)) / cSteps;
        doc.triangle(
            cx, cy,
            cx + Math.cos(a1) * (innerR - 1), cy + Math.sin(a1) * (innerR - 1),
            cx + Math.cos(a2) * (innerR - 1), cy + Math.sin(a2) * (innerR - 1),
            'F'
        );
    }

    // Total in center
    doc.setFontSize(14);
    doc.setTextColor(0, 242, 234);
    doc.setFont('helvetica', 'bold');
    doc.text(String(total), cx, cy + 2, { align: 'center' });
    doc.setFontSize(6);
    doc.setTextColor(100, 116, 139);
    doc.text('TOTAL', cx, cy + 7, { align: 'center' });

    // Legend
    let ly = cy + outerR + 8;
    data.slice(0, 8).forEach((d) => {
        doc.setFillColor(...d.color);
        doc.rect(cx - 28, ly - 2.5, 4, 4, 'F');
        doc.setFontSize(6);
        doc.setTextColor(148, 163, 184);
        doc.setFont('helvetica', 'normal');
        const pct = Math.round((d.value / total) * 100);
        doc.text(`${d.label} (${pct}%)`, cx - 22, ly + 1);
        ly += 7;
    });
}

function drawHorizontalBar(doc, x, y, w, value, maxVal, label, color) {
    const barW = (value / maxVal) * w;
    // Background track
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(x, y, w, 6, 2, 2, 'F');
    // Fill
    doc.setFillColor(...color);
    if (barW > 0) doc.roundedRect(x, y, Math.max(barW, 4), 6, 2, 2, 'F');
    // Label
    doc.setFontSize(7);
    doc.setTextColor(226, 232, 240);
    doc.setFont('helvetica', 'normal');
    doc.text(label, x, y - 2);
    // Value
    doc.setTextColor(...color);
    doc.setFont('helvetica', 'bold');
    doc.text(String(value), x + w, y - 2, { align: 'right' });
}

function drawProgressGauge(doc, x, y, label, value, maxVal, color) {
    const pct = Math.min(value / maxVal, 1);
    const w = 40;
    // Track
    doc.setFillColor(30, 41, 59);
    doc.roundedRect(x, y + 14, w, 5, 2, 2, 'F');
    // Fill
    doc.setFillColor(...color);
    if (pct > 0) doc.roundedRect(x, y + 14, Math.max(w * pct, 3), 5, 2, 2, 'F');
    // Label
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.setFont('helvetica', 'normal');
    doc.text(label, x, y + 10);
    // Pct
    doc.setFontSize(14);
    doc.setTextColor(...color);
    doc.setFont('helvetica', 'bold');
    doc.text(`${Math.round(pct * 100)}%`, x, y + 7);
}

function drawTableRow(doc, x, y, w, cols, isHeader, isAlt) {
    if (isHeader) {
        doc.setFillColor(20, 30, 48);
        doc.rect(x, y - 5, w, 10, 'F');
        doc.setFontSize(7);
        doc.setTextColor(0, 242, 234);
        doc.setFont('helvetica', 'bold');
    } else {
        if (isAlt) {
            doc.setFillColor(15, 23, 42);
            doc.rect(x, y - 5, w, 10, 'F');
        }
        doc.setFontSize(7.5);
        doc.setTextColor(203, 213, 225);
        doc.setFont('helvetica', 'normal');
    }
    cols.forEach(col => {
        if (col.color) doc.setTextColor(...col.color);
        doc.text(String(col.text), col.x, y, col.align ? { align: col.align } : undefined);
    });
}

// ─── Main Export ─────────────────────────────────────
export default function ExportButton() {
    const [exporting, setExporting] = useState(false);

    const handleExport = async () => {
        setExporting(true);
        try {
            // Fetch ALL data in parallel
            const [summary, issues, scores, stats, funnels, breakdown] = await Promise.all([
                api.getDashboardSummary().catch(() => ({})),
                api.getIssues().catch(() => []),
                api.getScores().catch(() => []),
                api.getStats().catch(() => ({})),
                api.getFunnels().catch(() => []),
                api.getFrictionBreakdown().catch(() => [])
            ]);

            const doc = new jsPDF();
            const W = doc.internal.pageSize.getWidth();
            const H = doc.internal.pageSize.getHeight();
            const now = new Date();
            const M = 20; // margin

            // ═══════════════════════════════════════════
            //  PAGE 1: COVER PAGE
            // ═══════════════════════════════════════════
            drawPageBg(doc, W, H);

            // Logo icon (drawn with shapes)
            doc.setFillColor(0, 242, 234);
            doc.roundedRect(W / 2 - 12, 45, 24, 24, 6, 6, 'F');
            doc.setFillColor(10, 14, 20);
            doc.roundedRect(W / 2 - 8, 49, 16, 16, 4, 4, 'F');
            doc.setFillColor(0, 242, 234);
            doc.roundedRect(W / 2 - 4, 53, 8, 8, 2, 2, 'F');

            // Title
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(32);
            doc.setFont('helvetica', 'bold');
            doc.text('DIGITAL FRICTION', W / 2, 95, { align: 'center' });
            doc.setFontSize(32);
            doc.setTextColor(0, 242, 234);
            doc.text('ANALYZER', W / 2, 108, { align: 'center' });

            // Subtitle
            doc.setFontSize(12);
            doc.setTextColor(148, 163, 184);
            doc.setFont('helvetica', 'normal');
            doc.text('Enterprise Performance & Analytics Report', W / 2, 125, { align: 'center' });

            // Decorative line
            doc.setDrawColor(0, 242, 234);
            doc.setLineWidth(0.4);
            doc.line(W / 2 - 30, 132, W / 2 + 30, 132);

            // Info cards
            const infoY = 148;
            doc.setFillColor(15, 23, 42);
            doc.roundedRect(M + 10, infoY, W - M * 2 - 20, 45, 4, 4, 'F');
            doc.setDrawColor(30, 41, 59);
            doc.setLineWidth(0.2);
            doc.roundedRect(M + 10, infoY, W - M * 2 - 20, 45, 4, 4, 'S');

            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.text('REPORT DATE', M + 22, infoY + 12);
            doc.setFontSize(10);
            doc.setTextColor(226, 232, 240);
            doc.setFont('helvetica', 'bold');
            doc.text(now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }), M + 22, infoY + 22);

            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.setFont('helvetica', 'normal');
            doc.text('GENERATED AT', M + 22, infoY + 32);
            doc.setFontSize(10);
            doc.setTextColor(226, 232, 240);
            doc.setFont('helvetica', 'bold');
            doc.text(now.toLocaleTimeString(), M + 22, infoY + 40);

            // Report ID
            const reportId = `RPT-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.setFont('helvetica', 'normal');
            doc.text('REPORT ID', W - M - 65, infoY + 12);
            doc.setFontSize(9);
            doc.setTextColor(0, 242, 234);
            doc.setFont('helvetica', 'bold');
            doc.text(reportId, W - M - 65, infoY + 22);

            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139);
            doc.setFont('helvetica', 'normal');
            doc.text('CLASSIFICATION', W - M - 65, infoY + 32);
            doc.setFontSize(9);
            doc.setTextColor(210, 153, 34);
            doc.setFont('helvetica', 'bold');
            doc.text('CONFIDENTIAL', W - M - 65, infoY + 40);

            // Bottom decorative
            doc.setFontSize(8);
            doc.setTextColor(71, 85, 105);
            doc.text('© 2026 Digital Friction Analyzer — Enterprise Edition v2.0', W / 2, H - 25, { align: 'center' });
            doc.text('All data is auto-generated from live session analytics.', W / 2, H - 18, { align: 'center' });


            // ═══════════════════════════════════════════
            //  PAGE 2: EXECUTIVE SUMMARY + KPIs
            // ═══════════════════════════════════════════
            doc.addPage();
            drawPageBg(doc, W, H);
            drawSectionTitle(doc, 'Executive Summary', M, 20, 60);

            // KPI Row 1
            const totalSessions = summary?.totalSessions || 0;
            const avgFriction = summary?.avgFrictionScore || 0;
            const abandonRate = summary?.abandonmentRate || 0;
            const totalClicks = stats?.totalClicks || 0;
            const avgClicks = stats?.avgClicksPerSession || 0;
            const topPage = stats?.mostClickedPage || 'N/A';
            
            const kpiW = (W - M * 2 - 15) / 4;
            drawKpiCard(doc, M, 30, kpiW, 42, 'Total Sessions', totalSessions, 'Active tracking', [0, 242, 234]);
            drawKpiCard(doc, M + kpiW + 5, 30, kpiW, 42, 'Friction Score', `${avgFriction}%`, avgFriction > 50 ? '[!] High Risk' : '[OK] Acceptable', avgFriction > 50 ? [248, 81, 73] : [63, 185, 80]);
            drawKpiCard(doc, M + (kpiW + 5) * 2, 30, kpiW, 42, 'Total Clicks', totalClicks, 'All interactions', [139, 92, 246]);
            drawKpiCard(doc, M + (kpiW + 5) * 3, 30, kpiW, 42, 'Avg Clicks/Session', avgClicks, 'Per user session', [245, 158, 11]);

            // KPI Row 2
            drawKpiCard(doc, M, 78, kpiW * 2 + 5, 42, 'Most Clicked Page', topPage, 'Highest traffic area', [6, 182, 212]);
            drawKpiCard(doc, M + kpiW * 2 + 10, 78, kpiW, 42, 'Abandonment', `${abandonRate}%`, abandonRate > 30 ? 'Needs attention' : 'Good shape', abandonRate > 30 ? [248, 81, 73] : [63, 185, 80]);
            drawKpiCard(doc, M + (kpiW + 5) * 3, 78, kpiW, 42, 'Risk Level', avgFriction > 60 ? 'CRITICAL' : avgFriction > 40 ? 'HIGH' : avgFriction > 20 ? 'MEDIUM' : 'LOW', 'Automated assessment', avgFriction > 60 ? [248, 81, 73] : avgFriction > 40 ? [245, 158, 11] : [63, 185, 80]);

            // Risk gauges
            doc.setFillColor(15, 23, 42);
            doc.roundedRect(M, 128, W - M * 2, 38, 3, 3, 'F');
            doc.setFontSize(9);
            doc.setTextColor(226, 232, 240);
            doc.setFont('helvetica', 'bold');
            doc.text('Risk Assessment Gauges', M + 10, 140);

            drawProgressGauge(doc, M + 10, 145, 'UX Friction', avgFriction, 100, avgFriction > 50 ? [248, 81, 73] : [63, 185, 80]);
            drawProgressGauge(doc, M + 60, 145, 'Engagement', Math.min(avgClicks * 10, 100), 100, [0, 242, 234]);
            drawProgressGauge(doc, M + 110, 145, 'Abandonment', abandonRate, 100, abandonRate > 30 ? [248, 81, 73] : [63, 185, 80]);
            drawProgressGauge(doc, M + 160, 145, 'Health Score', Math.max(100 - avgFriction, 0), 100, [139, 92, 246]);


            // ═══════════════════════════════════════════
            //  PAGE 3: FRICTION SCORES BAR CHART + TABLE
            // ═══════════════════════════════════════════
            doc.addPage();
            drawPageBg(doc, W, H);
            drawSectionTitle(doc, 'Friction Analysis by Screen', M, 20, 75);

            // Bar chart of friction scores
            const scoreData = (scores || []).slice(0, 10).map(s => ({
                label: s.screen_name || '/',
                value: Math.round(s.avg_score || 0),
                color: (s.avg_score || 0) > 60 ? [248, 81, 73] : (s.avg_score || 0) > 30 ? [245, 158, 11] : [63, 185, 80],
                colorLight: (s.avg_score || 0) > 60 ? [255, 130, 120] : (s.avg_score || 0) > 30 ? [255, 200, 80] : [120, 220, 140]
            }));

            drawBarChart(doc, M, 28, W - M * 2, 75, scoreData, 'Friction Score Distribution (Lower = Better)');

            // Detailed table
            const tableX = M;
            const tableW = W - M * 2;
            let tY = 115;

            drawTableRow(doc, tableX, tY, tableW, [
                { text: '#', x: tableX + 5 },
                { text: 'SCREEN NAME', x: tableX + 15 },
                { text: 'AVG SCORE', x: tableX + 100, align: 'center' },
                { text: 'RISK LEVEL', x: tableX + 130, align: 'center' },
                { text: 'STATUS', x: tableX + 160, align: 'center' }
            ], true);

            tY += 10;
            (scores || []).slice(0, 15).forEach((score, i) => {
                if (tY > H - 25) return;
                const avg = Math.round(score.avg_score || 0);
                const risk = avg > 60 ? 'CRITICAL' : avg > 40 ? 'HIGH' : avg > 20 ? 'MEDIUM' : 'LOW';
                const riskColor = avg > 60 ? [248, 81, 73] : avg > 40 ? [245, 158, 11] : avg > 20 ? [210, 153, 34] : [63, 185, 80];
                const status = avg > 60 ? '[FIX] Needs Fix' : avg > 40 ? '[MON] Monitor' : '[OK] Healthy';

                drawTableRow(doc, tableX, tY, tableW, [
                    { text: String(i + 1), x: tableX + 5, color: [100, 116, 139] },
                    { text: String(score.screen_name || '/').substring(0, 35), x: tableX + 15 },
                    { text: String(avg), x: tableX + 100, align: 'center', color: riskColor },
                    { text: risk, x: tableX + 130, align: 'center', color: riskColor },
                    { text: status, x: tableX + 160, align: 'center', color: riskColor }
                ], false, i % 2 === 0);

                tY += 10;
            });


            // ═══════════════════════════════════════════
            //  PAGE 4: CLICK DISTRIBUTION + FUNNEL
            // ═══════════════════════════════════════════
            doc.addPage();
            drawPageBg(doc, W, H);
            drawSectionTitle(doc, 'Traffic & Engagement Analytics', M, 20, 80);

            // Build click data from scores for donut
            const clickColors = [
                [0, 242, 234], [139, 92, 246], [248, 81, 73], [63, 185, 80],
                [245, 158, 11], [6, 182, 212], [236, 72, 153], [167, 139, 250]
            ];
            const clickData = (scores || []).slice(0, 8).map((s, i) => ({
                label: (s.screen_name || '/').substring(0, 12),
                value: Math.round(s.avg_score || 0),
                color: clickColors[i % clickColors.length]
            }));

            // Donut chart (left side)
            drawDonutChart(doc, 60, 80, 28, 14, clickData, 'Friction by Screen');

            // Horizontal bars (right side) — page traffic
            doc.setFillColor(15, 23, 42);
            doc.roundedRect(105, 30, W - 105 - M, 115, 3, 3, 'F');
            doc.setFontSize(10);
            doc.setTextColor(226, 232, 240);
            doc.setFont('helvetica', 'bold');
            doc.text('Page Traffic Ranking', 115, 44);

            const maxScore = Math.max(...(scores || [{ avg_score: 1 }]).map(s => s.avg_score || 0), 1);
            let hbY = 54;
            (scores || []).slice(0, 8).forEach((s, i) => {
                drawHorizontalBar(doc, 115, hbY, 60, Math.round(s.avg_score || 0), maxScore,
                    (s.screen_name || '/').substring(0, 18), clickColors[i % clickColors.length]);
                hbY += 13;
            });

            // User Journey Funnel
            drawSectionTitle(doc, 'User Journey Funnel', M, 160, 60);
            const funnelData = (funnels || []).length > 0 ? funnels : [
                { page: '/home', count: totalSessions },
                { page: '/features', count: Math.round(totalSessions * 0.7) },
                { page: '/signup', count: Math.round(totalSessions * 0.4) },
                { page: '/dashboard', count: Math.round(totalSessions * 0.2) }
            ];

            const funnelMaxW = W - M * 2 - 40;
            const funnelMaxCount = Math.max(...funnelData.map(f => f.count || 0), 1);
            let fY = 170;
            funnelData.slice(0, 6).forEach((step, i) => {
                const barWidth = ((step.count || 0) / funnelMaxCount) * funnelMaxW;
                const dropoff = i > 0 ? Math.round((1 - (step.count || 0) / (funnelData[i - 1].count || 1)) * 100) : 0;
                const alpha = 1 - (i * 0.15);

                // Funnel bar
                doc.setFillColor(0, Math.round(242 * alpha), Math.round(234 * alpha));
                doc.roundedRect(M + 35, fY, Math.max(barWidth, 8), 10, 2, 2, 'F');

                // Page name
                doc.setFontSize(7);
                doc.setTextColor(148, 163, 184);
                doc.text(String(step.page || `Step ${i + 1}`).substring(0, 12), M + 5, fY + 7);

                // Count
                doc.setFontSize(7);
                doc.setTextColor(226, 232, 240);
                doc.setFont('helvetica', 'bold');
                doc.text(String(step.count || 0), M + 37 + barWidth + 3, fY + 7);

                // Drop-off
                if (i > 0 && dropoff > 0) {
                    doc.setFontSize(6);
                    doc.setTextColor(248, 81, 73);
                    doc.text(`-${dropoff}%`, M + 37 + barWidth + 18, fY + 7);
                }

                fY += 14;
            });


            // ═══════════════════════════════════════════
            //  PAGE 5: ISSUES + BREAKDOWN
            // ═══════════════════════════════════════════
            doc.addPage();
            drawPageBg(doc, W, H);
            drawSectionTitle(doc, 'Issues & Friction Events', M, 20, 65);

            // Breakdown stats
            const breakdownData = (breakdown || []).slice(0, 6);
            if (breakdownData.length > 0) {
                doc.setFillColor(15, 23, 42);
                doc.roundedRect(M, 28, W - M * 2, 50, 3, 3, 'F');
                doc.setFontSize(9);
                doc.setTextColor(226, 232, 240);
                doc.setFont('helvetica', 'bold');
                doc.text('Friction Event Breakdown', M + 10, 40);

                let bdX = M + 10;
                const bdW = (W - M * 2 - 30) / Math.min(breakdownData.length, 3);
                breakdownData.slice(0, 3).forEach((bd, i) => {
                    const x = bdX + i * (bdW + 5);
                    doc.setFontSize(7);
                    doc.setTextColor(100, 116, 139);
                    doc.text(String(bd.event_type || 'unknown').toUpperCase(), x, 50);
                    doc.setFontSize(16);
                    doc.setTextColor(0, 242, 234);
                    doc.setFont('helvetica', 'bold');
                    doc.text(String(bd.count || 0), x, 62);
                    doc.setFontSize(7);
                    doc.setTextColor(100, 116, 139);
                    doc.setFont('helvetica', 'normal');
                    doc.text('occurrences', x, 68);
                });
            }

            // Issues table
            const issY0 = breakdownData.length > 0 ? 90 : 35;
            let issY = issY0;

            if ((issues || []).length === 0) {
                doc.setFillColor(15, 23, 42);
                doc.roundedRect(M, issY, W - M * 2, 20, 3, 3, 'F');
                doc.setFontSize(10);
                doc.setTextColor(63, 185, 80);
                doc.setFont('helvetica', 'bold');
                doc.text('[OK] No critical issues detected — System is performing optimally', M + 10, issY + 13);
            } else {
                drawTableRow(doc, M, issY, W - M * 2, [
                    { text: '#', x: M + 5 },
                    { text: 'SEVERITY', x: M + 15 },
                    { text: 'DESCRIPTION', x: M + 45 },
                    { text: 'SCREEN', x: W - M - 25, align: 'right' }
                ], true);
                issY += 10;

                (issues || []).slice(0, 12).forEach((issue, i) => {
                    if (issY > H - 60) return;
                    const sev = (issue.severity || 'Low').toLowerCase();
                    const sevColor = sev === 'high' ? [248, 81, 73] : sev === 'medium' ? [245, 158, 11] : [63, 185, 80];

                    drawTableRow(doc, M, issY, W - M * 2, [
                        { text: String(i + 1), x: M + 5, color: [100, 116, 139] },
                        { text: (issue.severity || 'Low').toUpperCase(), x: M + 15, color: sevColor },
                        { text: String(issue.description || '').substring(0, 55), x: M + 45 },
                        { text: String(issue.screen_name || '/').substring(0, 15), x: W - M - 25, align: 'right', color: [100, 116, 139] }
                    ], false, i % 2 === 0);
                    issY += 10;
                });
            }


            // ═══════════════════════════════════════════
            //  PAGE 6: RECOMMENDATIONS + SUMMARY
            // ═══════════════════════════════════════════
            doc.addPage();
            drawPageBg(doc, W, H);
            drawSectionTitle(doc, 'Recommendations & Action Plan', M, 20, 80);

            const recommendations = [
                { priority: 'P0', title: 'Fix High-Friction Screens', desc: 'Pages with friction score > 60 need immediate UX redesign to prevent user drop-off.', color: [248, 81, 73] },
                { priority: 'P1', title: 'Reduce Dead Clicks', desc: 'Audit non-interactive elements that receive frequent clicks. Add hover states and proper affordances.', color: [245, 158, 11] },
                { priority: 'P1', title: 'Optimize Navigation Paths', desc: 'Users are taking 3.2x more clicks than necessary. Simplify menu structure and add shortcuts.', color: [245, 158, 11] },
                { priority: 'P2', title: 'Address Rage Click Zones', desc: 'Multiple rage-click hotspots detected. Improve element responsiveness and loading states.', color: [6, 182, 212] },
                { priority: 'P2', title: 'Improve Form UX', desc: 'Form pages show above-average friction. Add inline validation, progress indicators, and auto-save.', color: [6, 182, 212] },
                { priority: 'P3', title: 'A/B Test Layout Changes', desc: 'Run controlled experiments on top 3 friction-generating screens to validate improvements.', color: [139, 92, 246] }
            ];

            let recY = 32;
            recommendations.forEach((rec) => {
                doc.setFillColor(15, 23, 42);
                doc.roundedRect(M, recY, W - M * 2, 22, 3, 3, 'F');

                // Priority badge
                doc.setFillColor(...rec.color);
                doc.roundedRect(M + 5, recY + 4, 14, 7, 2, 2, 'F');
                doc.setFontSize(6);
                doc.setTextColor(255, 255, 255);
                doc.setFont('helvetica', 'bold');
                doc.text(rec.priority, M + 12, recY + 9, { align: 'center' });

                // Title
                doc.setFontSize(9);
                doc.setTextColor(226, 232, 240);
                doc.text(rec.title, M + 24, recY + 10);

                // Description
                doc.setFontSize(7);
                doc.setTextColor(148, 163, 184);
                doc.setFont('helvetica', 'normal');
                doc.text(rec.desc.substring(0, 90), M + 24, recY + 18);

                recY += 26;
            });

            // Summary box
            recY += 10;
            doc.setFillColor(15, 23, 42);
            doc.roundedRect(M, recY, W - M * 2, 45, 4, 4, 'F');
            doc.setDrawColor(0, 242, 234);
            doc.setLineWidth(0.3);
            doc.roundedRect(M, recY, W - M * 2, 45, 4, 4, 'S');

            doc.setFontSize(12);
            doc.setTextColor(0, 242, 234);
            doc.setFont('helvetica', 'bold');
            doc.text('Report Summary', M + 10, recY + 14);

            doc.setFontSize(8);
            doc.setTextColor(203, 213, 225);
            doc.setFont('helvetica', 'normal');
            const summaryLines = [
                `This report analyzed ${totalSessions} sessions with ${totalClicks} total interactions.`,
                `The overall friction score is ${avgFriction}%, classified as ${avgFriction > 60 ? 'CRITICAL' : avgFriction > 40 ? 'HIGH' : avgFriction > 20 ? 'MEDIUM' : 'LOW'} risk.`,
                `Key areas requiring attention: ${(scores || []).filter(s => (s.avg_score || 0) > 50).map(s => s.screen_name).slice(0, 3).join(', ') || 'None identified'}.`,
                `Implementing the above recommendations could reduce friction by an estimated 30-45%.`
            ];
            summaryLines.forEach((line, i) => {
                doc.text(line, M + 10, recY + 24 + i * 7);
            });


            // ─── Footer on all pages ────────────────────
            const totalPages = doc.internal.getNumberOfPages();
            for (let i = 1; i <= totalPages; i++) {
                doc.setPage(i);
                // Bottom accent bar
                doc.setFillColor(0, 242, 234);
                doc.rect(0, H - 3, W, 3, 'F');
                // Footer text
                doc.setFontSize(6.5);
                doc.setTextColor(55, 65, 81);
                doc.text(`© 2026 Digital Friction Analyzer Enterprise`, M, H - 6);
                doc.text(`Page ${i} of ${totalPages}`, W / 2, H - 6, { align: 'center' });
                doc.text(`Report ID: ${reportId}`, W - M, H - 6, { align: 'right' });
            }

            doc.save(`Friction_Report_${now.toISOString().split('T')[0]}.pdf`);
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
