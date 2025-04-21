import React, { useState, useEffect, useRef } from 'react';
import EvaluationHeader from '@/components/evaluation/EvaluationHeader';
import EvaluationCriteriaTable from '@/components/evaluation/EvaluationCriteriaTable';
import ScoreTable from '@/components/evaluation/ScoreTable';
import GradingGuidelines from '@/components/schedule/GradingGuidelines';
import SectionFooter from "@/components/ui/section-footer";
import TurndownService from 'turndown';
import { Button } from '@/components/ui/button';
import { FileText, FileOutput } from 'lucide-react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DownloadIcon, FileIcon } from "lucide-react";

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
  const [isCsvGenerating, setIsCsvGenerating] = useState<boolean>(false);
  const [isMarkdownGenerating, setIsMarkdownGenerating] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingCsv, setIsExportingCsv] = useState(false);
  const [isExportingMarkdown, setIsExportingMarkdown] = useState(false);

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

  const handleCsvExport = () => {
    try {
      setIsCsvGenerating(true);
      let csvContent = `\uFEFF작성일:,${currentDate}\n`;
      csvContent += `심사 부문:,${category}\n`;
      csvContent += `작품 번호:,${seriesNumber}\n`;
      csvContent += `작가명:,${artistName}\n`;
      csvContent += `작품명:,${workTitle}\n\n`;
      
      csvContent += '평가 항목,배점,점수\n';
      csvContent += `점획(點劃),40,${pointsScore || 0}\n`;
      csvContent += `결구(結構),25,${structureScore || 0}\n`;
      csvContent += `장법(章法),20,${compositionScore || 0}\n`;
      csvContent += `조화(調和),15,${harmonyScore || 0}\n`;
      csvContent += `총점,100,${totalScore}\n\n`;
      
      csvContent += `심사위원:,${judgeSignature}`;
      
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
    } finally {
      setIsCsvGenerating(false);
    }
  };

  const handleDownloadMarkdown = async () => {
    try {
      setIsExportingMarkdown(true);
      const turndownService = new TurndownService();

      // 현재 날짜와 시간 포맷
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0];
      
      // 마크다운 컨텐츠 생성
      let markdownContent = `# 서예 작품 평가\n\n`;
      markdownContent += `## 작품 정보\n\n`;
      markdownContent += `- **일련 번호**: ${seriesNumber || '미지정'}\n`;
      markdownContent += `- **평가 일자**: ${currentDate || new Date().toLocaleDateString()}\n`;
      markdownContent += `- **부문**: ${category || '미지정'}\n`;
      markdownContent += `- **작가명**: ${artistName || '미지정'}\n`;
      markdownContent += `- **작품명**: ${workTitle || '미지정'}\n\n`;
      
      markdownContent += `## 점수 평가\n\n`;
      markdownContent += `| 평가 항목 | 점수 | 최대 점수 |\n`;
      markdownContent += `|---------|-----|--------|\n`;
      markdownContent += `| 점획(點劃) | ${pointsScore} | 25 |\n`;
      markdownContent += `| 결구(結構) | ${structureScore} | 25 |\n`;
      markdownContent += `| 장법(章法) | ${compositionScore} | 25 |\n`;
      markdownContent += `| 조화(調和) | ${harmonyScore} | 25 |\n`;
      markdownContent += `| **총점** | **${totalScore}** | **100** |\n\n`;
      
      markdownContent += `## 종합 의견\n\n${judgeSignature || '(의견이 없습니다)'}\n\n`;
      
      markdownContent += `## 심사위원\n\n`;
      markdownContent += `${judgeSignature || '미지정'}\n\n`;
      markdownContent += `---\n\n`;
      markdownContent += `생성일시: ${dateStr} ${timeStr}`;
      
      // 파일 다운로드
      const blob = new Blob([markdownContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `서예심사_평가_${seriesNumber || '미지정'}_${dateStr}.md`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Markdown 다운로드 오류:', error);
    } finally {
      setIsExportingMarkdown(false);
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

      <SectionFooter
        currentDate={currentDate}
        signature={judgeSignature}
        setSignature={setJudgeSignature}
        handleCsvExport={handleCsvExport}
        handleMarkdownDownload={handleDownloadMarkdown}
        isCsvGenerating={isCsvGenerating}
        isMarkdownGenerating={isMarkdownGenerating}
      />

      <div className="button-container">
        <Button 
          variant="outline" 
          onClick={handleDownloadMarkdown}
          disabled={isExportingMarkdown}
          className="download-button"
        >
          {isExportingMarkdown ? "내보내는 중..." : "마크다운 내보내기"}
          <FileOutput className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </section>
  );
};

export default EvaluationSection;
