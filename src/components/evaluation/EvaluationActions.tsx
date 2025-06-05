import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Save, AlertCircle, FileDown, FileText, RotateCcw, CheckCircle } from 'lucide-react';
import { EvaluationSaveProps } from './types';

const EvaluationActions: React.FC<EvaluationSaveProps & {
  showSuccessAlert: boolean;
  totalScore: number;
  onExportCsv: () => void;
  onExportMarkdown: () => void;
  isCsvGenerating: boolean;
  isMarkdownGenerating: boolean;
}> = ({
  formData,
  isValid,
  onSave,
  onReset,
  isSaving,
  showSuccessAlert,
  totalScore,
  onExportCsv,
  onExportMarkdown,
  isCsvGenerating,
  isMarkdownGenerating,
}) => {
  return (
    <div className="space-y-6">
      {/* 총점 표시 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>총점</span>
            <Badge variant="default" className="text-lg font-bold px-3 py-1">
              {totalScore}점
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
            <div className="text-center p-2 bg-muted/50 rounded-md">
              <div className="text-muted-foreground mb-1">점획</div>
              <div className="font-semibold">{formData.pointsScore || 0}점</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-md">
              <div className="text-muted-foreground mb-1">구조</div>
              <div className="font-semibold">{formData.structureScore || 0}점</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-md">
              <div className="text-muted-foreground mb-1">구성</div>
              <div className="font-semibold">{formData.compositionScore || 0}점</div>
            </div>
            <div className="text-center p-2 bg-muted/50 rounded-md">
              <div className="text-muted-foreground mb-1">조화</div>
              <div className="font-semibold">{formData.harmonyScore || 0}점</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 성공 알림 */}
      {showSuccessAlert && (
        <Alert className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          <AlertTitle className="text-green-800 dark:text-green-200">저장 완료</AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300">
            심사 결과가 성공적으로 저장되었습니다. 잠시 후 심사결과종합표로 이동합니다.
          </AlertDescription>
        </Alert>
      )}

      {/* 유효성 검사 알림 */}
      {!isValid && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>입력 확인 필요</AlertTitle>
          <AlertDescription>
            모든 필수 정보를 입력하고 점수를 선택해주세요.
            <ul className="mt-2 space-y-1 text-sm">
              {!formData.category && <li>• 심사 부문을 선택해주세요</li>}
              {!formData.artistName && <li>• 작가명을 입력해주세요</li>}
              {!formData.workTitle && <li>• 작품명을 입력해주세요</li>}
              {formData.pointsScore === null && <li>• 점획 점수를 선택해주세요</li>}
              {formData.structureScore === null && <li>• 구조 점수를 선택해주세요</li>}
              {formData.compositionScore === null && <li>• 구성 점수를 선택해주세요</li>}
              {formData.harmonyScore === null && <li>• 조화 점수를 선택해주세요</li>}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      {/* 액션 버튼들 */}
      <Card>
        <CardHeader>
          <CardTitle>심사 완료</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 저장 및 초기화 버튼 */}
            <div className="flex gap-3">
              <Button 
                onClick={onSave}
                disabled={!isValid || isSaving}
                className="flex-1"
                size="lg"
              >
                <Save className="mr-2 h-4 w-4" />
                {isSaving ? '저장 중...' : '심사 결과 저장'}
              </Button>
              
              <Button 
                variant="outline" 
                onClick={onReset}
                disabled={isSaving}
                size="lg"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                초기화
              </Button>
            </div>

            {/* 내보내기 버튼들 */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3 text-muted-foreground">
                심사표 내보내기
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Button 
                  variant="outline" 
                  onClick={onExportCsv}
                  disabled={isCsvGenerating}
                  size="sm"
                >
                  <FileDown className="mr-2 h-4 w-4" />
                  {isCsvGenerating ? 'CSV 생성 중...' : 'CSV 다운로드'}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={onExportMarkdown}
                  disabled={isMarkdownGenerating}
                  size="sm"
                >
                  <FileText className="mr-2 h-4 w-4" />
                  {isMarkdownGenerating ? 'Markdown 생성 중...' : 'Markdown 다운로드'}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EvaluationActions; 