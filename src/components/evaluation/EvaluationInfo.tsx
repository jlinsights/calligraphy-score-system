import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, User, Tag, Calendar } from 'lucide-react';
import { EvaluationInfoProps } from './types';

const EvaluationInfo: React.FC<EvaluationInfoProps> = ({
  formData,
  onFormDataChange,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          심사 정보
          <Badge variant="outline" className="ml-auto">
            {formData.seriesNumber}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 심사 부문 */}
          <div className="space-y-2">
            <Label htmlFor="category" className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              심사 부문
            </Label>
            <Select 
              value={formData.category} 
              onValueChange={(value) => onFormDataChange('category', value)}
            >
              <SelectTrigger id="category" className="form-select">
                <SelectValue placeholder="부문 선택" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="초등부">초등부</SelectItem>
                <SelectItem value="중등부">중등부</SelectItem>
                <SelectItem value="고등부">고등부</SelectItem>
                <SelectItem value="대학부">대학부</SelectItem>
                <SelectItem value="일반부">일반부</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 작가명 */}
          <div className="space-y-2">
            <Label htmlFor="artist-name" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              작가명
            </Label>
            <Input
              id="artist-name"
              value={formData.artistName}
              onChange={(e) => onFormDataChange('artistName', e.target.value)}
              placeholder="작가명을 입력하세요"
              className="form-input"
            />
          </div>

          {/* 작품명 */}
          <div className="space-y-2">
            <Label htmlFor="work-title" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              작품명
            </Label>
            <Input
              id="work-title"
              value={formData.workTitle}
              onChange={(e) => onFormDataChange('workTitle', e.target.value)}
              placeholder="작품명을 입력하세요"
              className="form-input"
            />
          </div>

          {/* 심사위원 */}
          <div className="space-y-2 md:col-span-2 lg:col-span-1">
            <Label htmlFor="judge-signature" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              심사위원
            </Label>
            <Input
              id="judge-signature"
              value={formData.judgeSignature}
              onChange={(e) => onFormDataChange('judgeSignature', e.target.value)}
              placeholder="심사위원명을 입력하세요"
              className="form-input"
            />
          </div>

          {/* 심사일 */}
          <div className="space-y-2 md:col-span-2 lg:col-span-2">
            <Label className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              심사일
            </Label>
            <div className="p-3 bg-muted/50 rounded-md">
              <span className="font-medium text-foreground">{formData.currentDate}</span>
            </div>
          </div>
        </div>

        {/* 필수 입력 안내 */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            <span className="text-destructive">*</span> 심사 부문, 작가명, 작품명은 필수 입력사항입니다.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default EvaluationInfo; 