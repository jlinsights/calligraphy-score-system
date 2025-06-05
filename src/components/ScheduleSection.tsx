import React, { useState, useEffect, useRef } from 'react';
import ScheduleInfo from './schedule/ScheduleInfo';
import JudgeManagement from './schedule/JudgeManagement';
import ScheduleExport from './schedule/ScheduleExport';
import PlanForm from './schedule/PlanForm';
import EvaluationCriteria from './schedule/EvaluationCriteria';
import GradingGuidelines from './schedule/GradingGuidelines';
import { generatePdfFromElement, exportToCsv, exportToMarkdown } from '@/utils/pdfUtils';
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
      const filename = `심사일정표_${formData.evalCategory || '전체'}_${formData.evalDate || new Date().toISOString().split('T')[0]}.pdf`;
      await generatePdfFromElement(formRef.current, filename, '심사 일정표');
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
      
      let csvContent = `작성일:,${formData.currentDate}\n`;
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
      
      const filename = `심사계획서_${formData.evalCategory || '전체'}_${formData.evalDate || new Date().toISOString().split('T')[0]}.csv`;
      exportToCsv(csvContent, filename);
      
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
      
      const filename = `심사일정표_${formData.evalCategory || '전체'}_${formData.evalDate || new Date().toISOString().split('T')[0]}.md`;
      exportToMarkdown(markdownContent, filename);
      
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
