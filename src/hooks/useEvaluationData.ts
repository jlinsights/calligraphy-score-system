import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { toast } from "@/components/ui/use-toast";

// 심사 결과 인터페이스
export interface EvaluationResult {
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

// 심사 데이터 관리 훅
export function useEvaluationData() {
  const [evaluations, setEvaluations] = useLocalStorage<EvaluationResult[]>('evaluationResults', []);
  const [categories, setCategories] = useState<string[]>([]);

  // 카테고리 목록 업데이트
  useEffect(() => {
    const uniqueCategories = Array.from(
      new Set(evaluations.map(e => e.category).filter(Boolean))
    );
    setCategories(uniqueCategories);
  }, [evaluations]);

  // 심사 결과 추가
  const addEvaluation = (evaluation: Omit<EvaluationResult, 'id' | 'timestamp'>) => {
    const newEvaluation: EvaluationResult = {
      ...evaluation,
      id: `eval_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
    };

    setEvaluations(prev => [...prev, newEvaluation]);
    
    toast({
      title: "심사 결과 저장 완료",
      description: `${evaluation.artistName}님의 심사 결과가 저장되었습니다.`,
      duration: 3000,
    });

    return newEvaluation;
  };

  // 심사 결과 업데이트
  const updateEvaluation = (id: string, updates: Partial<EvaluationResult>) => {
    setEvaluations(prev =>
      prev.map(evaluation =>
        evaluation.id === id ? { ...evaluation, ...updates } : evaluation
      )
    );

    toast({
      title: "심사 결과 수정 완료",
      description: "심사 결과가 성공적으로 수정되었습니다.",
      duration: 3000,
    });
  };

  // 심사 결과 삭제
  const deleteEvaluation = (id: string) => {
    const evaluation = evaluations.find(e => e.id === id);
    
    setEvaluations(prev => prev.filter(e => e.id !== id));
    
    toast({
      title: "심사 결과 삭제 완료",
      description: evaluation ? `${evaluation.artistName}님의 심사 결과가 삭제되었습니다.` : "심사 결과가 삭제되었습니다.",
      duration: 3000,
    });
  };

  // 카테고리별 심사 결과 조회
  const getEvaluationsByCategory = (category: string) => {
    return evaluations.filter(e => e.category === category);
  };

  // 날짜별 심사 결과 조회
  const getEvaluationsByDate = (date: string) => {
    return evaluations.filter(e => e.date === date);
  };

  // 심사 결과 검색
  const searchEvaluations = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return evaluations.filter(e =>
      e.artistName.toLowerCase().includes(lowercaseQuery) ||
      e.workTitle.toLowerCase().includes(lowercaseQuery) ||
      e.category.toLowerCase().includes(lowercaseQuery)
    );
  };

  // 통계 계산
  const getStatistics = () => {
    if (evaluations.length === 0) {
      return {
        total: 0,
        averageScore: 0,
        highestScore: 0,
        lowestScore: 0,
        categoryCounts: {},
      };
    }

    const scores = evaluations.map(e => e.totalScore).filter(score => score > 0);
    const categoryCounts = evaluations.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      total: evaluations.length,
      averageScore: scores.length > 0 ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
      highestScore: scores.length > 0 ? Math.max(...scores) : 0,
      lowestScore: scores.length > 0 ? Math.min(...scores) : 0,
      categoryCounts,
    };
  };

  // 데이터 내보내기
  const exportData = () => {
    const exportData = {
      exportDate: new Date().toISOString(),
      version: '1.0',
      evaluations,
      statistics: getStatistics(),
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json;charset=utf-8;'
    });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `evaluation_data_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "데이터 내보내기 완료",
      description: "심사 데이터가 JSON 파일로 내보내졌습니다.",
      duration: 3000,
    });
  };

  // 데이터 가져오기
  const importData = (file: File) => {
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const data = JSON.parse(content);
          
          if (data.evaluations && Array.isArray(data.evaluations)) {
            setEvaluations(data.evaluations);
            toast({
              title: "데이터 가져오기 완료",
              description: `${data.evaluations.length}개의 심사 결과를 가져왔습니다.`,
              duration: 3000,
            });
            resolve();
          } else {
            throw new Error('올바르지 않은 데이터 형식입니다.');
          }
        } catch (error) {
          toast({
            title: "데이터 가져오기 실패",
            description: "파일 형식이 올바르지 않습니다.",
            duration: 3000,
            variant: "destructive",
          });
          reject(error);
        }
      };

      reader.onerror = () => {
        toast({
          title: "파일 읽기 실패",
          description: "파일을 읽는 중 오류가 발생했습니다.",
          duration: 3000,
          variant: "destructive",
        });
        reject(new Error('파일 읽기 실패'));
      };

      reader.readAsText(file);
    });
  };

  // 전체 데이터 삭제
  const clearAllData = () => {
    setEvaluations([]);
    toast({
      title: "모든 데이터 삭제 완료",
      description: "모든 심사 결과가 삭제되었습니다.",
      duration: 3000,
    });
  };

  return {
    evaluations,
    categories,
    addEvaluation,
    updateEvaluation,
    deleteEvaluation,
    getEvaluationsByCategory,
    getEvaluationsByDate,
    searchEvaluations,
    getStatistics,
    exportData,
    importData,
    clearAllData,
  };
} 