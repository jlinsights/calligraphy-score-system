import React, { useState, useEffect, useRef } from 'react';
import PlanForm from './schedule/PlanForm';
import EvaluationCriteria from './schedule/EvaluationCriteria';
import GradingGuidelines from './schedule/GradingGuidelines';
import SectionFooter from "@/components/ui/section-footer";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { generatePdfFromElement } from '@/utils/pdfUtils';
import TurndownService from 'turndown';
import { Button } from "@/components/ui/button";
import { FileDown, FileText, FileOutput } from 'lucide-react';

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
  const [isCsvGenerating, setIsCsvGenerating] = useState(false);
  const [isMarkdownGenerating, setIsMarkdownGenerating] = useState(false);

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
      const filename = `심사일정표_${evalDate || new Date().toISOString().split('T')[0]}.pdf`;
      
      // PDF 생성
      await generatePdfFromElement(
        form,
        filename,
        '심사 일정표',
        currentDate,
        judgeSignature
      );
      
      // 원래 스타일로 복원
      tempStyles.forEach(item => {
        item.el.style.display = item.display;
      });
      form.classList.remove('pdf-generating');
      
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
      setIsCsvGenerating(true);
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
    } finally {
      setIsCsvGenerating(false);
    }
  };

  const handleDownloadMarkdown = () => {
    try {
      setIsMarkdownGenerating(true);
      
      // 마크다운 콘텐츠 생성
      let markdownContent = `# 심사계획서\n\n`;
      markdownContent += `작성일: ${currentDate}\n`;
      markdownContent += `심사 일시: ${evalDate}\n`;
      markdownContent += `심사 부문: ${evalCategory}\n\n`;
      
      markdownContent += `## 심사위원\n\n`;
      markdownContent += `- 심사위원장: ${judgeChair}\n`;
      markdownContent += `- 심사위원 명단:\n`;
      judges.forEach((judge, index) => {
        if (judge) {
          markdownContent += `  ${index + 1}. ${judge}\n`;
        }
      });
      
      markdownContent += `\n## 심사 계획 내용\n\n`;
      markdownContent += planContent.split('\n').map(line => line).join('\n');
      
      markdownContent += `\n\n## 평가 기준\n\n`;
      markdownContent += `### 평가항목 및 배점\n\n`;
      markdownContent += `| 평가 항목 | 배점 |\n`;
      markdownContent += `|---------|-----|\n`;
      markdownContent += `| 필획 (点画) | 40점 |\n`;
      markdownContent += `| 결구 (結構) | 25점 |\n`;
      markdownContent += `| 장법 (章法) | 20점 |\n`;
      markdownContent += `| 조화 (調和) | 15점 |\n`;
      markdownContent += `| **계** | **100점** |\n\n`;
      
      markdownContent += `### 등급결정 기준\n\n`;
      markdownContent += `- 90점 이상: A등급 (대상 및 최우수상 후보)\n`;
      markdownContent += `- 85-89점: B등급 (우수상 후보)\n`;
      markdownContent += `- 80-84점: C등급 (특선 후보)\n`;
      markdownContent += `- 75-79점: D등급 (입선 후보)\n`;
      markdownContent += `- 75점 미만: 기준 미달\n\n`;
      
      markdownContent += `심사위원장: ${judgeSignature}`;
      
      // 파일 다운로드
      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      
      // 파일명 생성
      const filename = `심사계획서_${evalCategory || '전체'}_${evalDate || new Date().toISOString().split('T')[0]}.md`;
      link.setAttribute('download', filename);
      
      // 링크 클릭하여 다운로드
      document.body.appendChild(link);
      link.click();
      
      // 임시 요소 제거
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
        setIsMarkdownGenerating(false);
        alert('심사계획서를 마크다운 파일로 내보냈습니다.');
      }, 100);
    } catch (error) {
      console.error('마크다운 내보내기 오류:', error);
      setIsMarkdownGenerating(false);
      alert('마크다운 파일을 생성하는 중 오류가 발생했습니다.');
    }
  };

  return (
    <section className="calligraphy-section" id="evaluation-plan-form" ref={formRef}>
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
        handleMarkdownDownload={handleDownloadMarkdown}
        isPdfGenerating={isPdfGenerating}
        isCsvGenerating={isCsvGenerating}
        isMarkdownGenerating={isMarkdownGenerating}
      />
    </section>
  );
};

export default ScheduleSection;
