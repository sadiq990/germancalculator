// ══════════════════════════════════════════════════
// FILE: src/core/services/pdfService.ts
// PURPOSE: Generate legally-compliant German Arbeitszeitnachweis PDF using expo-print
// ══════════════════════════════════════════════════

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { format, getISODay } from 'date-fns';
import { de as dateFnsDe } from 'date-fns/locale';
import type { WorkSession, UserSettings, Employer, ReportFilter } from '@core/types/models';

function formatTimeFromMs(ms: number): string {
  const date = new Date(ms);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function formatDateDE(ms: number): string {
  return format(new Date(ms), 'dd.MM.yyyy');
}

function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

function getGermanWeekday(ms: number): string {
  const weekdays = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
  const isoDay = getISODay(new Date(ms)); // 1 = Monday, 7 = Sunday
  return weekdays[isoDay - 1] ?? 'Unbekannt';
}

function getGermanMonthName(month: number): string {
  const months = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
  ];
  return months[month - 1] ?? 'Unbekannt';
}

function truncateNote(note: string | null, maxLen = 40): string {
  if (note === null) return '';
  return note.length > maxLen ? note.slice(0, maxLen - 3) + '...' : note;
}

function buildTableRows(sessions: WorkSession[]): string {
  if (sessions.length === 0) {
    return '<tr><td colspan="7" style="text-align:center;color:#9E9E9E;padding:20px;">Keine Schichten eingetragen</td></tr>';
  }

  return sessions
    .filter((s) => s.endTime !== null && s.durationMinutes !== null)
    .map((s, index) => {
      const bgColor = index % 2 === 0 ? '#FFFFFF' : '#F9F9F9';
      const endTime = s.endTime as number;
      const durationMinutes = s.durationMinutes as number;
      return `
        <tr style="background:${bgColor};">
          <td>${formatDateDE(s.startTime)}</td>
          <td>${getGermanWeekday(s.startTime)}</td>
          <td>${formatTimeFromMs(s.startTime)}</td>
          <td>${formatTimeFromMs(endTime)}</td>
          <td>00:00</td>
          <td><strong>${formatDuration(durationMinutes)}</strong></td>
          <td style="color:#616161;">${truncateNote(s.note)}</td>
        </tr>
      `;
    })
    .join('');
}

function buildWatermarkStyle(isPro: boolean): string {
  if (isPro) return '';
  return `
    .watermark {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%) rotate(-30deg);
      font-size: 36px;
      color: rgba(0, 0, 0, 0.12);
      white-space: nowrap;
      font-weight: bold;
      pointer-events: none;
      z-index: 9999;
      letter-spacing: 2px;
    }
  `;
}

function buildHtmlTemplate(
  sessions: WorkSession[],
  settings: UserSettings,
  employers: Employer[],
  filter: ReportFilter,
  isPro: boolean,
): string {
  const completedSessions = sessions.filter(
    (s) => s.endTime !== null && s.durationMinutes !== null,
  );
  const totalMinutes = completedSessions.reduce(
    (acc, s) => acc + (s.durationMinutes ?? 0),
    0,
  );

  const defaultEmployer = employers.find((e) => e.isDefault) ?? employers[0];
  const employerName =
    defaultEmployer?.name ?? settings.displayName ?? 'Unbekannt';
  const displayName = settings.displayName.trim() || 'Unbekannt';

  const monthName = getGermanMonthName(filter.month);
  const monthYear = `${monthName} ${filter.year}`;
  const monthYearShort = `${String(filter.month).padStart(2, '0')}/${filter.year}`;

  // Earnings calculation
  let earningsRow = '';
  if (defaultEmployer?.hourlyRate !== null && defaultEmployer?.hourlyRate !== undefined) {
    const earnings = (totalMinutes / 60) * defaultEmployer.hourlyRate;
    const formatted = earnings.toLocaleString('de-DE', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    earningsRow = `
      <tr>
        <td colspan="5" style="text-align:right;font-weight:600;">Geschätzte Vergütung:</td>
        <td colspan="2" style="font-weight:700;">${formatted} €</td>
      </tr>
    `;
  }

  return `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Arbeitszeitnachweis ${monthYear}</title>
  <style>
    @page {
      size: A4;
      margin: 20mm 15mm;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, 'Helvetica Neue', Arial, sans-serif;
      color: #2D2D2D;
      font-size: 11pt;
      line-height: 1.4;
    }
    ${buildWatermarkStyle(isPro)}
    .header { margin-bottom: 24px; border-bottom: 2px solid #1558C9; padding-bottom: 12px; }
    .header h1 {
      font-size: 20pt;
      font-weight: 700;
      color: #1558C9;
      letter-spacing: 1px;
      margin-bottom: 4px;
    }
    .header h2 {
      font-size: 14pt;
      font-weight: 600;
      color: #2D2D2D;
    }
    .meta-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 20px;
      padding: 12px;
      background: #F9F9F9;
      border: 1px solid #E0E0E0;
      border-radius: 4px;
    }
    .meta-item { display: flex; flex-direction: column; }
    .meta-label { font-size: 9pt; color: #9E9E9E; text-transform: uppercase; letter-spacing: 0.5px; }
    .meta-value { font-size: 11pt; font-weight: 600; color: #1A1A1A; }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 16px;
      font-size: 10pt;
    }
    thead tr {
      background: #1558C9;
      color: white;
    }
    thead th {
      padding: 8px 6px;
      text-align: left;
      font-weight: 600;
      font-size: 9pt;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    tbody td {
      padding: 7px 6px;
      border-bottom: 1px solid #E0E0E0;
    }
    .totals-row {
      margin-bottom: 24px;
    }
    .totals-row table {
      margin-bottom: 0;
    }
    .totals-row tfoot tr {
      background: #E8EFFD;
    }
    .totals-row tfoot td {
      padding: 10px 6px;
      border-top: 2px solid #1558C9;
      font-size: 11pt;
    }
    .attestation {
      margin-top: 28px;
      padding: 16px;
      border: 1px solid #E0E0E0;
      border-radius: 4px;
      background: #F9F9F9;
      font-size: 10pt;
      font-style: italic;
      color: #616161;
      margin-bottom: 32px;
    }
    .signatures {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-top: 16px;
    }
    .signature-block { display: flex; flex-direction: column; gap: 4px; }
    .signature-line {
      border-bottom: 1px solid #2D2D2D;
      height: 48px;
      margin-bottom: 4px;
    }
    .signature-label { font-size: 9pt; color: #616161; }
    .place-date {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 28px;
    }
    .place-date-label { font-size: 10pt; color: #616161; white-space: nowrap; }
    .place-date-line { flex: 1; border-bottom: 1px solid #2D2D2D; height: 24px; }
    .footer {
      margin-top: 32px;
      padding-top: 8px;
      border-top: 1px solid #E0E0E0;
      font-size: 8pt;
      color: #9E9E9E;
      text-align: center;
    }
    .page-number { position: fixed; bottom: 8mm; right: 15mm; font-size: 9pt; color: #9E9E9E; }
  </style>
</head>
<body>
  ${!isPro ? '<div class="watermark">PROBEVERSION — Stundenrechner Pro</div>' : ''}
  
  <div class="header">
    <h1>ARBEITSZEITNACHWEIS</h1>
    <h2>${monthYear}</h2>
  </div>

  <div class="meta-grid">
    <div class="meta-item">
      <span class="meta-label">Name</span>
      <span class="meta-value">${displayName}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Arbeitgeber</span>
      <span class="meta-value">${employerName}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Monat/Jahr</span>
      <span class="meta-value">${monthYearShort}</span>
    </div>
    <div class="meta-item">
      <span class="meta-label">Schichten</span>
      <span class="meta-value">${completedSessions.length}</span>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Datum</th>
        <th>Wochentag</th>
        <th>Beginn</th>
        <th>Ende</th>
        <th>Pause</th>
        <th>Arbeitszeit</th>
        <th>Bemerkung</th>
      </tr>
    </thead>
    <tbody>
      ${buildTableRows(completedSessions)}
    </tbody>
    <tfoot>
      <tr style="background:#E8EFFD;">
        <td colspan="5" style="text-align:right;font-weight:600;">Gesamt Arbeitsstunden:</td>
        <td colspan="2" style="font-weight:700;font-size:12pt;">${formatDuration(totalMinutes)}</td>
      </tr>
      ${earningsRow}
    </tfoot>
  </table>

  <div class="attestation">
    Ich bestätige die Richtigkeit der obigen Angaben.
  </div>

  <div class="place-date">
    <span class="place-date-label">Ort, Datum:</span>
    <div class="place-date-line"></div>
  </div>

  <div class="signatures">
    <div class="signature-block">
      <div class="signature-line"></div>
      <span class="signature-label">Arbeitnehmer (Unterschrift)</span>
    </div>
    <div class="signature-block">
      <div class="signature-line"></div>
      <span class="signature-label">Arbeitgeber (Stempel/Unterschrift)</span>
    </div>
  </div>

  <div class="footer">
    Erstellt mit Stundenrechner Pro · ${format(new Date(), 'dd.MM.yyyy HH:mm', { locale: dateFnsDe })}
  </div>

  <div class="page-number">Seite 1</div>
</body>
</html>
  `.trim();
}

export interface PdfServiceResult {
  uri: string;
  filename: string;
}

export const pdfService = {
  async generateStundenzettel(
    sessions: WorkSession[],
    settings: UserSettings,
    employers: Employer[],
    filter: ReportFilter,
    isPro: boolean,
  ): Promise<PdfServiceResult> {
    const html = buildHtmlTemplate(sessions, settings, employers, filter, isPro);

    const { uri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    // Move to a named file for sharing
    const monthStr = String(filter.month).padStart(2, '0');
    const filename = `Stundenzettel_${monthStr}_${filter.year}.pdf`;
    const destUri = `${FileSystem.cacheDirectory ?? ''}${filename}`;

    await FileSystem.copyAsync({ from: uri, to: destUri });

    // Clean up temp
    try {
      await FileSystem.deleteAsync(uri, { idempotent: true });
    } catch {
      // Non-fatal
    }

    return { uri: destUri, filename };
  },

  async sharePdf(uri: string): Promise<void> {
    const isAvailable = await Sharing.isAvailableAsync();
    if (!isAvailable) {
      throw new Error('Sharing not available on this device');
    }
    await Sharing.shareAsync(uri, {
      mimeType: 'application/pdf',
      dialogTitle: 'Stundenzettel teilen',
      UTI: 'com.adobe.pdf',
    });
  },
} as const;
