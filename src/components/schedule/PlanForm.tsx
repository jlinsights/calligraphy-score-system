import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

const PlanForm: React.FC<PlanFormProps> = ({ 
  judgeChair, 
  setJudgeChair, 
  evalDate, 
  setEvalDate, 
  evalCategory, 
  setEvalCategory, 
  judges, 
  handleJudgeChange,
  planContent,
  setPlanContent
}) => {
  return (
    <>
      <div className="form-header mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="judge-chair" className="block text-sm font-medium text-foreground mb-1">심사위원장</Label>
            <Input 
              id="judge-chair"
              value={judgeChair}
              onChange={(e) => setJudgeChair(e.target.value)}
              placeholder="위원장 이름"
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="eval-date" className="block text-sm font-medium text-foreground mb-1">심사 일시</Label>
            <Input 
              id="eval-date"
              type="date"
              value={evalDate}
              onChange={(e) => setEvalDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="eval-category" className="block text-sm font-medium text-foreground mb-1">심사 부문</Label>
            <Select value={evalCategory} onValueChange={setEvalCategory}>
              <SelectTrigger id="eval-category">
                <SelectValue placeholder="부문 선택..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="한글서예">한글서예</SelectItem>
                <SelectItem value="한문서예">한문서예</SelectItem>
                <SelectItem value="현대서예">현대서예</SelectItem>
                <SelectItem value="캘리그라피">캘리그라피</SelectItem>
                <SelectItem value="전각・서각">전각・서각</SelectItem>
                <SelectItem value="문인화・동양화・민화">문인화・동양화・민화</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="judge-row-container border-b border-border pb-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {judges.map((judge, index) => (
            <div key={index}>
              <Label htmlFor={`judge-${index+1}`} className="block text-sm font-medium text-foreground mb-1">
                심사위원{index+1}
              </Label>
              <Input 
                id={`judge-${index+1}`}
                value={judge}
                onChange={(e) => handleJudgeChange(index, e.target.value)}
                placeholder="위원 이름"
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="form-section mb-6 border-b border-border pb-4">
        <h3 className="text-xl font-medium mb-2 text-foreground border-b border-primary pb-2 inline-block">심사 계획 내용</h3>
        <div className="plan-content">
          <Textarea 
            id="plan-content-textarea"
            value={planContent}
            onChange={(e) => setPlanContent(e.target.value)}
            placeholder="심사 계획 내용을 작성해 주세요."
            rows={10}
            className="w-full border border-input p-4 bg-card min-h-[150px]"
          />
        </div>
      </div>
    </>
  );
};

export default PlanForm;
