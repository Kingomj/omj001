/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { TechnicianActivityLog } from "../types";
import { BUSINESS_INFO } from "../data/constants";

/**
 * Generates an official, beautifully styled PDF printable document of the technician activity log.
 * Opens print preview with dedicated print CSS so the user can directly 'Save as PDF'.
 */
export function exportAuditLogPdf(
  logs: TechnicianActivityLog[],
  activeFilter: string = "All Logs"
) {
  const currentDate = new Date().toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const currentTime = new Date().toLocaleTimeString("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const statusChangesCount = logs.filter((l) => l.action === "status_change").length;
  const checklistCount = logs.filter((l) => l.action === "checklist_update").length;
  const intakeCount = logs.filter(
    (l) => l.action === "intake_created" || l.action === "booking_converted"
  ).length;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to export the Audit Log as PDF.");
    return;
  }

  const rowsHtml = logs
    .map((log, index) => {
      const dateStr = new Date(log.timestamp).toLocaleString("en-NG", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const badgeColor =
        log.action === "status_change"
          ? "#006622"
          : log.action === "checklist_update"
          ? "#b36b00"
          : log.action === "intake_created"
          ? "#5900b3"
          : "#005580";

      return `
      <tr style="border-bottom: 1px solid #e5e7eb; font-size: 11px;">
        <td style="padding: 8px 6px; font-family: monospace; color: #6b7280;">#${index + 1}</td>
        <td style="padding: 8px 6px; font-family: monospace; white-space: nowrap;">${dateStr}</td>
        <td style="padding: 8px 6px; font-family: monospace; font-weight: bold; color: #111827;">${log.reference}</td>
        <td style="padding: 8px 6px;">
          <span style="display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; text-transform: uppercase; color: #ffffff; background-color: ${badgeColor};">
            ${log.action.replace("_", " ")}
          </span>
        </td>
        <td style="padding: 8px 6px; font-weight: 600; color: #1f2937;">
          ${log.title}
          ${log.note ? `<div style="font-size: 10px; font-weight: normal; color: #4b5563; margin-top: 3px; font-style: italic;">Note: "${log.note}"</div>` : ""}
        </td>
        <td style="padding: 8px 6px;">
          <div style="font-weight: 500; color: #111827;">${log.clientName || "—"}</div>
          <div style="font-size: 10px; color: #6b7280;">${log.deviceInfo || "—"}</div>
        </td>
        <td style="padding: 8px 6px; font-size: 10px; color: #374151; white-space: nowrap;">${log.technician || "OMJ Lead Tech"}</td>
      </tr>
    `;
    })
    .join("");

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>OMJ Repairs - Technician Activity & Audit Log Report</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 12mm 15mm;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #111827;
      background: #ffffff;
      margin: 0;
      padding: 20px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #000000;
      padding-bottom: 12px;
      margin-bottom: 16px;
    }
    .brand-title {
      font-size: 20px;
      font-weight: 800;
      letter-spacing: -0.5px;
      margin: 0;
      color: #111827;
    }
    .brand-tag {
      font-size: 11px;
      color: #059669;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .report-info {
      text-align: right;
      font-size: 11px;
      color: #4b5563;
      line-height: 1.4;
    }
    .summary-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      margin-bottom: 16px;
    }
    .summary-card {
      background: #f9fafb;
      border: 1px solid #e5e7eb;
      border-radius: 6px;
      padding: 8px 12px;
    }
    .summary-label {
      font-size: 9px;
      text-transform: uppercase;
      font-weight: bold;
      color: #6b7280;
    }
    .summary-value {
      font-size: 18px;
      font-weight: 800;
      color: #111827;
      margin-top: 2px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;
    }
    th {
      background-color: #f3f4f6;
      color: #374151;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 8px 6px;
      border-bottom: 2px solid #d1d5db;
    }
    .footer {
      margin-top: 24px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      font-size: 10px;
      color: #6b7280;
    }
    .signoff-box {
      border: 1px dashed #9ca3af;
      padding: 8px 14px;
      border-radius: 6px;
      display: inline-block;
      text-align: center;
    }
    @media print {
      body { padding: 0; }
      .no-print { display: none !important; }
      button { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 15px; padding: 10px 14px; background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; display: flex; justify-content: space-between; align-items: center;">
    <span style="font-size: 12px; font-weight: 600; color: #065f46;">
      📄 Audit Log PDF Preview ready. Click "Print / Save as PDF" below or press Ctrl+P (Cmd+P on Mac).
    </span>
    <button onclick="window.print()" style="background: #059669; color: white; border: none; padding: 6px 14px; border-radius: 6px; font-weight: bold; font-size: 12px; cursor: pointer;">
      🖨️ Print / Save as PDF
    </button>
  </div>

  <div class="header">
    <div>
      <h1 class="brand-title">OMJ REPAIRS &bull; TECHNICIAN AUDIT REPORT</h1>
      <div class="brand-tag">Professional Computer & Laptop Hardware Repairs &bull; Lagos, Nigeria</div>
      <div style="font-size: 11px; color: #4b5563; margin-top: 4px;">
        ${BUSINESS_INFO.location} &bull; Tel: ${BUSINESS_INFO.contact.phoneDisplay} &bull; Email: ${BUSINESS_INFO.contact.email}
      </div>
    </div>
    <div class="report-info">
      <div><strong>Document:</strong> Official Audit Trail</div>
      <div><strong>Generated:</strong> ${currentDate} at ${currentTime}</div>
      <div><strong>Scope:</strong> ${activeFilter} (${logs.length} logged entries)</div>
      <div><strong>System:</strong> OMJ Technician Command Center v2.4</div>
    </div>
  </div>

  <div class="summary-grid">
    <div class="summary-card">
      <div class="summary-label">Status Transitions</div>
      <div class="summary-value" style="color: #059669;">${statusChangesCount}</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Diagnostic Bench Tests</div>
      <div class="summary-value" style="color: #d97706;">${checklistCount}</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Intakes & Bookings Converted</div>
      <div class="summary-value" style="color: #7c3aed;">${intakeCount}</div>
    </div>
    <div class="summary-card">
      <div class="summary-label">Total Audit Trail Records</div>
      <div class="summary-value">${logs.length}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 30px;">#</th>
        <th style="width: 130px;">Date & Time</th>
        <th style="width: 90px;">Ticket Ref</th>
        <th style="width: 100px;">Action Type</th>
        <th>Event Title & Diagnostic Notes</th>
        <th style="width: 140px;">Client & Device</th>
        <th style="width: 110px;">Technician</th>
      </tr>
    </thead>
    <tbody>
      ${rowsHtml}
    </tbody>
  </table>

  <div class="footer">
    <div>
      This document is an immutable audit record generated by OMJ Repairs Technician Command Center.<br>
      Verify authentic tickets online at https://omj-repairs.lagos.ng/ or contact lead technician at ${BUSINESS_INFO.contact.phoneTel}.
    </div>
    <div class="signoff-box">
      <div style="font-size: 9px; text-transform: uppercase; color: #6b7280;">Technician Verification Seal</div>
      <div style="font-weight: bold; color: #111827; margin-top: 2px;">Lead Technician (OMJ)</div>
      <div style="font-size: 8px; color: #059669;">CONFIRMED & AUDITED</div>
    </div>
  </div>

  <script>
    window.addEventListener("DOMContentLoaded", () => {
      // Auto open print dialog for seamless PDF export
      setTimeout(() => {
        window.print();
      }, 500);
    });
  </script>
</body>
</html>
`;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}
