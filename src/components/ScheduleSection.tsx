import React, { useState, useEffect, useRef } from 'react';
import PlanForm from './schedule/PlanForm';
import EvaluationCriteria from './schedule/EvaluationCriteria';
import GradingGuidelines from './schedule/GradingGuidelines';
import SectionFooter from "@/components/ui/section-footer";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const ScheduleSection = () => {
  const [judgeChair, setJudgeChair] = useState('');
  const [evalDate, setEvalDate] = useState('');
  const [evalCategory, setEvalCategory] = useState('');
  const [judges, setJudges] = useState(['', '', '']);
  const [planContent, setPlanContent] = useState('');
  const [judgeSignature, setJudgeSignature] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (!evalDate) setEvalDate(today);
    
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    setCurrentDate(`${year}년 ${month}월 ${day}일`);
  }, [evalDate]);

  const handleJudgeChange = (index: number, value: string) => {
    const updatedJudges = [...judges];
    updatedJudges[index] = value;
    setJudges(updatedJudges);
  };

  const handlePdfDownload = async () => {
    if (!formRef.current) return;
    
    try {
      const form = formRef.current;
      form.classList.add('pdf-generating');
      
      const canvas = await html2canvas(form, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          clonedDoc.querySelectorAll('.button-container').forEach(
            el => el.remove()
          );
          
          clonedDoc.querySelectorAll('input, select, textarea').forEach(input => {
            input.setAttribute('style', 'border: none; background-color: transparent; padding: 0; margin: 0;');
            (input as HTMLInputElement).readOnly = true;
          });
        }
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pdfWidth - (margin * 2);
      
      pdf.setFontSize(16);
      pdf.text('심사계획서', pdfWidth / 2, margin, { align: 'center' });
      
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pageContentHeight = pdfHeight - (margin * 2) - 20;
      const ratio = canvas.width / imgWidth;
      const pageCount = Math.ceil(imgHeight / pageContentHeight);
      
      let srcY = 0;
      let yOffset = margin + 20;
      
      for (let i = 0; i < pageCount; i++) {
        if (i > 0) {
          pdf.addPage();
          yOffset = margin;
        }
        
        const canvasHeight = Math.min(
          (pageContentHeight * ratio),
          canvas.height - srcY
        );
        
        const destHeight = canvasHeight / ratio;
        
        pdf.addImage(
          imgData,
          'PNG',
          margin,
          yOffset,
          imgWidth,
          destHeight
        );
        
        srcY += canvasHeight;
      }
      
      const lastPage = pdf.getNumberOfPages();
      pdf.setPage(lastPage);
      const finalY = pdfHeight - (margin / 2);
      pdf.text(`작성일: ${currentDate}`, margin, finalY);
      pdf.text(`심사위원장: ${judgeSignature || '_______________'} (서명)`, pdfWidth - margin - 80, finalY);
      
      const filename = `심사계획서_${evalCategory || '전체'}_${evalDate || new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);
      
    } catch (error) {
      console.error("PDF 생성 오류:", error);
      alert("PDF 파일을 생성하는 중 오류가 발생했습니다.");
    } finally {
      if (formRef.current) {
        formRef.current.classList.remove('pdf-generating');
      }
    }
  };

  const handleCsvExport = () => {
    try {
      let csvContent = `\uFEFF작성일:,${currentDate}\n`;
      csvContent += `심사 일시:,${evalDate}\n`;
      csvContent += `심사 부문:,${evalCategory}\n\n`;
      
      csvContent += '심사위원장:,' + judgeChair + '\n';
      csvContent += '심사위원:\n';
      judges.forEach((judge, index) => {
        csvContent += `${index + 1},${judge}\n`;
      });
      
      csvContent += '\n심사 계획 내용:\n';
      csvContent += planContent.split('\n').map(line => `"${line}"`).join('\n');
      csvContent += '\n\n';
      
      csvContent += `심사위원장:,${judgeSignature}`;
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename = `심사계획서_${evalCategory || '전체'}_${evalDate || new Date().toISOString().split('T')[0]}.csv`;
      
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
    }
  };

  return (
    <section className="calligraphy-section" id="evaluation-plan-form">
      <h2 className="calligraphy-section-title">심사계획서</h2>
      
      <PlanForm
        judgeChair={judgeChair}
        setJudgeChair={setJudgeChair}
        evalDate={evalDate}
        setEvalDate={setEvalDate}
        evalCategory={evalCategory}
        setEvalCategory={setEvalCategory}
        judges={judges}
        handleJudgeChange={handleJudgeChange}
        planContent={planContent}
        setPlanContent={setPlanContent}
      />
      
      <EvaluationCriteria />
      
      <GradingGuidelines />
      
      <SectionFooter
        currentDate={currentDate}
        signature={judgeSignature}
        setSignature={setJudgeSignature}
        handlePdfDownload={handlePdfDownload}
        handleCsvExport={handleCsvExport}
      />
    </section>
  );
};

export default ScheduleSection;
