import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, FileText, FileOutput } from 'lucide-react';
import { ScheduleExportProps } from './types';

const ScheduleExport: React.FC<ScheduleExportProps> = ({
  formData,
  formRef,
  onExportPdf,
  onExportCsv,
  onExportMarkdown,
  isPdfGenerating,
  isCsvGenerating,
  isMarkdownGenerating,
}) => {
  const isFormValid = () => {
    return formData.evalDate && formData.evalCategory;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileOutput className="h-5 w-5 text-primary" />
          일정표 내보내기
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 유효성 검사 안내 */}
          {!isFormValid() && (
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
              <p className="text-sm text-destructive">
                심사 일시와 부문을 입력한 후 내보내기가 가능합니다.
              </p>
            </div>
          )}

          {/* 내보내기 버튼들 */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button 
              onClick={onExportPdf}
              disabled={!isFormValid() || isPdfGenerating}
              variant="default"
              size="sm"
              className="w-full"
            >
              <FileOutput className="mr-2 h-4 w-4" />
              {isPdfGenerating ? 'PDF 생성 중...' : 'PDF 내보내기'}
            </Button>
            
            <Button 
              onClick={onExportCsv}
              disabled={!isFormValid() || isCsvGenerating}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <FileDown className="mr-2 h-4 w-4" />
              {isCsvGenerating ? 'CSV 생성 중...' : 'CSV 내보내기'}
            </Button>
            
            <Button 
              onClick={onExportMarkdown}
              disabled={!isFormValid() || isMarkdownGenerating}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <FileText className="mr-2 h-4 w-4" />
              {isMarkdownGenerating ? 'MD 생성 중...' : 'Markdown 내보내기'}
            </Button>
          </div>

          {/* 내보내기 정보 */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• PDF: 인쇄용 공식 문서로 내보내기</p>
            <p>• CSV: 데이터 관리 및 분석을 위한 표 형태</p>
            <p>• Markdown: 문서 편집 및 공유용 텍스트 형태</p>
          </div>

          {/* 파일명 미리보기 */}
          {isFormValid() && (
            <div className="pt-3 border-t border-border">
              <p className="text-xs text-muted-foreground">
                파일명: <span className="font-mono">
                  심사일정표_{formData.evalCategory || '전체'}_{formData.evalDate}
                </span>
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ScheduleExport; 