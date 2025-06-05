// 심사 결과 관련 타입 정의
export interface ResultRow {
  rowId: number;
  displayId: number;
  artist: string;
  title: string;
  score1: string;
  score2: string;
  score3: string;
  average: number | null;
  rank: number | null;
  grade: string;
  remarks: string;
}

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

// Results 컴포넌트 Props 타입들
export interface ResultsHeaderProps {
  evaluationDate: string;
  setEvaluationDate: (date: string) => void;
  category: string;
  setCategory: (category: string) => void;
  judgeSignature: string;
  setJudgeSignature: (signature: string) => void;
  currentDate: string;
  availableCategories: string[];
  onCategoryChange: (category: string) => void;
}

export interface ResultsTableProps {
  resultsData: ResultRow[];
  onInputChange: (rowId: number, field: keyof ResultRow, value: string) => void;
  onAddRow: () => void;
  onDeleteRow: (rowId: number) => void;
  getGradeClass: (grade: string) => string;
}

export interface ResultsCalculatorProps {
  resultsData: ResultRow[];
  onUpdateCalculations: (data?: ResultRow[]) => void;
}

export interface ResultsExporterProps {
  resultsData: ResultRow[];
  evaluationDate: string;
  category: string;
  judgeSignature: string;
  currentDate: string;
  formRef: React.RefObject<HTMLDivElement>;
}

export interface ResultsDataLoaderProps {
  category: string;
  onDataLoaded: (data: ResultRow[], date: string) => void;
  onCategoriesLoaded: (categories: string[]) => void;
} 