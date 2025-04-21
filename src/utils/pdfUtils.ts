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
    
    // 스타일 추가 (한글 폰트 적용)
    element.style.cssText = `
      ${originalStyle}
      font-family: 'Malgun Gothic', 'Gulim', sans-serif;
      -webkit-font-smoothing: antialiased;
    `;
    
    // PDF 객체 생성 (A4 사이즈, 세로 방향)
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    // 기본 설정
    pdf.setTextColor(0, 0, 0);
    
    // Canvas로 변환
    const canvas = await html2canvas(element, {
      scale: 2, // 해상도 향상
      useCORS: true,
      logging: false,
      allowTaint: true,
      backgroundColor: '#ffffff'
    });
    
    // 원래 스타일로 복원
    element.style.cssText = originalStyle;
    
    // Canvas 이미지 데이터
    const imgData = canvas.toDataURL('image/png');
    
    // 컨텐츠 크기 계산
    const imgWidth = CONTENT_WIDTH;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // 페이지 수 계산
    const pageCount = Math.ceil(imgHeight / CONTENT_HEIGHT);
    
    // 여러 페이지에 나눠서 그리기
    for (let i = 0; i < pageCount; i++) {
      // 첫 페이지가 아니면 새 페이지 추가
      if (i > 0) {
        pdf.addPage();
      }
      
      // 현재 페이지에 그릴 이미지의 시작 위치 계산
      const sourceY = CONTENT_HEIGHT * i * (canvas.width / imgWidth);
      
      // 현재 페이지에 그릴 이미지의 높이 계산
      let sourceHeight;
      if (i === pageCount - 1) {
        // 마지막 페이지
        sourceHeight = canvas.height - sourceY;
      } else {
        // 중간 페이지
        sourceHeight = CONTENT_HEIGHT * (canvas.width / imgWidth);
      }
      
      // 현재 페이지에 그릴 이미지 높이 (mm 단위)
      const pageImgHeight = (sourceHeight * imgWidth) / canvas.width;
      
      // 이미지 그리기 - 클리핑하여 해당 페이지 부분만 표시
      pdf.addImage(
        imgData, // 이미지 데이터
        'PNG',   // 포맷
        MARGIN_LEFT, // x 위치
        MARGIN_TOP,  // y 위치
        imgWidth,    // 너비
        pageImgHeight, // 높이 (한 페이지 분량만)
        undefined,  // 별칭
        'FAST',     // 압축 방식
        0           // 회전
      );
      
      // 첫 페이지에 제목 추가
      if (i === 0 && title) {
        pdf.setFontSize(16);
        pdf.text(title, A4_WIDTH / 2, MARGIN_TOP - 2, { align: 'center' });
      }
      
      // 마지막 페이지에 날짜와 서명 추가
      if (i === pageCount - 1) {
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
      
      // 페이지 번호 추가
      pdf.setFontSize(8);
      pdf.text(`${i + 1} / ${pageCount}`, A4_WIDTH / 2, A4_HEIGHT - 5, { align: 'center' });
    }
    
    // PDF 저장
    pdf.save(filename);
    
  } catch (error) {
    console.error('PDF 생성 중 오류 발생:', error);
    alert('PDF 생성 중 오류가 발생했습니다.');
  }
}; 