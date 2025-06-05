import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag, Clock } from 'lucide-react';
import { ScheduleInfoProps } from './types';

const ScheduleInfo: React.FC<ScheduleInfoProps> = ({
  formData,
  onFormDataChange,
}) => {
  const handleDateChange = (value: string) => {
    onFormDataChange('evalDate', value);
  };

  const handleCategoryChange = (value: string) => {
    onFormDataChange('evalCategory', value);
  };

  const handleJudgeChairChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFormDataChange('judgeChair', e.target.value);
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          심사 일정 정보
          <Badge variant="outline" className="ml-auto">
            {formData.currentDate}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 심사 일시 */}
          <div className="space-y-2">
            <Label htmlFor="eval-date" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              심사 일시
            </Label>
            <Input
              id="eval-date"
              type="date"
              value={formData.evalDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="form-input"
            />
          </div>

          {/* 심사 부문 */}
          <div className="space-y-2">
            <Label htmlFor="eval-category" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              심사 부문
            </Label>
            <Select value={formData.evalCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger id="eval-category" className="form-select">
                <SelectValue placeholder="부문 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="전체">전체 부문</SelectItem>
                <SelectItem value="초등부">초등부</SelectItem>
                <SelectItem value="중등부">중등부</SelectItem>
                <SelectItem value="고등부">고등부</SelectItem>
                <SelectItem value="대학부">대학부</SelectItem>
                <SelectItem value="일반부">일반부</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 심사위원장 */}
          <div className="space-y-2 md:col-span-2 lg:col-span-1">
            <Label htmlFor="judge-chair" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              심사위원장
            </Label>
            <Input
              id="judge-chair"
              value={formData.judgeChair}
              onChange={handleJudgeChairChange}
              placeholder="심사위원장명을 입력하세요"
              className="form-input"
            />
          </div>
        </div>

        {/* 기본 정보 안내 */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            <span className="text-destructive">*</span> 심사 일시와 부문은 필수 입력사항입니다.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleInfo; 