import React, { useState, useEffect, useRef } from 'react';
import EvaluationHeader from '@/components/evaluation/EvaluationHeader';
import EvaluationCriteriaTable from '@/components/evaluation/EvaluationCriteriaTable';
import ScoreTable from '@/components/evaluation/ScoreTable';
import GradingGuidelines from '@/components/schedule/GradingGuidelines';
import SectionFooter from "@/components/ui/section-footer";
import TurndownService from 'turndown';
import { Button } from '@/components/ui/button';
import { FileText, FileOutput, Save, AlertCircle } from 'lucide-react';
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { DownloadIcon, FileIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { toast } from "./ui/use-toast";

// 심사 결과 인터페이스 정의
interface EvaluationResult {
  id: string;
  date: string;
  category: string;
  artistName: string;
  workTitle: string;
  pointsScore: number | null;
  structureScore: number | null;
  compositionScore: number | null;
  harmonyScore: number | null;
  totalScore: number;
  judgeSignature: string;
  timestamp: number;
}

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
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  useEffect(() => {
    generateSeriesNumber();
    setFormattedCurrentDate();
    loadSignatureFromLocalStorage();
  }, []);

  useEffect(() => {
    calculateTotalScore();
  }, [pointsScore, structureScore, compositionScore, harmonyScore]);

  const loadSignatureFromLocalStorage = () => {
    const savedSignature = localStorage.getItem('judgeSignature');
    if (savedSignature) {
      setJudgeSignature(savedSignature);
    }
  };

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

  // 심사 결과를 로컬 스토리지에 저장하는 함수
  const saveToLocalStorage = () => {
    if (!category || !artistName || !workTitle) {
      alert('부문, 작가명, 작품명은 필수 입력사항입니다.');
      return;
    }

    if (pointsScore === null || structureScore === null || compositionScore === null || harmonyScore === null) {
      alert('모든 항목의 점수를 입력해 주세요.');
      return;
    }

    setIsSaving(true);

    try {
      // 저장할 결과 데이터 생성
      const evaluationResult: EvaluationResult = {
        id: seriesNumber,
        date: currentDate,
        category,
        artistName,
        workTitle,
        pointsScore,
        structureScore,
        compositionScore,
        harmonyScore,
        totalScore,
        judgeSignature,
        timestamp: new Date().getTime(),
      };

      // 기존 데이터 가져오기
      const existingDataStr = localStorage.getItem('evaluationResults');
      const existingData: EvaluationResult[] = existingDataStr ? JSON.parse(existingDataStr) : [];

      // 새 데이터 추가
      existingData.push(evaluationResult);

      // 로컬 스토리지에 저장
      localStorage.setItem('evaluationResults', JSON.stringify(existingData));

      // 심사위원 서명 저장
      localStorage.setItem('judgeSignature', judgeSignature);

      // 성공 알림 표시
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);

      // 새로운 심사표를 위해 입력 필드 초기화
      resetForm();
    } catch (error) {
      console.error('저장 중 오류 발생:', error);
      alert('심사 결과를 저장하는 중 오류가 발생했습니다.');
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    generateSeriesNumber(); // 새 번호 생성
    setArtistName('');
    setWorkTitle('');
    setPointsScore(null);
    setStructureScore(null);
    setCompositionScore(null);
    setHarmonyScore(null);
    setTotalScore(0);
    // 부문과 심사위원 서명은 유지
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

      // 심사 결과 저장 호출
      if (category && artistName && workTitle && 
          pointsScore !== null && structureScore !== null && 
          compositionScore !== null && harmonyScore !== null) {
        saveToLocalStorage();
      }
      
      // 저장 후 심사결과종합표로 이동
      setTimeout(() => {
        window.location.href = '/results';
        toast({
          title: "심사결과종합표로 이동",
          description: "심사 결과를 저장하고 심사결과종합표로 이동합니다.",
          duration: 3000,
        });
      }, 1000);
      
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
      
      // 심사 결과 저장 호출
      if (category && artistName && workTitle && 
          pointsScore !== null && structureScore !== null && 
          compositionScore !== null && harmonyScore !== null) {
        saveToLocalStorage();
      }
      
      // 저장 후 심사결과종합표로 이동
      setTimeout(() => {
        window.location.href = '/results';
        toast({
          title: "심사결과종합표로 이동",
          description: "심사 결과를 저장하고 심사결과종합표로 이동합니다.",
          duration: 3000,
        });
      }, 1000);
      
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
      
      {showSuccessAlert && (
        <Alert className="mb-4 bg-green-50 border-green-500">
          <AlertCircle className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-600">저장 완료!</AlertTitle>
          <AlertDescription className="text-green-700">
            심사 결과가 성공적으로 저장되었습니다. 심사결과종합표에서 확인할 수 있습니다.
          </AlertDescription>
        </Alert>
      )}
      
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

      <div className="button-container mt-6 flex flex-wrap justify-center gap-2 sm:gap-4">
        <Button
          onClick={saveToLocalStorage}
          disabled={isSaving}
          className="min-w-[120px] sm:min-w-[160px] h-8 sm:h-10 text-xs sm:text-sm bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Save className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          {isSaving ? '저장 중...' : '심사 결과 저장'}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleDownloadMarkdown}
          disabled={isExportingMarkdown}
          className="min-w-[140px] sm:min-w-[180px] h-8 sm:h-10 text-xs sm:text-sm"
        >
          {isExportingMarkdown ? "내보내는 중..." : "마크다운 내보내기"}
          <FileOutput className="w-4 h-4 sm:w-5 sm:h-5 ml-1 sm:ml-2" />
        </Button>
      </div>

      <SectionFooter
        currentDate={currentDate}
        signature={judgeSignature}
        setSignature={setJudgeSignature}
        handleCsvExport={handleCsvExport}
        handleMarkdownDownload={handleDownloadMarkdown}
        isCsvGenerating={isCsvGenerating}
        isMarkdownGenerating={isMarkdownGenerating}
      />
    </section>
  );
};

export default EvaluationSection;
