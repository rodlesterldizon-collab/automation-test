import fs from 'node:fs';
import path from 'node:path';
import { Page } from '@playwright/test';
import { AxeBuilder } from '@axe-core/playwright';
import type { Result, AxeResults } from 'axe-core';

export async function runAxeScan(page: Page, url: string): Promise<Result[]> {
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForTimeout(process.env.A11Y_SETTLE_MS ? parseInt(process.env.A11Y_SETTLE_MS) : 2000);

  const axeBuilder = new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa', 'best-practice']);

  const results = await axeBuilder.analyze();
  
  await generateReports(url, results);
  return results.violations;
}

export async function generateReports(url: string, results: AxeResults) {
  const reportDir = path.join(process.cwd(), 'tests/accessibility/reports');
  fs.mkdirSync(reportDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const urlSlug = url.replace(/^https?:\/\//, '').replace(/[^a-z0-9.-]/gi, '_');
  const baseName = `${urlSlug}_${timestamp}`;
  
  const jsonPath = path.join(reportDir, `${baseName}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(results, null, 2));
  console.log(`✅ JSON accessibility report saved to: ${jsonPath}`);

  const htmlPath = path.join(reportDir, `${baseName}.html`);
  const htmlContent = createHtmlReport(url, results);
  fs.writeFileSync(htmlPath, htmlContent);
  console.log(`✅ HTML accessibility report saved to: ${htmlPath}`);
}

interface ReportRow {
  standard: string;
  issue: string;
  status: 'Fail' | 'Manual Review' | 'Pass' | 'N/A';
  nodesCount: number;
  nodesHtml?: string;
}

function createHtmlReport(url: string, results: AxeResults): string {
  const totalFail = results.violations.length;
  const totalCritical = results.violations.filter(v => v.impact === 'critical').length;
  const totalPass = results.passes.length;
  const totalManual = results.incomplete.length;
  const totalNA = results.inapplicable.length;

  const reportRows: ReportRow[] = [];

  const mapStandard = (tags: string[]) => {
    const wcagTag = tags.find(t => t.startsWith('wcag'));
    if (!wcagTag) return 'Best Practice';
    return wcagTag.toUpperCase().replace('WCAG', 'WCAG ');
  };

  const escapeHtml = (unsafe: string) => unsafe.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");

  results.violations.forEach(v => {
    const nodesHtml = v.nodes.map(n => `<code>${escapeHtml(n.target.join(', '))}</code>`).join('<br>');
    reportRows.push({
      standard: mapStandard(v.tags),
      issue: v.help,
      status: 'Fail',
      nodesCount: v.nodes.length,
      nodesHtml
    });
  });

  results.incomplete.forEach(v => {
    const nodesHtml = v.nodes.map(n => `<code>${escapeHtml(n.target.join(', '))}</code>`).join('<br>');
    reportRows.push({
      standard: mapStandard(v.tags),
      issue: v.help,
      status: 'Manual Review',
      nodesCount: v.nodes.length,
      nodesHtml
    });
  });

  results.passes.forEach(v => {
    reportRows.push({
      standard: mapStandard(v.tags),
      issue: v.help,
      status: 'Pass',
      nodesCount: v.nodes.length
    });
  });

  results.inapplicable.forEach(v => {
    reportRows.push({
      standard: mapStandard(v.tags),
      issue: v.help,
      status: 'N/A',
      nodesCount: 0
    });
  });

  // Sort report rows: Fail -> Manual -> Pass -> N/A
  const statusOrder = { 'Fail': 0, 'Manual Review': 1, 'Pass': 2, 'N/A': 3 };
  reportRows.sort((a, b) => statusOrder[a.status] - statusOrder[b.status]);

  const rowsHtml = reportRows.map(row => {
    let statusClass = '';
    switch(row.status) {
      case 'Fail': statusClass = 'status-fail'; break;
      case 'Manual Review': statusClass = 'status-manual'; break;
      case 'Pass': statusClass = 'status-pass'; break;
      case 'N/A': statusClass = 'status-na'; break;
    }
    return `
      <tr>
        <td><span class="badge ${statusClass}">${row.status}</span></td>
        <td><strong>${row.issue}</strong></td>
        <td>${row.nodesHtml ? row.nodesHtml : '<small>N/A</small>'}</td>
        <td><span class="standard-badge">${row.standard}</span></td>
      </tr>
    `;
  }).join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Accessibility Report - ${url}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        :root {
          --bg-color: #0f172a;
          --surface: #1e293b;
          --surface-hover: #334155;
          --text: #f8fafc;
          --text-muted: #94a3b8;
          --primary: #3b82f6;
          --fail: #ef4444;
          --pass: #10b981;
          --manual: #f59e0b;
          --na: #64748b;
          --border: #334155;
        }
        
        body { 
          font-family: 'Inter', sans-serif; 
          line-height: 1.6; 
          color: var(--text); 
          background-color: var(--bg-color); 
          margin: 0; 
          padding: 40px 20px; 
        }
        
        .container {
          max-width: 1200px;
          margin: 0 auto;
        }

        .header {
          margin-bottom: 40px;
          border-bottom: 1px solid var(--border);
          padding-bottom: 20px;
        }

        h1 { 
          font-size: 2.5rem;
          margin: 0 0 10px 0;
          background: linear-gradient(to right, #60a5fa, #a78bfa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        
        .url-subtitle { 
          font-size: 1.1rem; 
          color: var(--text-muted); 
        }
        
        .url-subtitle a {
          color: var(--primary);
          text-decoration: none;
        }
        
        .dashboard {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 40px;
        }
        
        .metric-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 24px;
          text-align: center;
          transition: transform 0.2s, box-shadow 0.2s;
        }
        
        .metric-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        }
        
        .metric-value {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 8px;
          line-height: 1;
        }
        
        .metric-label {
          font-size: 0.9rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }
        
        .metric-card.critical { border-top: 4px solid var(--fail); }
        .metric-card.critical .metric-value { color: var(--fail); }
        
        .metric-card.fail { border-top: 4px solid #f43f5e; }
        .metric-card.fail .metric-value { color: #f43f5e; }
        
        .metric-card.pass { border-top: 4px solid var(--pass); }
        .metric-card.pass .metric-value { color: var(--pass); }
        
        .metric-card.manual { border-top: 4px solid var(--manual); }
        .metric-card.manual .metric-value { color: var(--manual); }
        
        .metric-card.na { border-top: 4px solid var(--na); }
        .metric-card.na .metric-value { color: var(--na); }

        .table-container {
          background: var(--surface);
          border-radius: 12px;
          border: 1px solid var(--border);
          overflow: hidden;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
        }

        th, td {
          padding: 16px 24px;
          border-bottom: 1px solid var(--border);
        }

        th {
          background-color: rgba(0,0,0,0.2);
          font-weight: 600;
          color: var(--text-muted);
          text-transform: uppercase;
          font-size: 0.85rem;
          letter-spacing: 0.05em;
        }

        tbody tr:hover {
          background-color: var(--surface-hover);
        }

        tbody tr:last-child td {
          border-bottom: none;
        }

        .badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .status-fail { background-color: rgba(239, 68, 68, 0.2); color: #fca5a5; border: 1px solid rgba(239, 68, 68, 0.3); }
        .status-manual { background-color: rgba(245, 158, 11, 0.2); color: #fcd34d; border: 1px solid rgba(245, 158, 11, 0.3); }
        .status-pass { background-color: rgba(16, 185, 129, 0.2); color: #6ee7b7; border: 1px solid rgba(16, 185, 129, 0.3); }
        .status-na { background-color: rgba(100, 116, 139, 0.2); color: #cbd5e1; border: 1px solid rgba(100, 116, 139, 0.3); }

        .standard-badge {
          background-color: rgba(59, 130, 246, 0.15);
          color: #93c5fd;
          padding: 4px 8px;
          border-radius: 6px;
          font-size: 0.8rem;
          font-weight: 500;
          border: 1px solid rgba(59, 130, 246, 0.3);
        }
        
        small {
          color: var(--text-muted);
          font-size: 0.85rem;
        }

        code {
          background-color: rgba(0,0,0,0.2);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.8rem;
          color: #e2e8f0;
          word-break: break-all;
          display: inline-block;
          margin-bottom: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Accessibility Audit Report</h1>
          <div class="url-subtitle">Results for <a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></div>
        </div>

        <div class="dashboard">
          <div class="metric-card critical">
            <div class="metric-value">${totalCritical}</div>
            <div class="metric-label">Critical Issues</div>
          </div>
          <div class="metric-card fail">
            <div class="metric-value">${totalFail}</div>
            <div class="metric-label">Total Failures</div>
          </div>
          <div class="metric-card pass">
            <div class="metric-value">${totalPass}</div>
            <div class="metric-label">Passed Audits</div>
          </div>
          <div class="metric-card manual">
            <div class="metric-value">${totalManual}</div>
            <div class="metric-label">Manual Review</div>
          </div>
          <div class="metric-card na">
            <div class="metric-value">${totalNA}</div>
            <div class="metric-label">Not Applicable</div>
          </div>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr>
                <th width="15%">Status</th>
                <th width="35%">Issue</th>
                <th width="35%">Failing Elements</th>
                <th width="15%">Standard</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    </body>
    </html>
  `;
}
