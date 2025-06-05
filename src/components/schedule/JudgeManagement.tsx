import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, User, Crown } from 'lucide-react';
import { JudgeManagementProps } from './types';

const JudgeManagement: React.FC<JudgeManagementProps> = ({
  judges,
  judgeChair,
  judgeSignature,
  onJudgeChange,
  onJudgeChairChange,
  onJudgeSignatureChange,
  currentDate,
}) => {
  return (
    <div className="space-y-6">
      {/* 심사위원 구성 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            심사위원 구성
            <Badge variant="outline" className="ml-auto">
              총 {judges.filter(judge => judge.trim()).length + (judgeChair.trim() ? 1 : 0)}명
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 심사위원장 */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <Label htmlFor="judge-chair-detail" className="flex items-center gap-2 mb-2">
                <Crown className="h-4 w-4 text-primary" />
                심사위원장
              </Label>
              <Input
                id="judge-chair-detail"
                value={judgeChair}
                onChange={(e) => onJudgeChairChange(e.target.value)}
                placeholder="심사위원장명을 입력하세요"
                className="bg-background"
              />
            </div>

            {/* 심사위원 목록 */}
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <User className="h-4 w-4" />
                심사위원
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {judges.map((judge, index) => (
                  <div key={index} className="space-y-2">
                    <Label htmlFor={`judge-${index}`} className="text-sm text-muted-foreground">
                      심사위원 {index + 1}
                    </Label>
                    <Input
                      id={`judge-${index}`}
                      value={judge}
                      onChange={(e) => onJudgeChange(index, e.target.value)}
                      placeholder={`심사위원 ${index + 1}명을 입력하세요`}
                      className="form-input"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 서명란 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            심사위원장 서명
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="judge-signature" className="sr-only">
                  심사위원장 서명
                </Label>
                <Input
                  id="judge-signature"
                  value={judgeSignature}
                  onChange={(e) => onJudgeSignatureChange(e.target.value)}
                  placeholder="심사위원장 서명을 입력하세요"
                  className="text-center font-medium"
                />
              </div>
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                (서명)
              </div>
            </div>
            
            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                작성일: {currentDate}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JudgeManagement; 