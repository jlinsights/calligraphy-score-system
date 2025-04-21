import React, { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './FeedbackSection.css';
import { FileDown, Save } from 'lucide-react';
import SectionFooter from "@/components/ui/section-footer";
import { generatePdfFromElement } from '@/utils/pdfUtils';

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
      setIsPdfGenerating(true);
      
      if (!formRef.current) {
        alert('폼 정보를 가져올 수 없습니다.');
        setIsGeneratingPDF(false);
        setIsPdfGenerating(false);
        return;
      }
      
      const form = formRef.current;
      
      // PDF 생성을 위한 스타일 정리
      const buttonContainers = form.querySelectorAll('.button-container');
      const tempStyles: { el: HTMLElement; display: string }[] = [];
      
      // 버튼 컨테이너 숨기기 및 원래 스타일 저장
      buttonContainers.forEach(el => {
        const htmlEl = el as HTMLElement;
        tempStyles.push({ el: htmlEl, display: htmlEl.style.display });
        htmlEl.style.display = 'none';
      });
      
      // PDF 생성을 위한 클래스 추가
      form.classList.add('pdf-generating');
      
      // 파일명 생성
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const filename = `심사의견서_${year}${month}${day}.pdf`;
      
      // 텍스트 내용 업데이트
      updatePrintContent();
      
      // PDF 생성
      await generatePdfFromElement(
        form,
        filename,
        '심사의견서',
        currentDate,
        signatureName
      );
      
      // 원래 스타일로 복원
      tempStyles.forEach(item => {
        item.el.style.display = item.display;
      });
      form.classList.remove('pdf-generating');
      
      alert('심사의견서가 PDF로 저장되었습니다.');
    } catch (error) {
      console.error('PDF 생성 중 오류 발생:', error);
      alert('PDF 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGeneratingPDF(false);
      setIsPdfGenerating(false);
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
        '심사총평 및 제언',
        '등급결정 기준',
        '동점자 처리방안',
        '심사결과 확정'
      ];
      
      // 등급결정 기준 데이터
      const gradingCriteria = 
        '90점 이상: 대상 및 최우수상 후보, ' +
        '85점 이상: 우수상 후보, ' +
        '80점 이상: 특선 후보, ' +
        '75점 이상: 입선 후보';
      
      // 동점자 처리 데이터
      const tiebreakCriteria = 
        '조화(調和) 점수가 높은 작품우선, ' +
        '장법(章法) 점수가 높은 작품우선, ' +
        '심사위원 간 협의를 통한 결정';
      
      // 심사결과 확정 데이터
      const resultConfirmation = 
        '1. 심사위원장은 종합심사 결과를 이사장에게 전달합니다. ' +
        '2. 이사회는 심사결과를 검토하고 최종 승인합니다. ' +
        '3. 확정된 심사결과는 수상자에게 개별 통보하며, 협회 홈페이지에 게시합니다.';
      
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
        finalOpinion,
        gradingCriteria,
        tiebreakCriteria,
        resultConfirmation
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

        <div className="form-section">
          <div className="section-title">등급결정 및 동점자 처리</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="opinion-title">등급결정 기준</div>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>90점 이상: 대상 및 최우수상 후보</li>
                <li>85점 이상: 우수상 후보</li>
                <li>80점 이상: 특선 후보</li>
                <li>75점 이상: 입선 후보</li>
              </ul>
            </div>
            <div>
              <div className="opinion-title">동점자 발생시 처리방안</div>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>조화(調和) 점수가 높은 작품우선</li>
                <li>장법(章法) 점수가 높은 작품우선</li>
                <li>심사위원 간 협의를 통한 결정</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="form-section">
          <div className="section-title">심사결과 확정</div>
          <ol className="list-decimal pl-5 space-y-1 text-sm">
            <li>심사위원장은 종합심사 결과를 이사장에게 전달합니다.</li>
            <li>이사회는 심사결과를 검토하고 최종 승인합니다.</li>
            <li>확정된 심사결과는 수상자에게 개별 통보하며, 협회 홈페이지에 게시합니다.</li>
          </ol>
        </div>

        <SectionFooter
          currentDate={currentDate}
          signature={signatureName}
          setSignature={setSignatureName}
          signatureLabel="심사위원장"
          handlePdfDownload={handleDownloadPDF}
          handleCsvExport={handleExportCSV}
          isPdfGenerating={isGeneratingPDF}
          isCsvGenerating={isExportingCSV}
        />
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
          padding-top: 1rem;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-start;
          border-top: 1px solid hsl(var(--celadon));
          gap: 0.75rem;
        }
        
        @media (min-width: 640px) {
          .asca-eval-form .signature-section {
            padding-top: 1.5rem;
            flex-direction: row;
            align-items: flex-end;
            gap: 0;
          }
        }
        
        .asca-eval-form .evaluation-date {
          font-size: 10pt;
          color: hsl(var(--foreground));
          margin: 0;
          padding-bottom: 0;
          white-space: nowrap;
        }
        
        @media (min-width: 640px) {
          .asca-eval-form .evaluation-date {
            padding-bottom: 8px;
          }
        }
        
        .dark .asca-eval-form .evaluation-date {
          color: hsl(var(--foreground));
        }
        
        .asca-eval-form .signature-line {
          display: flex;
          align-items: baseline;
          gap: 8px;
          flex-grow: 1;
          justify-content: flex-start;
          color: hsl(var(--foreground));
          flex-wrap: wrap;
        }
        
        @media (min-width: 640px) {
          .asca-eval-form .signature-line {
            justify-content: flex-end;
            flex-wrap: nowrap;
          }
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
          padding: 4px 0;
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
        
        @media (min-width: 640px) {
          .asca-eval-form .signature-input {
            padding: 8px 0;
          }
        }
        
        .dark .asca-eval-form .signature-input {
          border-bottom: 1px solid hsl(var(--border));
          color: hsl(var(--foreground));
        }
        
        .asca-eval-form .signature-label-text {
          font-size: 10pt;
          color: hsl(var(--foreground));
          white-space: nowrap;
          padding-bottom: 0;
        }
        
        @media (min-width: 640px) {
          .asca-eval-form .signature-label-text {
            padding-bottom: 8px;
          }
        }
        
        .dark .asca-eval-form .signature-label-text {
          color: hsl(var(--foreground));
        }
        
        .asca-eval-form .button-container {
          margin-top: 0.75rem;
          padding-top: 0.5rem;
          display: flex;
          flex-direction: column-reverse;
          justify-content: space-between;
          align-items: center;
          gap: 0.75rem;
          border-top: 1px solid hsl(var(--celadon));
        }
        
        @media (min-width: 640px) {
          .asca-eval-form .button-container {
            margin-top: 1rem;
            flex-direction: row;
            gap: 0;
          }
        }
        
        .asca-eval-form .copyright-footer {
          font-size: 8pt;
          color: hsl(var(--muted-foreground));
          text-align: center;
          margin: 0;
          width: 100%;
        }
        
        @media (min-width: 640px) {
          .asca-eval-form .copyright-footer {
            text-align: left;
            width: auto;
          }
        }
        
        .asca-eval-form .button-group {
          display: flex;
          gap: 8px;
          width: 100%;
        }
        
        @media (min-width: 640px) {
          .asca-eval-form .button-group {
            width: auto;
          }
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
            padding: 1rem 0.75rem;
          }
          
          .asca-eval-form .title {
            font-size: 18pt;
            margin-bottom: 0.75rem;
          }
          
          .asca-eval-form .categories-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }

          .asca-eval-form .form-section {
            margin-bottom: 1rem;
            padding-bottom: 1rem;
          }

          .asca-eval-form .section-title {
            font-size: 1.1rem;
            margin-bottom: 0.75rem;
            padding-bottom: 0.4rem;
          }

          .asca-eval-form .opinion-field {
            margin-bottom: 1rem;
          }

          .asca-eval-form .opinion-title {
            font-size: 0.9rem;
            margin-bottom: 0.3rem;
          }

          .asca-eval-form textarea {
            min-height: 100px !important;
            padding: 8px;
            font-size: 0.9rem;
          }
        }

        @media (max-width: 480px) {
          .asca-eval-form {
            padding: 0.75rem 0.5rem;
          }

          .asca-eval-form .title {
            font-size: 16pt;
          }

          .asca-eval-form textarea {
            min-height: 80px !important;
          }
        }
        `}
      </style>
    </section>
  );
};

export default FeedbackSection;
