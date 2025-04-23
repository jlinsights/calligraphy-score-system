import { jsPDF } from 'jspdf';

/**
 * Nanum Gothic 폰트 추가
 * jsPDF에서 한글을 표시할 수 있도록 설정
 */
const addNanumGothicFont = () => {
  // 폰트 설정
  jsPDF.API.events.push(['addFonts', function() {
    const font = {
      family: 'NanumGothic',
      style: 'normal',
      weight: 'normal'
    };
    
    this.addFileToVFS('NanumGothic-normal.ttf', '/fonts/nanumgothic.woff');
    this.addFont('NanumGothic-normal.ttf', 'NanumGothic', 'normal');
  }]);
};

export { addNanumGothicFont }; 