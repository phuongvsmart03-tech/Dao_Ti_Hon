'use client';

/**
 * Utility for printing administrative preschool documents reliably in any browser / iframe sandbox.
 * Generates an isolated HTML document with exact @page styles, fonts, and table rules.
 */
export function generateFullPrintHtml(
  contentHtml: string,
  title: string,
  orientation: 'portrait' | 'landscape' = 'landscape'
): string {
  const isLandscape = orientation === 'landscape';
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="utf-8" />
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Tinos:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
  <style>
    @page {
      size: ${isLandscape ? 'A4 landscape' : 'A4 portrait'};
      margin: ${isLandscape ? '8mm 10mm 8mm 10mm' : '10mm 10mm 10mm 10mm'};
    }
    * {
      box-sizing: border-box;
      font-family: 'Times New Roman', 'Tinos', 'Liberation Serif', Times, serif;
    }
    body {
      margin: 0;
      padding: 12px 14px;
      color: #000;
      background: #fff;
      font-size: ${isLandscape ? '11px' : '11.5px'};
      line-height: 1.25;
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 8px;
      page-break-inside: auto;
    }
    thead {
      display: table-header-group;
    }
    tfoot {
      display: table-footer-group;
    }
    tr, th, td {
      border: 1px solid #000;
      padding: ${isLandscape ? '3.5px 4px' : '4px'};
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      break-inside: avoid-page !important;
    }
    .official-page-break {
      page-break-after: always;
      break-after: page;
      margin-bottom: 24px;
    }
    .official-box {
      display: inline-block;
      width: 32px;
      height: 16px;
      border: 1px solid #000;
      text-align: center;
      vertical-align: middle;
      line-height: 14px;
      font-size: 11px;
      font-weight: bold;
      background: #fff;
      box-sizing: border-box;
    }
    .hygiene-row {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      margin-bottom: 4px;
    }
    .hygiene-controls {
      display: inline-flex;
      flex-direction: row;
      align-items: center;
      flex-shrink: 0;
      white-space: nowrap;
    }
    .hygiene-col1 {
      display: inline-flex;
      align-items: center;
      margin-right: 28px;
    }
    .hygiene-col2 {
      display: inline-flex;
      align-items: center;
      width: 140px;
      justify-content: flex-end;
    }
    .official-signature-grid {
      display: flex !important;
      flex-direction: row !important;
      justify-content: space-between !important;
      align-items: flex-start !important;
      width: 100% !important;
      margin-top: 18px !important;
      page-break-inside: avoid !important;
      break-inside: avoid !important;
      break-inside: avoid-page !important;
    }
    .official-signature-col-left, .official-signature-col-right {
      width: 48% !important;
      page-break-inside: avoid !important;
    }
    .official-signature-box {
      min-height: 58px !important;
      height: 58px !important;
      display: flex !important;
      align-items: center !important;
      margin: 4px 0 !important;
    }
    .official-signature-box img {
      max-height: 52px !important;
      max-width: 130px !important;
      object-fit: contain !important;
      display: block !important;
    }
    .official-signature-placeholder {
      display: inline-block !important;
      min-height: 52px !important;
      height: 52px !important;
      width: 100% !important;
    }
    .print-floating-bar {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      background: #0f172a;
      color: #fff;
      padding: 10px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      z-index: 99999;
      margin-bottom: 20px;
      border-radius: 8px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }
    .print-btn-primary {
      background: #059669;
      color: #fff;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }
    .print-btn-primary:hover {
      background: #10b981;
    }
    .print-btn-close {
      background: #334155;
      color: #cbd5e1;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
    }
    .print-btn-close:hover {
      background: #475569;
      color: #fff;
    }
    .print-hidden {
      display: none !important;
    }
    @media print {
      body { padding: 0; }
      .print-floating-bar { display: none !important; }
      .official-page-break { margin-bottom: 0; }
      .print-hidden { display: none !important; }
    }
  </style>
</head>
<body>
  <div class="print-floating-bar">
    <div style="font-size: 13px; font-weight: 600;">
      📄 ${title}
      <span style="font-size: 11px; opacity: 0.8; margin-left: 8px; font-weight: normal;">(Hộp thoại in tự động mở. Nếu chưa thấy, nhấn nút "In lại / Xuất PDF")</span>
    </div>
    <div style="display: flex; gap: 10px; align-items: center;">
      <button class="print-btn-primary" onclick="window.print()">
        🖨️ In lại / Xuất PDF
      </button>
      <button class="print-btn-close" onclick="window.close()">
        ✕ Đóng tab
      </button>
    </div>
  </div>

  ${contentHtml}

  <script>
    window.addEventListener('load', function() {
      window.focus();
      setTimeout(function() {
        try {
          window.print();
        } catch (e) {
          console.warn('Auto print failed:', e);
        }
      }, 500);
    });
  </script>
</body>
</html>`;
}

/**
 * Opens print preview in a dedicated top-level Blob tab to bypass iframe sandboxing 100%.
 */
export function openPrintBlobWindow(
  contentHtml: string,
  title: string,
  orientation: 'portrait' | 'landscape' = 'landscape'
): boolean {
  if (typeof window === 'undefined') return false;

  const fullHtml = generateFullPrintHtml(contentHtml, title, orientation);

  try {
    const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);

    // Try standard window.open with Blob URL
    const printWin = window.open(blobUrl, '_blank');
    if (printWin) {
      setTimeout(() => URL.revokeObjectURL(blobUrl), 120000);
      return true;
    }

    // Fallback if popup blocker intercepted: click an anchor element
    const link = document.createElement('a');
    link.href = blobUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(blobUrl), 120000);
    return true;
  } catch (e) {
    console.error('Blob window open error:', e);
    return false;
  }
}

/**
 * Universal print trigger that works both inside iframes and in standalone tabs.
 */
export function triggerPrintDocument(
  contentHtml: string,
  title: string,
  orientation: 'portrait' | 'landscape' = 'landscape'
) {
  if (typeof window === 'undefined') return;

  // 1. Try Blob Window (Most reliable in sandboxed iframe environments like AI Studio)
  const opened = openPrintBlobWindow(contentHtml, title, orientation);
  if (opened) return;

  // 2. Fallback: Hidden iframe
  try {
    const fullHtml = generateFullPrintHtml(contentHtml, title, orientation);
    const existing = document.getElementById('hidden-preschool-print-frame');
    if (existing) existing.remove();

    const iframe = document.createElement('iframe');
    iframe.id = 'hidden-preschool-print-frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '10px';
    iframe.style.height = '10px';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    iframe.style.border = 'none';
    iframe.style.zIndex = '-9999';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(fullHtml);
      doc.close();

      setTimeout(() => {
        try {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
        } catch (e) {
          console.warn('Iframe print error:', e);
          window.print();
        }
        setTimeout(() => {
          try {
            iframe.remove();
          } catch {}
        }, 10000);
      }, 500);
      return;
    }
  } catch (err) {
    console.warn('Fallback iframe print failed:', err);
  }

  // 3. Last fallback: direct window.print()
  try {
    window.print();
  } catch (e) {
    console.warn('Direct print failed:', e);
  }
}
