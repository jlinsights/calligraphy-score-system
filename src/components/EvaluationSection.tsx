import React, { useState, useEffect, useRef } from 'react';
import EvaluationInfo from '@/components/evaluation/EvaluationInfo';
import ScoreInput from '@/components/evaluation/ScoreInput';
import EvaluationActions from '@/components/evaluation/EvaluationActions';
import EvaluationCriteriaTable from '@/components/evaluation/EvaluationCriteriaTable';
import GradingGuidelines from '@/components/schedule/GradingGuidelines';
import { toast } from "@/components/ui/use-toast";
import { EvaluationFormData, EvaluationResult } from './evaluation/types';

const EvaluationSection = () => {
  const formRef = useRef<HTMLElement>(null);
  
  // 폼 데이터 상태
  const [formData, setFormData] = useState<EvaluationFormData>({
    seriesNumber: '',
    category: '',
    artistName: '',
    workTitle: '',
    currentDate: '',
    judgeSignature: '',
    pointsScore: null,
    structureScore: null,
    compositionScore: null,
    harmonyScore: null,
    totalScore: 0,
  });

  // UI 상태
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [isCsvGenerating, setIsCsvGenerating] = useState(false);
  const [isMarkdownGenerating, setIsMarkdownGenerating] = useState(false);

  // 초기화 및 계산
  useEffect(() => {
    generateSeriesNumber();
    setFormattedCurrentDate();
    loadSignatureFromLocalStorage();
  }, []);

  useEffect(() => {
    calculateTotalScore();
  }, [formData.pointsScore, formData.structureScore, formData.compositionScore, formData.harmonyScore]);

  // 유틸리티 함수들
  const generateSeriesNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    
    setFormData(prev => ({
      ...prev,
      seriesNumber: `${year}-${month}-${day}-${hours}${minutes}${seconds}`
    }));
  };

  const setFormattedCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    setFormData(prev => ({
      ...prev,
      currentDate: `${year}년 ${month}월 ${day}일`
    }));
  };

  const loadSignatureFromLocalStorage = () => {
    const savedSignature = localStorage.getItem('judgeSignature');
    if (savedSignature) {
      setFormData(prev => ({
        ...prev,
        judgeSignature: savedSignature
      }));
    }
  };

  const calculateTotalScore = () => {
    const total = (formData.pointsScore || 0) + 
                  (formData.structureScore || 0) + 
                  (formData.compositionScore || 0) + 
                  (formData.harmonyScore || 0);
    
    setFormData(prev => ({
      ...prev,
      totalScore: total
    }));
  };

  // 이벤트 핸들러
  const handleFormDataChange = (field: keyof EvaluationFormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleScoreChange = (category: string, score: number) => {
    setFormData(prev => ({
      ...prev,
      [`${category}Score`]: score
    }));
  };

  const isFormValid = () => {
    return formData.category && 
           formData.artistName && 
           formData.workTitle &&
           formData.pointsScore !== null && 
           formData.structureScore !== null && 
           formData.compositionScore !== null && 
           formData.harmonyScore !== null;
  };

  const handleSave = () => {
    if (!isFormValid()) {
      return;
    }

    setIsSaving(true);

    try {
      const evaluationResult: EvaluationResult = {
        id: formData.seriesNumber,
        date: formData.currentDate,
        category: formData.category,
        artistName: formData.artistName,
        workTitle: formData.workTitle,
        pointsScore: formData.pointsScore,
        structureScore: formData.structureScore,
        compositionScore: formData.compositionScore,
        harmonyScore: formData.harmonyScore,
        totalScore: formData.totalScore,
        judgeSignature: formData.judgeSignature,
        timestamp: new Date().getTime(),
      };

      const existingDataStr = localStorage.getItem('evaluationResults');
      const existingData: EvaluationResult[] = existingDataStr ? JSON.parse(existingDataStr) : [];
      existingData.push(evaluationResult);
      localStorage.setItem('evaluationResults', JSON.stringify(existingData));
      localStorage.setItem('judgeSignature', formData.judgeSignature);

      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000);

      handleReset();
      
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

  const handleReset = () => {
    const savedSignature = formData.judgeSignature;
    const currentDate = formData.currentDate;
    
    generateSeriesNumber();
    setFormData(prev => ({
      ...prev,
      artistName: '',
      workTitle: '',
      pointsScore: null,
      structureScore: null,
      compositionScore: null,
      harmonyScore: null,
      totalScore: 0,
      judgeSignature: savedSignature,
      currentDate,
    }));
  };

  const handleExportCsv = () => {
    try {
      setIsCsvGenerating(true);
      
      let csvContent = `\uFEFF작품 번호,${formData.seriesNumber}\n`;
      csvContent += `심사 부문,${formData.category}\n`;
      csvContent += `작가명,${formData.artistName}\n`;
      csvContent += `작품명,${formData.workTitle}\n\n`;
      csvContent += `평가 항목,배점,점수\n`;
      csvContent += `필획 (点画),40,${formData.pointsScore || ''}\n`;
      csvContent += `결구 (結構),25,${formData.structureScore || ''}\n`;
      csvContent += `장법 (章法),20,${formData.compositionScore || ''}\n`;
      csvContent += `조화 (調和),15,${formData.harmonyScore || ''}\n`;
      csvContent += `총점,100,${formData.totalScore}\n\n`;
      csvContent += `작성일,${formData.currentDate}\n`;
      csvContent += `심사위원,${formData.judgeSignature}`;
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename = `심사표_${formData.seriesNumber}_${formData.artistName || 'unknown'}.csv`;
      
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

  const handleExportMarkdown = () => {
    try {
      setIsMarkdownGenerating(true);
      
      let markdownContent = `# 심사표\n\n`;
      markdownContent += `- 작품 번호: ${formData.seriesNumber}\n`;
      markdownContent += `- 심사 부문: ${formData.category}\n`;
      markdownContent += `- 작가명: ${formData.artistName}\n`;
      markdownContent += `- 작품명: ${formData.workTitle}\n\n`;
      markdownContent += `## 평가 점수\n\n`;
      markdownContent += `| 평가 항목 | 배점 | 점수 |\n`;
      markdownContent += `|---------|-----|------|\n`;
      markdownContent += `| 필획 (点画) | 40점 | ${formData.pointsScore || '-'} |\n`;
      markdownContent += `| 결구 (結構) | 25점 | ${formData.structureScore || '-'} |\n`;
      markdownContent += `| 장법 (章法) | 20점 | ${formData.compositionScore || '-'} |\n`;
      markdownContent += `| 조화 (調和) | 15점 | ${formData.harmonyScore || '-'} |\n`;
      markdownContent += `| **총점** | **100점** | **${formData.totalScore}** |\n\n`;
      markdownContent += `### 등급결정 기준\n\n`;
      markdownContent += `- 90점 이상: A등급 (대상 및 최우수상 후보)\n`;
      markdownContent += `- 85-89점: B등급 (우수상 후보)\n`;
      markdownContent += `- 80-84점: C등급 (특선 후보)\n`;
      markdownContent += `- 75-79점: D등급 (입선 후보)\n`;
      markdownContent += `- 75점 미만: 기준 미달\n\n`;
      markdownContent += `작성일: ${formData.currentDate}\n\n`;
      markdownContent += `심사위원: ${formData.judgeSignature}`;
      
      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const filename = `심사표_${formData.seriesNumber}_${formData.artistName || 'unknown'}.md`;
      
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
    <section className="calligraphy-section space-y-6" id="evaluation-score-form" ref={formRef}>
      <div className="text-center">
        <h2 className="calligraphy-section-title">심사표</h2>
        <p className="text-muted-foreground mt-2">
          한국서예 평가 기준에 따른 체계적인 심사 시스템
        </p>
      </div>

      {/* 심사 정보 입력 */}
      <EvaluationInfo 
        formData={formData}
        onFormDataChange={handleFormDataChange}
      />

      {/* 평가 기준표 */}
      <EvaluationCriteriaTable />

      {/* 점수 입력 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <ScoreInput
            category="points"
            currentScore={formData.pointsScore}
            onScoreChange={handleScoreChange}
            minScore={1}
            maxScore={40}
            title="필획 (点画) - 40점"
            description="점, 선의 기본 기법과 필력 평가"
          />
          
          <ScoreInput
            category="structure"
            currentScore={formData.structureScore}
            onScoreChange={handleScoreChange}
            minScore={1}
            maxScore={25}
            title="결구 (結構) - 25점"
            description="글자의 구조와 균형 평가"
          />
        </div>

        <div className="space-y-4">
          <ScoreInput
            category="composition"
            currentScore={formData.compositionScore}
            onScoreChange={handleScoreChange}
            minScore={1}
            maxScore={20}
            title="장법 (章法) - 20점"
            description="전체적인 구성과 배치 평가"
          />
          
          <ScoreInput
            category="harmony"
            currentScore={formData.harmonyScore}
            onScoreChange={handleScoreChange}
            minScore={1}
            maxScore={15}
            title="조화 (調和) - 15점"
            description="통일성과 조화로움 평가"
          />
        </div>
      </div>

      {/* 등급 기준 가이드라인 */}
      <GradingGuidelines />

      {/* 액션 버튼들 */}
      <EvaluationActions
        formData={formData}
        isValid={isFormValid()}
        onSave={handleSave}
        onReset={handleReset}
        isSaving={isSaving}
        showSuccessAlert={showSuccessAlert}
        totalScore={formData.totalScore}
        onExportCsv={handleExportCsv}
        onExportMarkdown={handleExportMarkdown}
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

export default EvaluationSection;
