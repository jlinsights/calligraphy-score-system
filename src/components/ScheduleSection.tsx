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
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

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
    if (!formRef.current) {
      alert("양식 요소를 찾을 수 없습니다.");
      return;
    }
    
    setIsPdfGenerating(true);
    
    try {
      const form = formRef.current;
      
      // 임시 스타일 설정 및 버튼 숨기기
      const originalDisplay = form.style.display;
      form.classList.add('pdf-generating');
      
      const buttonContainers = form.querySelectorAll('.button-container');
      buttonContainers.forEach(el => (el as HTMLElement).style.display = 'none');
      
      // 필요한 스타일 적용을 위한 클론 생성
      const clone = form.cloneNode(true) as HTMLElement;
      clone.style.position = 'absolute';
      clone.style.left = '-9999px';
      clone.style.background = 'white';
      clone.style.width = '210mm'; // A4 width
      clone.style.padding = '10mm';
      document.body.appendChild(clone);
      
      // Canvas로 변환
      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      // 임시 요소 및 스타일 제거
      document.body.removeChild(clone);
      buttonContainers.forEach(el => (el as HTMLElement).style.display = '');
      form.classList.remove('pdf-generating');
      form.style.display = originalDisplay;
      
      // PDF 생성
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // PDF 메타데이터 설정
      pdf.setProperties({
        title: `심사일정표_${evalDate || new Date().toISOString().split('T')[0]}`,
        subject: '서예 작품 심사일정표',
        author: '동양서예협회',
        keywords: '심사일정표, 서예, 동양서예협회'
      });
      
      // PDF 설정
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const contentWidth = pdfWidth - (margin * 2);
      
      // 제목 추가
      pdf.setFontSize(18);
      pdf.text('심사 일정표', pdfWidth / 2, margin + 10, { align: 'center' });
      
      // 평가 정보 추가
      pdf.setFontSize(10);
      pdf.text(`심사 일시: ${evalDate}`, margin, margin + 20);
      pdf.text(`심사 장소: ${evalCategory || '행사'}`, pdfWidth - margin - 50, margin + 20);
      
      // 콘텐츠 추가
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pageContentHeight = pdfHeight - (margin * 2) - 30; // 제목과 정보, 마진 고려
      const ratio = canvas.width / imgWidth;
      const pageCount = Math.ceil(imgHeight / pageContentHeight);
      
      let srcY = 0;
      let yOffset = margin + 30; // 제목+정보 아래부터 시작
      
      for (let i = 0; i < pageCount; i++) {
        if (i > 0) {
          pdf.addPage();
          yOffset = margin;
          
          // 페이지 번호 추가
          pdf.setFontSize(10);
          pdf.text(`${i+1}/${pageCount}`, pdfWidth - margin, pdfHeight - 5);
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
          destHeight,
          `page-${i}`, // 고유 별칭 추가하여 캐시 문제 방지
          'FAST'
        );
        
        srcY += canvasHeight;
      }
      
      // 마지막 페이지에 서명 추가
      const lastPage = pdf.getNumberOfPages();
      pdf.setPage(lastPage);
      pdf.setFontSize(10);
      
      const finalY = pdfHeight - margin;
      pdf.text(`작성일: ${currentDate}`, margin, finalY - 10);
      pdf.text(`심사위원장: ${judgeSignature || '_______________'} (서명)`, pdfWidth - margin - 80, finalY - 10);
      
      // 파일 저장
      const filename = `심사일정표_${evalDate || new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);
      
      alert('심사 일정표가 PDF로 저장되었습니다.');
    } catch (error) {
      console.error("PDF 생성 오류:", error);
      alert("PDF 파일을 생성하는 중 오류가 발생했습니다.");
    } finally {
      setIsPdfGenerating(false);
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
