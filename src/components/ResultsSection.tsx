import React, { useState, useEffect, useRef } from 'react';
import { toast } from "@/components/ui/use-toast";
import ResultsHeader from './results/ResultsHeader';
import ResultsTable from './results/ResultsTable';
import ResultsCalculator from './results/ResultsCalculator';
import ResultsExporter from './results/ResultsExporter';
import { ResultRow, EvaluationResult } from './results/types';

const ResultsSection = () => {
  // 상태 관리
  const [resultsData, setResultsData] = useState<ResultRow[]>([]);
  const [nextRowId, setNextRowId] = useState(0);
  const [evaluationDate, setEvaluationDate] = useState('');
  const [category, setCategory] = useState('');
  const [judgeSignature, setJudgeSignature] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);
  const formRef = useRef<HTMLDivElement>(null);

  // 초기화
  useEffect(() => {
    setFormattedCurrentDate();
    initializeRows();
    loadSignatureFromLocalStorage();
    loadAvailableCategories();
  }, []);

  // 카테고리 변경시 데이터 로드
  useEffect(() => {
    if (category) {
      loadEvaluationsByCategory(category);
    }
  }, [category]);

  // 현재 날짜 설정
  const setFormattedCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    setCurrentDate(`${year}년 ${month}월 ${day}일`);
    setEvaluationDate(`${year}-${month}-${day}`);
  };

  // 서명 정보 로드
  const loadSignatureFromLocalStorage = () => {
    const savedSignature = localStorage.getItem('judgeSignature');
    if (savedSignature) {
      setJudgeSignature(savedSignature);
    }
  };

  // 사용 가능한 카테고리 로드
  const loadAvailableCategories = () => {
    try {
      const resultsStr = localStorage.getItem('evaluationResults');
      if (!resultsStr) return;

      const results: EvaluationResult[] = JSON.parse(resultsStr);
      const categories = Array.from(new Set(results.map(r => r.category))).filter(Boolean);
      setAvailableCategories(categories);
    } catch (error) {
      console.error('카테고리 로드 중 오류 발생:', error);
    }
  };

  // 카테고리별 데이터 로드
  const loadEvaluationsByCategory = (selectedCategory: string) => {
    try {
      const resultsStr = localStorage.getItem('evaluationResults');
      if (!resultsStr) return;

      const results: EvaluationResult[] = JSON.parse(resultsStr);
      const filteredResults = results.filter(r => r.category === selectedCategory);
      
      if (filteredResults.length === 0) {
        toast({
          title: "알림",
          description: "해당 부문에 저장된 심사 결과가 없습니다.",
          duration: 3000,
        });
        return;
      }

      // 날짜 설정
      if (filteredResults.length > 0) {
        setEvaluationDate(filteredResults[0].date);
      }

      // 행 데이터 생성
      const newRows: ResultRow[] = filteredResults.map((result, index) => ({
        rowId: index,
        displayId: index + 1,
        artist: result.artistName,
        title: result.workTitle,
        score1: result.totalScore.toString(),
        score2: '',
        score3: '',
        average: null,
        rank: null,
        grade: '',
        remarks: ''
      }));

      // 최소 5개 행 보장
      while (newRows.length < 5) {
        newRows.push(createNewRow(newRows.length + 1));
      }

      setResultsData(newRows);
      setNextRowId(newRows.length);

      toast({
        title: "데이터 로드 완료",
        description: `${selectedCategory} 부문의 ${filteredResults.length}개 심사 결과를 로드했습니다.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('데이터 로드 중 오류 발생:', error);
      toast({
        title: "오류",
        description: "데이터 로드 중 오류가 발생했습니다.",
        duration: 3000,
        variant: "destructive"
      });
    }
  };

  // 초기 행 생성
  const initializeRows = () => {
    const initialRows: ResultRow[] = [];
    for (let i = 0; i < 5; i++) {
      initialRows.push(createNewRow(i + 1));
    }
    setResultsData(initialRows);
    setNextRowId(5);
  };

  // 새 행 생성
  const createNewRow = (displayId: number): ResultRow => {
    return {
      rowId: displayId - 1,
      displayId: displayId,
      artist: '',
      title: '',
      score1: '',
      score2: '',
      score3: '',
      average: null,
      rank: null,
      grade: '',
      remarks: ''
    };
  };

  // 행 추가
  const addRow = () => {
    const newRow = createNewRow(resultsData.length + 1);
    newRow.rowId = nextRowId;
    setResultsData([...resultsData, newRow]);
    setNextRowId(nextRowId + 1);
  };

  // 행 삭제
  const deleteRow = (rowId: number) => {
    const updatedData = resultsData
      .filter(row => row.rowId !== rowId)
      .map((row, index) => ({ ...row, displayId: index + 1 }));
    setResultsData(updatedData);
  };

  // 입력 변경 처리
  const handleInputChange = (rowId: number, field: keyof ResultRow, value: string) => {
    setResultsData(prevData =>
      prevData.map(row =>
        row.rowId === rowId ? { ...row, [field]: value } : row
      )
    );
  };

  // 등급 클래스 반환
  const getGradeClass = (grade: string): string => {
    switch (grade) {
      case '수': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case '우': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case '미': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case '양': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case '가': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  // 카테고리 변경 처리
  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
  };

  // 계산 결과 업데이트
  const handleUpdateCalculations = (updatedData?: ResultRow[]) => {
    if (updatedData) {
      setResultsData(updatedData);
    }
  };

  return (
    <div className="calligraphy-section" ref={formRef}>
      <h2 className="calligraphy-section-title">📋 심사 결과 관리</h2>
      
      {/* 헤더 정보 */}
      <ResultsHeader
        evaluationDate={evaluationDate}
        setEvaluationDate={setEvaluationDate}
        category={category}
        setCategory={setCategory}
        judgeSignature={judgeSignature}
        setJudgeSignature={setJudgeSignature}
        currentDate={currentDate}
        availableCategories={availableCategories}
        onCategoryChange={handleCategoryChange}
      />

      {/* 점수 계산 및 통계 */}
      <ResultsCalculator
        resultsData={resultsData}
        onUpdateCalculations={handleUpdateCalculations}
      />

      {/* 결과 테이블 */}
      <ResultsTable
        resultsData={resultsData}
        onInputChange={handleInputChange}
        onAddRow={addRow}
        onDeleteRow={deleteRow}
        getGradeClass={getGradeClass}
      />

      {/* 내보내기 */}
      <ResultsExporter
        resultsData={resultsData}
        evaluationDate={evaluationDate}
        category={category}
        judgeSignature={judgeSignature}
        currentDate={currentDate}
        formRef={formRef}
      />
    </div>
  );
};

export default ResultsSection;
