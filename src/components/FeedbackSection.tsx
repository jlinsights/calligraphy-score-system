import React, { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './FeedbackSection.css';

const FeedbackSection: React.FC = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [signatureName, setSignatureName] = useState('');
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const [isExportingCSV, setIsExportingCSV] = useState<boolean>(false);
  
  const formRef = useRef<HTMLDivElement>(null);
  
  const [overallOpinion, setOverallOpinion] = useState('');
  const [hangulOpinion, setHangulOpinion] = useState('');
  const [hanmunOpinion, setHanmunOpinion] = useState('');
  const [modernOpinion, setModernOpinion] = useState('');
  const [calligraphyOpinion, setCalligraphyOpinion] = useState('');
  const [sealOpinion, setSealOpinion] = useState('');
  const [paintingOpinion, setPaintingOpinion] = useState('');
  const [finalOpinion, setFinalOpinion] = useState('');

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const formattedDate = `${year}년 ${month}월 ${day}일`;
    setCurrentDate(formattedDate);
    
    loadAllFromLocalStorage();
  }, []);
  
  const loadAllFromLocalStorage = () => {
    setOverallOpinion(loadFromLocalStorage('asca-overall-opinion'));
    setHangulOpinion(loadFromLocalStorage('asca-hangul-opinion'));
    setHanmunOpinion(loadFromLocalStorage('asca-hanmun-opinion'));
    setModernOpinion(loadFromLocalStorage('asca-modern-opinion'));
    setCalligraphyOpinion(loadFromLocalStorage('asca-calligraphy-opinion'));
    setSealOpinion(loadFromLocalStorage('asca-seal-opinion'));
    setPaintingOpinion(loadFromLocalStorage('asca-painting-opinion'));
    setFinalOpinion(loadFromLocalStorage('asca-final-opinion'));
    
    const savedSignature = localStorage.getItem('asca-opinion-signature');
    if (savedSignature) {
      setSignatureName(savedSignature);
    }
  };
  
  const loadFromLocalStorage = (key: string) => {
    const savedValue = localStorage.getItem(`asca-opinion-${key}`);
    return savedValue || '';
  };
  
  const saveToLocalStorage = (id: string, value: string) => {
    localStorage.setItem(`asca-opinion-${id}`, value);
  };
  
  const updatePrintContent = () => {
    if (!formRef.current) return;
    
    const textareas = formRef.current.querySelectorAll('textarea');
    textareas.forEach((textarea) => {
      const textareaId = textarea.id;
      const printContentId = textareaId + '-print';
      const printContent = document.getElementById(printContentId);
      
      if (printContent) {
        printContent.textContent = (textarea as HTMLTextAreaElement).value;
      }
    });
  };
  
  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      
      if (!formRef.current) {
        alert('폼 정보를 가져올 수 없습니다.');
        setIsGeneratingPDF(false);
        return;
      }

      // 원본 폼 요소 복제
      const originalForm = formRef.current;
      const clonedForm = originalForm.cloneNode(true) as HTMLElement;
      
      // 복제된 폼에 스타일 추가
      clonedForm.style.width = '790px'; // A4 너비에 맞게 조정
      clonedForm.style.minHeight = '1100px'; // A4 높이에 맞게 조정
      clonedForm.style.padding = '40px';
      clonedForm.style.backgroundColor = 'white';
      clonedForm.style.position = 'absolute';
      clonedForm.style.left = '-9999px';
      clonedForm.style.top = '0';
      document.body.appendChild(clonedForm);

      // 텍스트영역의 값을 복제된 폼에 설정
      const textareas = originalForm.querySelectorAll('textarea');
      const clonedTextareas = clonedForm.querySelectorAll('textarea');
      textareas.forEach((textarea, i) => {
        if (clonedTextareas[i]) {
          (clonedTextareas[i] as HTMLTextAreaElement).value = (textarea as HTMLTextAreaElement).value;
          (clonedTextareas[i] as HTMLTextAreaElement).style.height = 'auto';
          (clonedTextareas[i] as HTMLTextAreaElement).style.minHeight = '100px';
          (clonedTextareas[i] as HTMLTextAreaElement).style.overflow = 'visible';
        }
      });

      // 이름 입력 영역 설정
      const signatureInput = clonedForm.querySelector('#signature-name') as HTMLInputElement;
      if (signatureInput) {
        signatureInput.value = signatureName;
      }

      // PDF 생성
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'a4',
        hotfixes: ['px_scaling'],
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 20;

      try {
        // html2canvas를 사용하여 복제된 폼을 이미지로 변환
        const canvas = await html2canvas(clonedForm, {
          scale: 2, // 해상도 향상
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff'
        });

        // 캔버스를 이미지로 변환
        const imgData = canvas.toDataURL('image/png');
        
        // 이미지 크기 계산
        const imgWidth = pdfWidth - (margin * 2);
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        // 페이지 나누기를 위한 계산
        const pageCount = Math.ceil(imgHeight / (pdfHeight - (margin * 2)));
        
        // 각 페이지별로 이미지의 일부분을 추가
        for (let i = 0; i < pageCount; i++) {
          if (i > 0) {
            pdf.addPage();
          }
          
          const srcY = i * (pdfHeight - (margin * 2)) * (canvas.width / imgWidth);
          const srcHeight = (pdfHeight - (margin * 2)) * (canvas.width / imgWidth);
          
          // 페이지에 내용 추가
          pdf.addImage(
            imgData,
            'PNG',
            margin,
            margin,
            imgWidth,
            imgHeight
          );
        }

        // 현재 날짜로 파일명 생성
        const today = new Date();
        const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
        const fileName = `심사의견서_${dateStr}.pdf`;
        
        // PDF 저장
        pdf.save(fileName);
        
        // 알림 표시
        alert('심사의견서가 PDF로 저장되었습니다.');
      } catch (canvasError) {
        console.error('Canvas 생성 오류:', canvasError);
        throw new Error('PDF 변환 과정에서 오류가 발생했습니다.');
      } finally {
        // 복제된 폼 제거
        if (document.body.contains(clonedForm)) {
          document.body.removeChild(clonedForm);
        }
      }
    } catch (error) {
      console.error('PDF 생성 오류:', error);
      alert('PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };
  
  const handleExportCSV = () => {
    try {
      setIsExportingCSV(true);
      
      // CSV 헤더 생성
      const headers = [
        '작성일', 
        '심사위원장', 
        '전체 심사평', 
        '한글 부문', 
        '한문 부문', 
        '현대서예 부문', 
        '캘리그래피 부문', 
        '전각, 서각 부문', 
        '문인화, 동양화, 민화 부문', 
        '심사총평 및 제언'
      ];
      
      // 데이터 생성
      const data = [
        currentDate,
        signatureName,
        overallOpinion,
        hangulOpinion,
        hanmunOpinion,
        modernOpinion,
        calligraphyOpinion,
        sealOpinion,
        paintingOpinion,
        finalOpinion
      ].map(text => `"${text?.replace(/"/g, '""') || ''}"`); // CSV 이스케이핑 처리
      
      // CSV 파일 내용 생성
      const BOM = '\uFEFF'; // Excel에서 UTF-8 인코딩을 올바르게 인식하기 위한 BOM 추가
      const csvContent = BOM + [
        headers.join(','),
        data.join(',')
      ].join('\n');
      
      // 파일 다운로드
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      
      // 현재 날짜로 파일명 생성
      const today = new Date();
      const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
      link.setAttribute('download', `심사의견서_${dateStr}.csv`);
      
      // 링크 클릭하여 다운로드
      document.body.appendChild(link);
      link.click();
      
      // 임시 요소 제거 (타임아웃으로 지연 처리)
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
        setIsExportingCSV(false);
        alert('심사의견을 CSV 파일로 내보냈습니다.');
      }, 100);
    } catch (error) {
      console.error('CSV 내보내기 오류:', error);
      setIsExportingCSV(false);
      alert('CSV 파일을 생성하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <section className="calligraphy-section" id="feedback-form" ref={formRef}>
      <h2 className="calligraphy-section-title">심사의견서</h2>
      
      <div className={`asca-eval-form ${isGeneratingPDF ? 'pdf-generating' : ''}`} ref={formRef} id="evaluation-opinion-form">
        <div className="logo"></div>
        <div className="title">심사의견서</div>

        <div className="form-section">
          <div className="section-title">전체 심사평</div>
          <div className="opinion-content">
            <Textarea 
              id="asca-overall-opinion" 
              placeholder="전체 심사평을 작성해주세요."
              value={overallOpinion}
              onChange={(e) => {
                setOverallOpinion(e.target.value);
                saveToLocalStorage('asca-overall-opinion', e.target.value);
              }}
              className="min-h-[120px]"
            />
            <div id="asca-overall-opinion-print" className="print-content"></div>
          </div>
        </div>
        
        <div className="form-section">
          <div className="section-title">부문별 심사의견</div>
          <div className="categories-grid">
            <div className="opinion-field">
              <div className="opinion-title">한글 부문</div>
              <div className="opinion-content">
                <Textarea 
                  id="asca-hangul-opinion" 
                  placeholder="한글 부문에 대한 심사의견을 작성해주세요."
                  value={hangulOpinion}
                  onChange={(e) => {
                    setHangulOpinion(e.target.value);
                    saveToLocalStorage('asca-hangul-opinion', e.target.value);
                  }}
                  className="min-h-[120px]"
                />
                <div id="asca-hangul-opinion-print" className="print-content"></div>
              </div>
            </div>
            
            <div className="opinion-field">
              <div className="opinion-title">한문 부문</div>
              <div className="opinion-content">
                <Textarea 
                  id="asca-hanmun-opinion" 
                  placeholder="한문 부문에 대한 심사의견을 작성해주세요."
                  value={hanmunOpinion}
                  onChange={(e) => {
                    setHanmunOpinion(e.target.value);
                    saveToLocalStorage('asca-hanmun-opinion', e.target.value);
                  }}
                  className="min-h-[120px]"
                />
                <div id="asca-hanmun-opinion-print" className="print-content"></div>
              </div>
            </div>
            
            <div className="opinion-field">
              <div className="opinion-title">현대서예 부문</div>
              <div className="opinion-content">
                <Textarea 
                  id="asca-modern-opinion" 
                  placeholder="현대서예 부문에 대한 심사의견을 작성해주세요."
                  value={modernOpinion}
                  onChange={(e) => {
                    setModernOpinion(e.target.value);
                    saveToLocalStorage('asca-modern-opinion', e.target.value);
                  }}
                  className="min-h-[120px]"
                />
                <div id="asca-modern-opinion-print" className="print-content"></div>
              </div>
            </div>
            
            <div className="opinion-field">
              <div className="opinion-title">캘리그래피 부문</div>
              <div className="opinion-content">
                <Textarea 
                  id="asca-calligraphy-opinion" 
                  placeholder="캘리그래피 부문에 대한 심사의견을 작성해주세요."
                  value={calligraphyOpinion}
                  onChange={(e) => {
                    setCalligraphyOpinion(e.target.value);
                    saveToLocalStorage('asca-calligraphy-opinion', e.target.value);
                  }}
                  className="min-h-[120px]"
                />
                <div id="asca-calligraphy-opinion-print" className="print-content"></div>
              </div>
            </div>
            
            <div className="opinion-field">
              <div className="opinion-title">전각, 서각 부문</div>
              <div className="opinion-content">
                <Textarea 
                  id="asca-seal-opinion" 
                  placeholder="전각, 서각 부문에 대한 심사의견을 작성해주세요."
                  value={sealOpinion}
                  onChange={(e) => {
                    setSealOpinion(e.target.value);
                    saveToLocalStorage('asca-seal-opinion', e.target.value);
                  }}
                  className="min-h-[120px]"
                />
                <div id="asca-seal-opinion-print" className="print-content"></div>
              </div>
            </div>
            
            <div className="opinion-field">
              <div className="opinion-title">문인화, 동양화, 민화 부문</div>
              <div className="opinion-content">
                <Textarea 
                  id="asca-painting-opinion" 
                  placeholder="문인화, 동양화, 민화 부문에 대한 심사의견을 작성해주세요."
                  value={paintingOpinion}
                  onChange={(e) => {
                    setPaintingOpinion(e.target.value);
                    saveToLocalStorage('asca-painting-opinion', e.target.value);
                  }}
                  className="min-h-[120px]"
                />
                <div id="asca-painting-opinion-print" className="print-content"></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="form-section">
          <div className="section-title">심사총평 및 제언</div>
          <div className="opinion-content">
            <Textarea 
              id="asca-final-opinion" 
              placeholder="심사총평 및 제언을 작성해주세요."
              value={finalOpinion}
              onChange={(e) => {
                setFinalOpinion(e.target.value);
                saveToLocalStorage('asca-final-opinion', e.target.value);
              }}
              className="min-h-[120px]"
            />
            <div id="asca-final-opinion-print" className="print-content"></div>
          </div>
        </div>

        <div className="signature-section">
          <p className="evaluation-date">작성일: <span id="auto-date">{currentDate}</span></p>
          <div className="signature-line">
            <label htmlFor="opinion-judge-signature">심사위원장:</label>
            <div className="signature-input-container">
              <Input 
                type="text" 
                id="opinion-judge-signature" 
                name="opinion-judge-signature" 
                className="signature-input"
                value={signatureName}
                onChange={(e) => {
                  setSignatureName(e.target.value);
                  localStorage.setItem('asca-opinion-signature', e.target.value);
                }}
              />
            </div>
            <span className="signature-label-text">(서명)</span>
          </div>
        </div>

        <div className="button-container">
          <p className="copyright-footer">© The Asian Society of Calligraphic Arts (ASCA). All rights reserved.</p>
          <div className="button-group">
            <Button 
              id="opinion-form-download-pdf-button"
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="bg-[#28a745] hover:bg-[#218838]"
            >
              {isGeneratingPDF ? 'PDF 생성 중...' : 'PDF 다운로드'}
            </Button> 
            <Button 
              id="opinion-form-export-csv-button"
              onClick={handleExportCSV}
              disabled={isExportingCSV}
              className="bg-[#007bff] hover:bg-[#0056b3]"
            >
              {isExportingCSV ? 'CSV 내보내는 중...' : 'CSV 내보내기'}
            </Button>
          </div>
        </div>
      </div>
      
      <style>
        {`
        .asca-eval-form {
          width: 100%;
          max-width: 100%;
          min-height: 297mm;
          margin: 0 auto;
          padding: 1.5rem 2rem;
          line-height: 1.6;
          color: hsl(var(--foreground));
          background-color: hsl(var(--background));
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          font-family: 'Noto Serif TC', serif;
          border-radius: var(--radius);
          border: 1px solid hsl(var(--border));
        }
        
        .dark .asca-eval-form {
          background-color: hsl(var(--card));
          color: hsl(var(--card-foreground));
          box-shadow: 0 0 10px rgba(0,0,0,0.3);
        }
        
        .pdf-generating {
          cursor: progress;
        }
        
        .pdf-generating .button-container button {
          pointer-events: none;
          opacity: 0.7;
        }
        
        .asca-eval-form * {
          box-sizing: border-box;
        }
        
        .asca-eval-form .logo {
          display: none;
        }
        
        .asca-eval-form .title {
          text-align: center;
          font-size: 24pt;
          font-weight: bold;
          margin-bottom: 1.5rem;
          color: hsl(var(--foreground));
        }
        
        .dark .asca-eval-form .title {
          color: hsl(var(--foreground));
        }
        
        .asca-eval-form .form-section {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid hsl(var(--border));
        }
        
        .dark .asca-eval-form .form-section {
          border-bottom: 1px solid hsl(var(--border));
        }
        
        .asca-eval-form .form-section:last-of-type {
          border-bottom: none;
          margin-bottom: 0;
        }
        
        .asca-eval-form .section-title {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid hsl(var(--border));
          position: relative;
          color: hsl(var(--primary));
        }
        
        .dark .asca-eval-form .section-title {
          color: hsl(var(--primary));
          border-bottom: 1px solid hsl(var(--border));
        }
        
        .asca-eval-form .section-title::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 50px;
          height: 3px;
          background-color: hsl(var(--celadon));
        }
        
        .asca-eval-form .opinion-field {
          margin-bottom: 1.5rem;
        }
        
        .asca-eval-form .opinion-title {
          font-weight: bold;
          margin-bottom: 0.5rem;
          font-size: 1rem;
          color: hsl(var(--foreground));
        }
        
        .dark .asca-eval-form .opinion-title {
          color: hsl(var(--foreground));
        }
        
        .asca-eval-form .opinion-content {
          border: 1px solid hsl(var(--border));
          border-radius: var(--radius);
          padding: 0;
          background-color: hsl(var(--card));
          overflow: hidden;
        }
        
        .dark .asca-eval-form .opinion-content {
          border: 1px solid hsl(var(--border));
          background-color: hsl(var(--card));
        }
        
        .asca-eval-form textarea {
          min-height: 120px !important;
          color: hsl(var(--card-foreground));
          background-color: hsl(var(--card));
          border: none;
          border-radius: 0;
          resize: vertical;
          width: 100%;
          padding: 10px;
          font-family: inherit;
        }
        
        .dark .asca-eval-form textarea {
          color: hsl(var(--card-foreground));
          background-color: hsl(var(--card));
        }
        
        .asca-eval-form .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .asca-eval-form .signature-section {
          margin-top: auto;
          padding-top: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-top: 1px solid hsl(var(--celadon));
        }
        
        .asca-eval-form .evaluation-date {
          font-size: 10pt;
          color: hsl(var(--foreground));
          margin: 0 0 5px 0;
          padding-bottom: 8px;
          white-space: nowrap;
        }
        
        .dark .asca-eval-form .evaluation-date {
          color: hsl(var(--foreground));
        }
        
        .asca-eval-form .signature-line {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-grow: 1;
          justify-content: flex-end;
          color: hsl(var(--foreground));
        }
        
        .dark .asca-eval-form .signature-line {
          color: hsl(var(--foreground));
        }
        
        .asca-eval-form .signature-line label {
          margin-bottom: 0;
          font-weight: bold;
          white-space: nowrap;
        }
        
        .asca-eval-form .signature-input-container {
          max-width: 250px;
          width: 100%;
          position: relative;
        }
        
        .asca-eval-form .signature-input {
          width: 100%;
          padding: 8px 0;
          border: none;
          border-bottom: 1px solid hsl(var(--border));
          background-color: transparent;
          color: hsl(var(--foreground));
          border-radius: 0;
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
          height: auto;
        }
        
        .dark .asca-eval-form .signature-input {
          border-bottom: 1px solid hsl(var(--border));
          color: hsl(var(--foreground));
        }
        
        .asca-eval-form .signature-label-text {
          font-size: 10pt;
          color: hsl(var(--foreground));
          white-space: nowrap;
          padding-bottom: 8px;
        }
        
        .dark .asca-eval-form .signature-label-text {
          color: hsl(var(--foreground));
        }
        
        .asca-eval-form .button-container {
          margin-top: 1rem;
          padding-top: 0.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid hsl(var(--celadon));
        }
        
        .asca-eval-form .copyright-footer {
          font-size: 8pt;
          color: hsl(var(--muted-foreground));
          text-align: left;
          margin: 0;
          flex-grow: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .asca-eval-form .button-group {
          display: flex;
          gap: 10px;
        }
        
        .asca-eval-form .print-content {
          display: none;
          white-space: pre-wrap;
          word-wrap: break-word;
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
          color: hsl(var(--foreground));
          padding: 10px;
          min-height: 120px;
        }
        
        .dark .asca-eval-form .print-content {
          color: hsl(var(--foreground));
        }
        
        @media (max-width: 768px) {
          .asca-eval-form {
            width: 100%;
            margin: 0;
            padding: 1rem;
          }
          
          .asca-eval-form .title {
            font-size: 20pt;
            margin-bottom: 1rem;
          }
          
          .asca-eval-form .categories-grid {
            grid-template-columns: 1fr;
          }
        }
        `}
      </style>
    </section>
  );
};

export default FeedbackSection;
