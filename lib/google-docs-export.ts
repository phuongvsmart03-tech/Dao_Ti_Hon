// lib/google-docs-export.ts
// Module hỗ trợ Xuất bản và Đồng bộ hóa Giáo án Mầm Non với Google Docs & Microsoft Word

export interface ExportLessonDossierOptions {
  themeTitle: string;
  bookTitle: string;
  ageGroup: string;
  teachers: string;
  schoolName: string;
  approver: string;
  schoolYear: string;
}

/**
 * Tạo tài liệu HTML hoàn chỉnh theo đúng tiêu chuẩn A4, viền trang hoa văn,
 * tương thích 100% khi mở bằng Microsoft Word hoặc dán vào Google Docs.
 */
export function buildWordDocumentHtml(htmlBodyContent: string, title = 'Giao_An_Mam_Non'): string {
  return `<!DOCTYPE html>
<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <!--[if gte mso 9]>
  <xml>
    <w:WordDocument>
      <w:View>Print</w:View>
      <w:Zoom>100</w:Zoom>
      <w:DoNotOptimizeForBrowser/>
    </w:WordDocument>
  </xml>
  <![endif]-->
  <style>
    @page Section1 {
      size: 210mm 297mm;
      margin: 20mm 15mm 20mm 20mm;
      mso-header-margin: 35.4pt;
      mso-footer-margin: 35.4pt;
      mso-paper-source: 0;
    }
    div.Section1 {
      page: Section1;
    }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 13pt;
      line-height: 1.35;
      color: #000000;
      background-color: #ffffff;
      margin: 0;
      padding: 0;
    }
    p {
      margin: 0 0 6pt 0;
      text-align: justify;
    }
    h1, h2, h3, h4 {
      font-family: 'Times New Roman', Times, serif;
      margin-top: 10pt;
      margin-bottom: 6pt;
      color: #000000;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 12pt;
      font-size: 12pt;
    }
    table, th, td {
      border: 1px solid #000000;
    }
    th, td {
      padding: 5pt 7pt;
      vertical-align: top;
    }
    th {
      background-color: #f1f5f9;
      font-weight: bold;
      text-align: center;
    }
    .page-break {
      page-break-before: always;
      mso-break-type: page-break;
      clear: both;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-bold { font-weight: bold; }
    .italic { font-style: italic; }
    .underline { text-decoration: underline; }
    .uppercase { text-transform: uppercase; }

    /* Khung viền hoa văn trang bìa */
    .cover-border-box {
      border: 3px double #1e3a8a;
      padding: 24pt 18pt;
      min-height: 850pt;
      box-sizing: border-box;
      position: relative;
    }
  </style>
</head>
<body>
  <div class="Section1">
    ${htmlBodyContent}
  </div>
</body>
</html>`;
}

/**
 * Tải file Word (.doc) trực tiếp về máy tính người dùng
 */
export function downloadAsWordDoc(htmlContent: string, fileName = 'Giao_An_Mam_Non.doc') {
  const fullDocument = buildWordDocumentHtml(htmlContent, fileName);
  const blob = new Blob(['\ufeff', fullDocument], {
    type: 'application/msword;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Sao chép nội dung HTML định dạng phong phú vào Clipboard
 * Giúp người dùng chỉ cần nhấn Ctrl + V vào Google Docs là hiển thị đầy đủ bảng, chữ in đậm, viền.
 */
export async function copyFormattedContentForGoogleDocs(htmlContent: string): Promise<boolean> {
  try {
    const fullHtml = buildWordDocumentHtml(htmlContent);
    const plainText = extractPlainTextFromHtml(htmlContent);

    if (navigator.clipboard && window.ClipboardItem) {
      const textBlob = new Blob([plainText], { type: 'text/plain' });
      const htmlBlob = new Blob([fullHtml], { type: 'text/html' });

      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': htmlBlob,
          'text/plain': textBlob,
        }),
      ]);
      return true;
    } else {
      // Fallback
      await navigator.clipboard.writeText(plainText);
      return true;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard:', err);
    return false;
  }
}

/**
 * Chuyển HTML thành Plain Text dự phòng
 */
function extractPlainTextFromHtml(html: string): string {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.innerText || tempDiv.textContent || '';
}

/**
 * Mở Google Docs mới trong tab mới
 */
export function openNewGoogleDoc() {
  window.open('https://docs.new', '_blank', 'noopener,noreferrer');
}
