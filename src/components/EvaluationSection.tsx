import React, { useState, useEffect, useRef } from 'react';
import EvaluationHeader from '@/components/evaluation/EvaluationHeader';
import EvaluationCriteriaTable from '@/components/evaluation/EvaluationCriteriaTable';
import ScoreTable from '@/components/evaluation/ScoreTable';
import GradingGuidelines from '@/components/schedule/GradingGuidelines';
import { Button } from '@/components/ui/button';
import { Save, AlertCircle, FileDown, FileText } from 'lucide-react';
import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isCsvGenerating, setIsCsvGenerating] = useState(false);
  const [isMarkdownGenerating, setIsMarkdownGenerating] = useState(false);

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

  // CSV 다운로드 기능 추가
  const handleCsvExport = () => {
    try {
      setIsCsvGenerating(true);
      
      // CSV 데이터 생성
      let csvContent = `\uFEFF작품 번호,${seriesNumber}\n`;
      csvContent += `심사 부문,${category}\n`;
      csvContent += `작가명,${artistName}\n`;
      csvContent += `작품명,${workTitle}\n\n`;
      
      csvContent += `평가 항목,배점,점수\n`;
      csvContent += `필획 (点画),40,${pointsScore || ''}\n`;
      csvContent += `결구 (結構),25,${structureScore || ''}\n`;
      csvContent += `장법 (章法),20,${compositionScore || ''}\n`;
      csvContent += `조화 (調和),15,${harmonyScore || ''}\n`;
      csvContent += `총점,100,${totalScore}\n\n`;
      
      csvContent += `작성일,${currentDate}\n`;
      csvContent += `심사위원,${judgeSignature}`;
      
      // 파일 다운로드
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename = `심사표_${seriesNumber}_${artistName || 'unknown'}.csv`;
      
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
  
  // 마크다운 다운로드 기능 추가
  const handleDownloadMarkdown = () => {
    try {
      setIsMarkdownGenerating(true);
      
      // 마크다운 콘텐츠 생성
      let markdownContent = `# 심사표\n\n`;
      markdownContent += `- 작품 번호: ${seriesNumber}\n`;
      markdownContent += `- 심사 부문: ${category}\n`;
      markdownContent += `- 작가명: ${artistName}\n`;
      markdownContent += `- 작품명: ${workTitle}\n\n`;
      
      markdownContent += `## 평가 점수\n\n`;
      markdownContent += `| 평가 항목 | 배점 | 점수 |\n`;
      markdownContent += `|---------|-----|------|\n`;
      markdownContent += `| 필획 (点画) | 40점 | ${pointsScore || '-'} |\n`;
      markdownContent += `| 결구 (結構) | 25점 | ${structureScore || '-'} |\n`;
      markdownContent += `| 장법 (章法) | 20점 | ${compositionScore || '-'} |\n`;
      markdownContent += `| 조화 (調和) | 15점 | ${harmonyScore || '-'} |\n`;
      markdownContent += `| **총점** | **100점** | **${totalScore}** |\n\n`;
      
      markdownContent += `### 등급결정 기준\n\n`;
      markdownContent += `- 90점 이상: A등급 (대상 및 최우수상 후보)\n`;
      markdownContent += `- 85-89점: B등급 (우수상 후보)\n`;
      markdownContent += `- 80-84점: C등급 (특선 후보)\n`;
      markdownContent += `- 75-79점: D등급 (입선 후보)\n`;
      markdownContent += `- 75점 미만: 기준 미달\n\n`;
      
      markdownContent += `작성일: ${currentDate}\n\n`;
      markdownContent += `심사위원: ${judgeSignature}`;
      
      // 파일 다운로드
      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      
      // 파일명 생성
      const filename = `심사표_${seriesNumber}_${artistName || 'unknown'}.md`;
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
      }, 100);
    } catch (error) {
      console.error('마크다운 내보내기 오류:', error);
      setIsMarkdownGenerating(false);
      alert('마크다운 파일을 생성하는 중 오류가 발생했습니다.');
    }
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
      </div>

      <div className="signature-section border-t border-primary pt-3 sm:pt-6 mt-4 sm:mt-8 flex flex-col sm:flex-row justify-between sm:items-end gap-3 sm:gap-0">
        <p className="text-xs sm:text-sm text-foreground m-0 mb-1 sm:mb-0 pb-0 sm:pb-2">작성일: {currentDate}</p>
        <div className="flex flex-col sm:flex-row items-start sm:items-baseline gap-1 sm:gap-2 w-full sm:w-auto">
          <Label htmlFor="signature-input" className="font-bold whitespace-nowrap text-foreground text-sm mb-1 sm:mb-0">심사위원:</Label>
          <div className="w-full sm:w-[200px] md:w-[250px] relative">
            <Input 
              id="signature-input"
              value={judgeSignature}
              onChange={(e) => setJudgeSignature(e.target.value)}
              className="border-0 border-b border-input rounded-none bg-transparent px-0 py-1 sm:py-2 text-sm"
              placeholder="이름을 입력하세요"
            />
          </div>
          <span className="text-xs sm:text-sm text-foreground whitespace-nowrap pb-0 sm:pb-2 mt-1 sm:mt-0">(서명)</span>
        </div>
      </div>

      <div className="button-container border-t border-primary pt-3 sm:pt-6 mt-3 sm:mt-6 flex flex-col-reverse sm:flex-row justify-between items-center gap-3 sm:gap-0">
        <p className="text-[9px] sm:text-xs text-muted-foreground m-0 text-center sm:text-left w-full sm:w-auto mt-2 sm:mt-0">
          © {new Date().getFullYear()} 동양서예협회 (The Asian Society of Calligraphic Arts)
        </p>
        <div className="flex flex-wrap gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCsvExport}
            disabled={isCsvGenerating}
            className="flex items-center"
          >
            <FileDown className="h-4 w-4 mr-1" />
            <span className="text-xs">{isCsvGenerating ? "CSV 생성 중..." : "CSV 다운로드"}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadMarkdown}
            disabled={isMarkdownGenerating}
            className="flex items-center"
          >
            <FileText className="h-4 w-4 mr-1" />
            <span className="text-xs">{isMarkdownGenerating ? "마크다운 생성 중..." : "마크다운 다운로드"}</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EvaluationSection;
