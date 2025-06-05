import html2canvas from 'html2canvas';

/**
 * PDF 유틸리티 함수
 * - 한글 폰트 지원
 * - 여러 페이지 생성 지원
 * - A4 사이즈 지원
 */

// A4 크기 설정 (mm 단위)
export const A4_WIDTH = 210;
export const A4_HEIGHT = 297;

// 여백 설정 (mm 단위)
export const MARGIN_LEFT = 10;
export const MARGIN_RIGHT = 10;
export const MARGIN_TOP = 10;
export const MARGIN_BOTTOM = 10;

// 컨텐츠 영역 (mm 단위)
export const CONTENT_WIDTH = A4_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
export const CONTENT_HEIGHT = A4_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM;

/**
 * HTML 요소를 PDF로 변환
 * @param element HTML 요소
 * @param filename 파일명
 * @param title PDF 제목
 * @param date 날짜
 * @param signature 서명
 */
export async function generatePdfFromElement(
  element: HTMLElement, 
  filename: string, 
  title?: string
): Promise<void> {
  try {
    // 동적 임포트로 jsPDF 로드
    const { default: jsPDF } = await import('jspdf');
    
    // PDF 생성을 위한 스타일 정리
    const buttonContainers = element.querySelectorAll('.button-container');
    const tempStyles: { el: HTMLElement; display: string }[] = [];
    
    // 버튼 컨테이너 숨기기
    buttonContainers.forEach(el => {
      const htmlEl = el as HTMLElement;
      tempStyles.push({ el: htmlEl, display: htmlEl.style.display });
      htmlEl.style.display = 'none';
    });
    
    element.classList.add('pdf-generating');
    
    // A4 크기 설정
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const margin = { top: 10, right: 10, bottom: 10, left: 10 };
    const pageWidth = 210;
    const contentWidth = pageWidth - margin.left - margin.right;
    
    // Canvas 생성
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
      allowTaint: true,
    });
    
    const imgData = canvas.toDataURL('image/png');
    const imgWidth = contentWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // 페이지 분할 계산
    const pageHeight = 297 - margin.top - margin.bottom;
    const pageCount = Math.ceil(imgHeight / pageHeight);
    
    // 제목 추가
    if (title) {
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(16);
      pdf.text(title, pageWidth / 2, margin.top + 10, { align: 'center' });
    }
    
    // 이미지 추가 및 페이지 처리
    for (let i = 0; i < pageCount; i++) {
      if (i > 0) pdf.addPage();
      
      const srcY = i * pageHeight;
      const sliceHeight = Math.min(pageHeight, imgHeight - srcY);
      
      pdf.addImage(
        imgData, 'PNG', 
        margin.left, 
        margin.top + (title ? 20 : 0), 
        imgWidth, 
        sliceHeight,
        undefined, 
        'FAST', 
        srcY
      );
    }
    
    // PDF 저장
    pdf.save(filename);
    
    // 원래 스타일 복원
    tempStyles.forEach(item => {
      item.el.style.display = item.display;
    });
    element.classList.remove('pdf-generating');
    
  } catch (error) {
    console.error('PDF 생성 오류:', error);
    throw error;
  }
}

// Markdown 변환 유틸리티 함수 (동적 임포트 적용)
export async function convertHtmlToMarkdown(html: string): Promise<string> {
  try {
    // 동적 임포트로 turndown 로드
    const TurndownService = (await import('turndown')).default;
    const turndownService = new TurndownService({
      headingStyle: 'atx',
      codeBlockStyle: 'fenced'
    });
    
    return turndownService.turndown(html);
  } catch (error) {
    console.error('Markdown 변환 오류:', error);
    throw error;
  }
}

// CSV 내보내기 유틸리티
export function exportToCsv(data: string, filename: string): void {
  try {
    const blob = new Blob(['\uFEFF' + data], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('CSV 내보내기 오류:', error);
    throw error;
  }
}

// Markdown 파일 내보내기 유틸리티
export function exportToMarkdown(content: string, filename: string): void {
  try {
    const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Markdown 내보내기 오류:', error);
    throw error;
  }
} 