// 심사 일정 관련 타입 정의
export interface ScheduleFormData {
  judgeChair: string;
  evalDate: string;
  evalCategory: string;
  judges: string[];
  planContent: string;
  judgeSignature: string;
  currentDate: string;
}

// 심사 일정 정보 Props
export interface ScheduleInfoProps {
  formData: ScheduleFormData;
  onFormDataChange: (field: keyof ScheduleFormData, value: string | string[]) => void;
}

// 심사위원 관리 Props
export interface JudgeManagementProps {
  judges: string[];
  judgeChair: string;
  judgeSignature: string;
  onJudgeChange: (index: number, value: string) => void;
  onJudgeChairChange: (value: string) => void;
  onJudgeSignatureChange: (value: string) => void;
  currentDate: string;
}

// 심사 계획 Props
export interface EvaluationPlanProps {
  planContent: string;
  onPlanContentChange: (value: string) => void;
}

// 스케줄 내보내기 Props
export interface ScheduleExportProps {
  formData: ScheduleFormData;
  formRef: React.RefObject<HTMLDivElement>;
  onExportPdf: () => void;
  onExportCsv: () => void;
  onExportMarkdown: () => void;
  isPdfGenerating: boolean;
  isCsvGenerating: boolean;
  isMarkdownGenerating: boolean;
}

// 심사 일정 유효성 검사
export interface ScheduleValidation {
  isValid: boolean;
  errors: string[];
} 