import React, { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

const FeedbackSection = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [signatureName, setSignatureName] = useState('');
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  
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
    
    const loadFromLocalStorage = (key: string) => {
      const savedValue = localStorage.getItem(`asca-opinion-${key}`);
      return savedValue || '';
    };
    
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
  }, []);
  
  const saveToLocalStorage = (id: string, value: string) => {
    localStorage.setItem(`asca-opinion-${id}`, value);
  };
  
  const handleDownloadPDF = async () => {
    if (!formRef.current) return;
    
    setIsPdfGenerating(true);
    
    try {
      const element = formRef.current;
      
      const printContents = document.createElement('div');
      printContents.className = 'print-preview';
      printContents.innerHTML = element.innerHTML;
      
      const buttonContainer = printContents.querySelector('.button-container');
      if (buttonContainer) {
        buttonContainer.remove();
      }
      
      const textareas = element.querySelectorAll('textarea');
      textareas.forEach((textarea, index) => {
        const textareaId = textarea.id;
        const content = (textarea as HTMLTextAreaElement).value;
        
        const printContentDivs = printContents.querySelectorAll('.print-content');
        if (index < printContentDivs.length) {
          printContentDivs[index].textContent = content;
          
          const textareaInPrintContent = printContentDivs[index].previousElementSibling;
          if (textareaInPrintContent && textareaInPrintContent.tagName === 'TEXTAREA') {
            (textareaInPrintContent as HTMLElement).style.display = 'none';
          }
        }
      });
      
      const canvas = await html2canvas(element, {
        scale: 1.5,
        useCORS: true,
        logging: false,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const canvasAspectRatio = canvasWidth / canvasHeight;
      
      const pageMargin = 15;
      const contentWidth = pdfWidth - (pageMargin * 2);
      const contentHeight = pdfHeight - (pageMargin * 2);
      
      let imgWidthOnPdf = contentWidth;
      let imgHeightOnPdf = imgWidthOnPdf / canvasAspectRatio;
      
      let currentHeightOnCanvas = 0;
      const pageHeightOnCanvas = contentHeight * (canvasWidth / imgWidthOnPdf);
      
      while (currentHeightOnCanvas < canvasHeight) {
        const remainingCanvasHeight = canvasHeight - currentHeightOnCanvas;
        let availablePdfHeight = pdfHeight - pageMargin - (currentHeightOnCanvas === 0 ? pageMargin : pageMargin);
        let pdfY = pageMargin;
        
        if (currentHeightOnCanvas > 0) {
          pdf.addPage();
          pdfY = pageMargin;
          availablePdfHeight = contentHeight;
        }
        
        let sliceHeightOnPdf = availablePdfHeight;
        let sliceHeightOnCanvas = sliceHeightOnPdf * (canvasWidth / imgWidthOnPdf);
        
        if (sliceHeightOnCanvas > remainingCanvasHeight) {
          sliceHeightOnCanvas = remainingCanvasHeight;
          sliceHeightOnPdf = sliceHeightOnCanvas * (imgWidthOnPdf / canvasWidth);
        }
        
        if (sliceHeightOnCanvas <= 0 || sliceHeightOnPdf <= 0) {
          break;
        }
        
        const sliceCanvas = document.createElement('canvas');
        sliceCanvas.width = canvasWidth;
        sliceCanvas.height = sliceHeightOnCanvas;
        
        const sliceCtx = sliceCanvas.getContext('2d');
        if (sliceCtx) {
          sliceCtx.drawImage(
            canvas,
            0,
            currentHeightOnCanvas,
            canvasWidth,
            sliceHeightOnCanvas,
            0,
            0,
            canvasWidth,
            sliceHeightOnCanvas
          );
          
          const sliceImgData = sliceCanvas.toDataURL('image/png');
          pdf.addImage(sliceImgData, 'PNG', pageMargin, pdfY, imgWidthOnPdf, sliceHeightOnPdf);
          
          currentHeightOnCanvas += sliceHeightOnCanvas;
        }
      }
      
      const dateStr = currentDate.replace(/[^0-9]/g, '');
      const filename = `심사의견서_${dateStr || new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);
      
    } catch (error) {
      console.error("PDF 생성 중 오류 발생:", error);
      alert("PDF 파일을 생성하는 중 오류가 발생했습니다.");
    } finally {
      setIsPdfGenerating(false);
    }
  };
  
  const handleExportCSV = () => {
    try {
      const headers = [
        '작성일', '전체 심사평', '한글 부문', '한문 부문', '현대서예 부문', 
        '캘리그라피 부문', '전각, 서각 부문', '문인화, 동양화, 민화 부문', 
        '심사총평 및 제언', '심사위원장 서명'
      ];
      
      const dataRow = [
        currentDate,
        overallOpinion,
        hangulOpinion,
        hanmunOpinion,
        modernOpinion,
        calligraphyOpinion,
        sealOpinion,
        paintingOpinion,
        finalOpinion,
        signatureName
      ];
      
      const csvContent = [
        headers.join(','),
        dataRow.map(item => `"${item.replace(/"/g, '""')}"`).join(',')
      ].join('\n');
      
      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `심사의견서_${currentDate.replace(/[^0-9]/g, '')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("CSV 생성 오류:", error);
      alert("CSV 파일을 생성하는 중 오류가 발생했습니다.");
    }
  };

  return (
    <section className="calligraphy-section">
      <h2 className="calligraphy-section-title">심사의견서</h2>
      
      <div className={`asca-eval-form ${isPdfGenerating ? 'pdf-generating' : ''}`} ref={formRef} id="evaluation-opinion-form">
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
          <p className="copyright-footer">© 동양서예협회 심사관리 시스템</p>
          <div className="button-group">
            <Button 
              id="opinion-form-download-pdf-button"
              onClick={handleDownloadPDF}
              disabled={isPdfGenerating}
              className="bg-[#28a745] hover:bg-[#218838]"
            >
              PDF
            </Button> 
            <Button 
              id="opinion-form-export-csv-button"
              onClick={handleExportCSV}
              disabled={isPdfGenerating}
              className="bg-[#007bff] hover:bg-[#0056b3]"
            >
              CSV
            </Button>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .asca-eval-form {
          width: 210mm;
          min-height: 297mm;
          margin: 20px auto;
          padding: 1.5cm 2cm;
          line-height: 1.6;
          color: var(--ink-black, #1a1a1a);
          background-color: var(--rice-paper, #f5f5f0);
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          font-family: 'Noto Serif TC', serif;
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
          margin-bottom: 1.5cm;
          color: var(--ink-black, #1a1a1a);
        }
        
        .asca-eval-form .form-section {
          margin-bottom: 1.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid var(--border-color-light, #eee);
        }
        
        .asca-eval-form .form-section:last-of-type {
          border-bottom: none;
          margin-bottom: 0;
        }
        
        .asca-eval-form .section-title {
          font-size: 1.3rem;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid var(--border-color-light, #eee);
          position: relative;
          color: var(--terra-red, #9B4444);
        }
        
        .asca-eval-form .section-title::after {
          content: "";
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 50px;
          height: 3px;
          background-color: var(--celadon, #88A891);
        }
        
        .asca-eval-form .opinion-field {
          margin-bottom: 1.5rem;
        }
        
        .asca-eval-form .opinion-title {
          font-weight: bold;
          margin-bottom: 0.5rem;
          font-size: 1rem;
        }
        
        .asca-eval-form .opinion-content {
          border: 1px solid var(--border-color, #ccc);
          border-radius: 4px;
          padding: 0;
          background-color: #fff;
          overflow: hidden;
        }
        
        .asca-eval-form .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
        }
        
        .asca-eval-form .signature-section {
          margin-top: auto;
          padding-top: 1.5cm;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-top: 1px solid var(--celadon, #88A891);
        }
        
        .asca-eval-form .evaluation-date {
          font-size: 10pt;
          color: var(--ink-black, #1a1a1a);
          margin: 0 0 5px 0;
          padding-bottom: 8px;
          white-space: nowrap;
        }
        
        .asca-eval-form .signature-line {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-grow: 1;
          justify-content: flex-end;
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
          border-bottom: 1px solid var(--ink-black, #1a1a1a);
          background-color: transparent;
          color: var(--ink-black, #1a1a1a);
          border-radius: 0;
          font-family: inherit;
          font-size: inherit;
          line-height: inherit;
          height: auto;
        }
        
        .asca-eval-form .signature-label-text {
          font-size: 10pt;
          color: var(--ink-black, #1a1a1a);
          white-space: nowrap;
          padding-bottom: 8px;
        }
        
        .asca-eval-form .button-container {
          margin-top: 1cm;
          padding-top: 0.5cm;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--celadon, #88A891);
        }
        
        .asca-eval-form .copyright-footer {
          font-size: 8pt;
          color: var(--footer-text-color, #6c757d);
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
          color: var(--ink-black, #1a1a1a);
        }
        
        @media (max-width: 768px) {
          .asca-eval-form {
            width: 100%;
            margin: 0;
            padding: 1rem;
          }
          
          .asca-eval-form .title {
            font-size: 20pt;
            margin-bottom: 1cm;
          }
          
          .asca-eval-form .categories-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default FeedbackSection;
