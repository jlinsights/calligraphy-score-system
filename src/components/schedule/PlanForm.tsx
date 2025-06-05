import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from 'lucide-react';
import { EvaluationPlanProps } from './types';

interface PlanFormProps {
  judgeChair: string;
  setJudgeChair: (value: string) => void;
  evalDate: string;
  setEvalDate: (value: string) => void;
  evalCategory: string;
  setEvalCategory: (value: string) => void;
  judges: string[];
  handleJudgeChange: (index: number, value: string) => void;
  planContent: string;
  setPlanContent: (value: string) => void;
}

const PlanForm: React.FC<EvaluationPlanProps> = ({ 
  planContent,
  onPlanContentChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          심사 계획 내용
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea 
            id="plan-content-textarea"
            value={planContent}
            onChange={(e) => onPlanContentChange(e.target.value)}
            placeholder="심사 계획 및 진행 방식, 특별 고려사항 등을 자세히 작성해 주세요."
            rows={10}
            className="min-h-[200px] resize-none"
          />
          
          {/* 안내 텍스트 */}
          <div className="text-sm text-muted-foreground space-y-1">
            <p>심사 계획에 포함할 내용:</p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>심사 진행 일정 및 순서</li>
              <li>평가 방식 및 기준</li>
              <li>작품 분류 및 배정 방법</li>
              <li>특별 고려사항 또는 주의사항</li>
              <li>심사 후 처리 절차</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlanForm;
