import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
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
export const generatePdfFromElement = async (
  element: HTMLElement,
  filename: string,
  title: string = '',
  date: string = '',
  signature: string = ''
): Promise<void> => {
  try {
    // 기존 스타일 저장
    const originalStyle = element.style.cssText;
    
    // HTML 요소 복제 및 스타일 적용
    const clonedElement = element.cloneNode(true) as HTMLElement;
    clonedElement.style.cssText = `
      ${originalStyle}
      font-family: 'Malgun Gothic', 'Gulim', sans-serif;
      -webkit-font-smoothing: antialiased;
      width: ${CONTENT_WIDTH}mm;
      background-color: white;
      color: black;
    `;
    
    // 숨겨진 위치에 복제본 추가
    clonedElement.style.position = 'absolute';
    clonedElement.style.left = '-9999px';
    clonedElement.style.top = '0';
    document.body.appendChild(clonedElement);
    
    // Canvas로 변환 (해상도 향상)
    const canvas = await html2canvas(clonedElement, {
      scale: 3, // 해상도 증가
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: 'white' // CSS color name instead of hex
    });
    
    // 복제본 제거
    document.body.removeChild(clonedElement);
    
    // PDF 객체 생성 (A4 사이즈, 세로 방향)
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // PDF 기본 설정
    pdf.setTextColor(0, 0, 0);
    
    // Canvas 이미지 데이터
    const imgData = canvas.toDataURL('image/png');
    
    // 컨텐츠 크기 계산
    const imgWidth = CONTENT_WIDTH;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // 페이지 수 계산
    const pageCount = Math.ceil(imgHeight / CONTENT_HEIGHT);
    
    // 이미지 총 높이(px)
    const totalCanvasHeight = canvas.height;
    // 각 페이지당 이미지 높이(px)
    const pageCanvasHeight = totalCanvasHeight / pageCount;
    
    // 여러 페이지에 나눠서 그리기
    for (let i = 0; i < pageCount; i++) {
      // 첫 페이지가 아니면 새 페이지 추가
      if (i > 0) {
        pdf.addPage();
      }
      
      // 현재 페이지에 그릴 이미지의 시작 위치 계산 (픽셀 단위)
      const sourceY = Math.floor(i * pageCanvasHeight);
      
      // 현재 페이지에 그릴 이미지의 높이 계산 (픽셀 단위)
      const sourceHeight = Math.min(pageCanvasHeight, totalCanvasHeight - sourceY);
      
      // PDF에 이미지 추가 (임시 캔버스 활용)
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = canvas.width;
      tempCanvas.height = sourceHeight;
      
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) continue;
      
      // 원본 캔버스에서 필요한 부분만 새 캔버스에 그림
      tempCtx.drawImage(
        canvas, 
        0, sourceY, 
        canvas.width, sourceHeight, 
        0, 0, 
        canvas.width, sourceHeight
      );
      
      // 추출한 이미지 데이터
      const pageImgData = tempCanvas.toDataURL('image/png');
      
      // 페이지 이미지의 PDF 높이 계산
      const pageImgHeight = (sourceHeight * imgWidth) / canvas.width;
      
      // PDF에 이미지 추가
      pdf.addImage(
        pageImgData,
        'PNG',
        MARGIN_LEFT,
        MARGIN_TOP,
        imgWidth,
        pageImgHeight
      );
      
      // 첫 페이지에 제목 추가
      if (i === 0 && title) {
        pdf.setFontSize(16);
        pdf.text(title, A4_WIDTH / 2, MARGIN_TOP - 2, { align: 'center' });
      }
      
      // 페이지 번호 추가
      pdf.setFontSize(8);
      pdf.text(`${i + 1} / ${pageCount}`, A4_WIDTH / 2, A4_HEIGHT - 5, { align: 'center' });
    }
    
    // 마지막 페이지에 날짜와 서명 추가
    if (date || signature) {
      pdf.setPage(pageCount); // 마지막 페이지로 이동
      
      if (date) {
        pdf.setFontSize(10);
        pdf.text(`날짜: ${date}`, A4_WIDTH - MARGIN_RIGHT, A4_HEIGHT - MARGIN_BOTTOM + 5, {
          align: 'right'
        });
      }
      
      if (signature) {
        pdf.setFontSize(10);
        pdf.text(`서명: ${signature}`, A4_WIDTH - MARGIN_RIGHT, A4_HEIGHT - MARGIN_BOTTOM + 10, {
          align: 'right'
        });
      }
    }
    
    // PDF 저장
    pdf.save(filename);
    
  } catch (error) {
    console.error('PDF 생성 중 오류 발생:', error);
    alert('PDF 생성 중 오류가 발생했습니다.');
  }
}; 