import React, { useState, useEffect, useRef } from 'react';
import ScheduleInfo from './schedule/ScheduleInfo';
import JudgeManagement from './schedule/JudgeManagement';
import ScheduleExport from './schedule/ScheduleExport';
import PlanForm from './schedule/PlanForm';
import EvaluationCriteria from './schedule/EvaluationCriteria';
import GradingGuidelines from './schedule/GradingGuidelines';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import TurndownService from 'turndown';
import { ScheduleFormData } from './schedule/types';

const ScheduleSection = () => {
  const formRef = useRef<HTMLDivElement>(null);
  
  // 폼 데이터 상태
  const [formData, setFormData] = useState<ScheduleFormData>({
    judgeChair: '',
    evalDate: '',
    evalCategory: '',
    judges: ['', '', ''],
    planContent: '',
    judgeSignature: '',
    currentDate: '',
  });

  // UI 상태
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [isCsvGenerating, setIsCsvGenerating] = useState(false);
  const [isMarkdownGenerating, setIsMarkdownGenerating] = useState(false);

  // 초기화
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    setFormData(prev => ({
      ...prev,
      evalDate: prev.evalDate || today,
      currentDate: `${year}년 ${month}월 ${day}일`
    }));
  }, []);

  // 이벤트 핸들러
  const handleFormDataChange = (field: keyof ScheduleFormData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleJudgeChange = (index: number, value: string) => {
    const updatedJudges = [...formData.judges];
    updatedJudges[index] = value;
    setFormData(prev => ({
      ...prev,
      judges: updatedJudges
    }));
  };

  const handleJudgeChairChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      judgeChair: value
    }));
  };

  const handleJudgeSignatureChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      judgeSignature: value
    }));
  };

  const handlePlanContentChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      planContent: value
    }));
  };

  // 내보내기 함수들
  const handlePdfDownload = async () => {
    if (!formRef.current) {
      alert("양식 요소를 찾을 수 없습니다.");
      return;
    }
    
    setIsPdfGenerating(true);
    
    try {
      const form = formRef.current;
      
      const buttonContainers = form.querySelectorAll('.button-container');
      const tempStyles: { el: HTMLElement; display: string }[] = [];
      
      buttonContainers.forEach(el => {
        const htmlEl = el as HTMLElement;
        tempStyles.push({ el: htmlEl, display: htmlEl.style.display });
        htmlEl.style.display = 'none';
      });
      
      form.classList.add('pdf-generating');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const margin = { top: 10, right: 10, bottom: 10, left: 10 };
      const pageWidth = 210;
      const contentWidth = pageWidth - margin.left - margin.right;
      
      try {
        const canvas = await html2canvas(form, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
        });
        
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = contentWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        const pageHeight = 297 - margin.top - margin.bottom;
        const pageCount = Math.ceil(imgHeight / pageHeight);
        
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(16);
        pdf.text('심사 일정표', pageWidth / 2, margin.top + 10, { align: 'center' });
        
        for (let i = 0; i < pageCount; i++) {
          if (i > 0) {
            pdf.addPage();
          }
          
          const srcY = i * pageHeight;
          const sliceHeight = Math.min(pageHeight, imgHeight - srcY);
          
          pdf.addImage(
            imgData, 'PNG', margin.left, margin.top + 20, imgWidth, sliceHeight,
            undefined, 'FAST', srcY
          );
          
          if (i === pageCount - 1) {
            const footerY = Math.min(margin.top + 20 + sliceHeight + 10, 297 - margin.bottom - 10);
            pdf.setFontSize(10);
            pdf.text(`날짜: ${formData.currentDate}`, margin.left, footerY);
            if (formData.judgeSignature) {
              pdf.text(`심사위원장: ${formData.judgeSignature}`, pageWidth - margin.right, footerY, { align: 'right' });
            }
          }
        }
        
        const filename = `심사일정표_${formData.evalCategory || '전체'}_${formData.evalDate || new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(filename);
        alert('심사 일정표가 PDF로 저장되었습니다.');
        
      } catch (err) {
        console.error('Canvas 생성 오류:', err);
        throw err;
      }
      
      tempStyles.forEach(item => {
        item.el.style.display = item.display;
      });
      form.classList.remove('pdf-generating');
      
    } catch (error) {
      console.error("PDF 생성 오류:", error);
      alert("PDF 파일을 생성하는 중 오류가 발생했습니다.");
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleCsvExport = () => {
    try {
      setIsCsvGenerating(true);
      let csvContent = `\uFEFF작성일:,${formData.currentDate}\n`;
      csvContent += `심사 일시:,${formData.evalDate}\n`;
      csvContent += `심사 부문:,${formData.evalCategory}\n\n`;
      csvContent += '심사위원장:,' + formData.judgeChair + '\n';
      csvContent += '심사위원:\n';
      formData.judges.forEach((judge, index) => {
        csvContent += `${index + 1},${judge}\n`;
      });
      csvContent += '\n심사 계획 내용:\n';
      csvContent += formData.planContent.split('\n').map(line => `"${line}"`).join('\n');
      csvContent += '\n\n';
      csvContent += `심사위원장:,${formData.judgeSignature}`;
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename = `심사계획서_${formData.evalCategory || '전체'}_${formData.evalDate || new Date().toISOString().split('T')[0]}.csv`;
      
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("CSV 생성 오류:", error);
      alert("CSV 파일을 생성하는 중 오류가 발생했습니다.");
    } finally {
      setIsCsvGenerating(false);
    }
  };

  const handleDownloadMarkdown = () => {
    try {
      setIsMarkdownGenerating(true);
      
      let markdownContent = `# 심사 일정표\n\n`;
      markdownContent += `**작성일:** ${formData.currentDate}\n\n`;
      markdownContent += `## 심사 정보\n\n`;
      markdownContent += `- **심사 일시:** ${formData.evalDate}\n`;
      markdownContent += `- **심사 부문:** ${formData.evalCategory}\n`;
      markdownContent += `- **심사위원장:** ${formData.judgeChair}\n\n`;
      
      markdownContent += `## 심사위원 구성\n\n`;
      markdownContent += `| 구분 | 성명 |\n`;
      markdownContent += `|------|------|\n`;
      markdownContent += `| 심사위원장 | ${formData.judgeChair} |\n`;
      
      formData.judges.forEach((judge, index) => {
        if (judge.trim()) {
          markdownContent += `| 심사위원 ${index + 1} | ${judge} |\n`;
        }
      });
      
      if (formData.planContent) {
        markdownContent += `\n## 심사 계획\n\n`;
        markdownContent += formData.planContent + '\n\n';
      }
      
      markdownContent += `---\n\n`;
      markdownContent += `**심사위원장:** ${formData.judgeSignature} (서명)\n\n`;
      
      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `심사일정표_${formData.evalCategory || '전체'}_${formData.evalDate || new Date().toISOString().split('T')[0]}.md`;
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('마크다운 내보내기 오류:', error);
      alert('마크다운 파일을 생성하는 중 오류가 발생했습니다.');
    } finally {
      setIsMarkdownGenerating(false);
    }
  };

  return (
    <section className="calligraphy-section space-y-6" id="schedule-plan-form">
      <div className="text-center">
        <h2 className="calligraphy-section-title">심사 일정표</h2>
        <p className="text-muted-foreground mt-2">
          체계적인 심사 운영을 위한 일정 계획 및 관리
        </p>
      </div>

      <div ref={formRef} className="space-y-6">
        {/* 심사 기본 정보 */}
        <ScheduleInfo
          formData={formData}
          onFormDataChange={handleFormDataChange}
        />

        {/* 심사위원 관리 */}
        <JudgeManagement
          judges={formData.judges}
          judgeChair={formData.judgeChair}
          judgeSignature={formData.judgeSignature}
          onJudgeChange={handleJudgeChange}
          onJudgeChairChange={handleJudgeChairChange}
          onJudgeSignatureChange={handleJudgeSignatureChange}
          currentDate={formData.currentDate}
        />

        {/* 심사 계획 */}
        <PlanForm
          planContent={formData.planContent}
          onPlanContentChange={handlePlanContentChange}
        />

        {/* 평가 기준 */}
        <EvaluationCriteria />

        {/* 등급 가이드라인 */}
        <GradingGuidelines />
      </div>

      {/* 내보내기 */}
      <ScheduleExport
        formData={formData}
        formRef={formRef}
        onExportPdf={handlePdfDownload}
        onExportCsv={handleCsvExport}
        onExportMarkdown={handleDownloadMarkdown}
        isPdfGenerating={isPdfGenerating}
        isCsvGenerating={isCsvGenerating}
        isMarkdownGenerating={isMarkdownGenerating}
      />

      {/* 저작권 정보 */}
      <div className="text-center pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} 동양서예협회 (The Asian Society of Calligraphic Arts)
        </p>
      </div>
    </section>
  );
};

export default ScheduleSection;
