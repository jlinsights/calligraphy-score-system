import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Tag } from 'lucide-react';
import { ResultsHeaderProps } from './types';

const ResultsHeader: React.FC<ResultsHeaderProps> = ({
  evaluationDate,
  setEvaluationDate,
  category,
  setCategory,
  judgeSignature,
  setJudgeSignature,
  currentDate,
  availableCategories,
  onCategoryChange,
}) => {
  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onCategoryChange(value);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Tag className="h-5 w-5 text-primary" />
          심사 정보
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 심사 일시 */}
          <div className="space-y-2">
            <Label htmlFor="evaluation-date" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              심사 일시
            </Label>
            <Input
              id="evaluation-date"
              type="date"
              value={evaluationDate}
              onChange={(e) => setEvaluationDate(e.target.value)}
              className="form-input"
            />
          </div>

          {/* 심사 부문 */}
          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              심사 부문
            </Label>
            <Select value={category} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category" className="form-select">
                <SelectValue placeholder="부문 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">전체</SelectItem>
                <SelectItem value="초등부">초등부</SelectItem>
                <SelectItem value="중등부">중등부</SelectItem>
                <SelectItem value="고등부">고등부</SelectItem>
                <SelectItem value="대학부">대학부</SelectItem>
                <SelectItem value="일반부">일반부</SelectItem>
                {availableCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* 심사위원장 */}
          <div className="space-y-2">
            <Label htmlFor="judge-signature" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              심사위원장
            </Label>
            <Input
              id="judge-signature"
              value={judgeSignature}
              onChange={(e) => setJudgeSignature(e.target.value)}
              placeholder="심사위원장명을 입력하세요"
              className="form-input"
            />
          </div>
        </div>

        {/* 작성일 표시 */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            작성일: <span className="font-medium text-foreground">{currentDate}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsHeader; 