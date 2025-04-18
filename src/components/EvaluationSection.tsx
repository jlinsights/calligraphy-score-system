import React, { useState, useEffect, useRef } from 'react';
import EvaluationHeader from '@/components/evaluation/EvaluationHeader';
import EvaluationCriteriaTable from '@/components/evaluation/EvaluationCriteriaTable';
import ScoreTable from '@/components/evaluation/ScoreTable';
import GradingGuidelines from '@/components/schedule/GradingGuidelines';
import FormFooter from '@/components/schedule/FormFooter';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const EvaluationSection = () => {
  const formRef = useRef<HTMLElement>(null);
  const [seriesNumber, setSeriesNumber] = useState('');
  const [category, setCategory] = useState('');
  const [artistName, setArtistName] = useState('');
  const [workTitle, setWorkTitle] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [judgeSignature, setJudgeSignature] = useState('');
  
  const [pointsScore, setPointsScore] = useState<number | null>(null);
  const [structureScore, setStructureScore] = useState<number | null>(null);
  const [compositionScore, setCompositionScore] = useState<number | null>(null);
  const [harmonyScore, setHarmonyScore] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState<number>(0);

  useEffect(() => {
    generateSeriesNumber();
    setFormattedCurrentDate();
  }, []);

  useEffect(() => {
    calculateTotalScore();
  }, [pointsScore, structureScore, compositionScore, harmonyScore]);

  const generateSeriesNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    setSeriesNumber(`${year}-${month}-${day}-${hours}${minutes}${seconds}`);
  };

  const setFormattedCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    setCurrentDate(`${year}년 ${month}월 ${day}일`);
  };

  const calculateTotalScore = () => {
    const points = pointsScore || 0;
    const structure = structureScore || 0;
    const composition = compositionScore || 0;
    const harmony = harmonyScore || 0;
    setTotalScore(points + structure + composition + harmony);
  };

  const handleScoreClick = (category: string, value: number) => {
    switch(category) {
      case 'points':
        setPointsScore(value);
        break;
      case 'structure':
        setStructureScore(value);
        break;
      case 'composition':
        setCompositionScore(value);
        break;
      case 'harmony':
        setHarmonyScore(value);
        break;
      default:
        break;
    }
  };

  const handlePdfDownload = async () => {
    if (!formRef.current) return;
    
    try {
      const form = formRef.current;
      form.classList.add('pdf-generating');
      
      const buttonContainers = form.querySelectorAll('.button-container');
      buttonContainers.forEach(el => (el as HTMLElement).style.display = 'none');
      
      const canvas = await html2canvas(form, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      buttonContainers.forEach(el => (el as HTMLElement).style.display = '');
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasAspectRatio = canvas.width / canvas.height;
      const pageMargin = 15;
      
      pdf.setFontSize(16);
      pdf.text('심사표', pdfWidth / 2, pageMargin, { align: 'center' });
      
      const contentWidth = pdfWidth - (pageMargin * 2);
      const contentHeight = contentWidth / canvasAspectRatio;
      pdf.addImage(imgData, 'PNG', pageMargin, pageMargin + 10, contentWidth, contentHeight);
      
      const finalY = pdfHeight - pageMargin;
      pdf.setFontSize(10);
      pdf.text(`작성일: ${currentDate}`, pageMargin, finalY - 5);
      pdf.text(`심사위원장: ${judgeSignature || '_______________'} (서명)`, pdfWidth - pageMargin - 80, finalY - 5);
      
      const filename = `심사표_${category || '전체'}_${artistName || '무제'}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);
      
      alert('심사표가 PDF로 저장되었습니다.');
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
      csvContent += `심사 부문:,${category}\n`;
      csvContent += `작품 번호:,${seriesNumber}\n`;
      csvContent += `작가명:,${artistName}\n`;
      csvContent += `작품명:,${workTitle}\n\n`;
      
      csvContent += '평가 항목,배점,점수\n';
      csvContent += `필획의 정확성과 유창성,40,${pointsScore || 0}\n`;
      csvContent += `구조와 자간,25,${structureScore || 0}\n`;
      csvContent += `구도와 여백,20,${compositionScore || 0}\n`;
      csvContent += `조화와 창의성,15,${harmonyScore || 0}\n`;
      csvContent += `총점,100,${totalScore}\n\n`;
      
      csvContent += `심사위원장:,${judgeSignature}`;
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename = `심사표_${category || '전체'}_${artistName || '무제'}_${new Date().toISOString().split('T')[0]}.csv`;
      
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

  const renderScoreRange = (category: string, min: number, max: number) => {
    const buttons = [];
    for (let i = min; i <= max; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handleScoreClick(category, i)}
          className={`w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 flex items-center justify-center text-[9px] sm:text-[10px] md:text-xs border border-border rounded-md hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors 
            ${
              (category === 'points' && pointsScore === i) ||
              (category === 'structure' && structureScore === i) ||
              (category === 'composition' && compositionScore === i) ||
              (category === 'harmony' && harmonyScore === i)
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-card text-foreground'
            }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <section className="calligraphy-section" id="evaluation-score-form" ref={formRef}>
      <h2 className="calligraphy-section-title">심사표</h2>
      
      <EvaluationHeader 
        seriesNumber={seriesNumber}
        category={category}
        setCategory={setCategory}
        artistName={artistName}
        setArtistName={setArtistName}
        workTitle={workTitle}
        setWorkTitle={setWorkTitle}
      />

      <EvaluationCriteriaTable />

      <ScoreTable
        pointsScore={pointsScore}
        structureScore={structureScore}
        compositionScore={compositionScore}
        harmonyScore={harmonyScore}
        totalScore={totalScore}
        handleScoreClick={handleScoreClick}
        renderScoreRange={renderScoreRange}
      />

      <GradingGuidelines />

      <FormFooter
        currentDate={currentDate}
        judgeSignature={judgeSignature}
        setJudgeSignature={setJudgeSignature}
        handlePdfDownload={handlePdfDownload}
        handleCsvExport={handleCsvExport}
      />
    </section>
  );
};

export default EvaluationSection;
