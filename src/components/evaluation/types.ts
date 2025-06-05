// 심사 관련 타입 정의
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

// 심사 폼 데이터 타입
export interface EvaluationFormData {
  seriesNumber: string;
  category: string;
  artistName: string;
  workTitle: string;
  currentDate: string;
  judgeSignature: string;
  pointsScore: number | null;
  structureScore: number | null;
  compositionScore: number | null;
  harmonyScore: number | null;
  totalScore: number;
}

// 점수 입력 Props
export interface ScoreInputProps {
  category: 'points' | 'structure' | 'composition' | 'harmony';
  currentScore: number | null;
  onScoreChange: (category: string, score: number) => void;
  minScore: number;
  maxScore: number;
  title: string;
  description?: string;
}

// 심사 정보 헤더 Props
export interface EvaluationInfoProps {
  formData: EvaluationFormData;
  onFormDataChange: (field: keyof EvaluationFormData, value: string) => void;
}

// 심사 결과 저장 Props
export interface EvaluationSaveProps {
  formData: EvaluationFormData;
  isValid: boolean;
  onSave: () => void;
  onReset: () => void;
  isSaving: boolean;
}

// 내보내기 Props
export interface EvaluationExportProps {
  formData: EvaluationFormData;
  formRef: React.RefObject<HTMLElement>;
} 