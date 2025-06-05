import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileDown, Download, FileText, Loader2 } from 'lucide-react';
import { generatePdfFromElement } from '@/utils/pdfUtils';
import { ResultsExporterProps } from './types';

const ResultsExporter: React.FC<ResultsExporterProps> = ({
  resultsData,
  evaluationDate,
  category,
  judgeSignature,
  currentDate,
  formRef,
}) => {
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  // PDF 생성
  const handleGeneratePdf = async () => {
    if (!formRef.current) {
      alert('PDF 생성할 요소를 찾을 수 없습니다.');
      return;
    }

    if (resultsData.length === 0) {
      alert('내보낼 데이터가 없습니다.');
      return;
    }

    setIsGeneratingPdf(true);
    
    try {
      const filename = `서예심사결과_${category || '전체'}_${evaluationDate || currentDate}.pdf`;
      const title = `${category || '전체'} 서예 심사 결과`;
      
      await generatePdfFromElement(
        formRef.current,
        filename,
        title,
        evaluationDate || currentDate,
        judgeSignature
      );
    } catch (error) {
      console.error('PDF 생성 실패:', error);
      alert('PDF 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // CSV 내보내기
  const handleExportCsv = () => {
    if (resultsData.length === 0) {
      alert('내보낼 데이터가 없습니다.');
      return;
    }

    try {
      // CSV 헤더
      const headers = [
        '번호', '성명', '작품명', '점필법', '구성법', '조화법', 
        '평균점수', '순위', '등급', '비고'
      ];

      // CSV 데이터
      const csvData = resultsData.map(row => [
        row.displayId,
        row.artist,
        row.title,
        row.score1,
        row.score2,
        row.score3,
        row.average !== null ? row.average.toFixed(1) : '',
        row.rank !== null ? `${row.rank}등` : '',
        row.grade,
        row.remarks
      ]);

      // CSV 문자열 생성
      const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      // BOM 추가 (한글 깨짐 방지)
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // 다운로드
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `서예심사결과_${category || '전체'}_${evaluationDate || currentDate}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('CSV 내보내기 실패:', error);
      alert('CSV 내보내기 중 오류가 발생했습니다.');
    }
  };

  // JSON 내보내기 (백업용)
  const handleExportJson = () => {
    if (resultsData.length === 0) {
      alert('내보낼 데이터가 없습니다.');
      return;
    }

    try {
      const exportData = {
        metadata: {
          exportDate: currentDate,
          evaluationDate: evaluationDate || currentDate,
          category: category || '전체',
          judgeSignature,
          totalCount: resultsData.length,
        },
        results: resultsData,
      };

      const jsonString = JSON.stringify(exportData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8;' });
      
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `서예심사결과_${category || '전체'}_${evaluationDate || currentDate}.json`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('JSON 내보내기 실패:', error);
      alert('JSON 내보내기 중 오류가 발생했습니다.');
    }
  };

  const hasData = resultsData.length > 0;

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileDown className="h-5 w-5 text-primary" />
          내보내기
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 데이터 요약 */}
          {hasData && (
            <div className="p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">내보내기 정보</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">부문:</span>
                  <span className="ml-2 font-medium">{category || '전체'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">심사일:</span>
                  <span className="ml-2 font-medium">{evaluationDate || currentDate}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">참가자:</span>
                  <span className="ml-2 font-medium">{resultsData.length}명</span>
                </div>
                <div>
                  <span className="text-muted-foreground">심사위원장:</span>
                  <span className="ml-2 font-medium">{judgeSignature || '미입력'}</span>
                </div>
              </div>
            </div>
          )}

          {/* 내보내기 버튼들 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* PDF 내보내기 */}
            <Button
              onClick={handleGeneratePdf}
              disabled={!hasData || isGeneratingPdf}
              className="flex items-center gap-2 h-12"
            >
              {isGeneratingPdf ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileText className="h-4 w-4" />
              )}
              PDF 생성
            </Button>

            {/* CSV 내보내기 */}
            <Button
              onClick={handleExportCsv}
              disabled={!hasData}
              variant="outline"
              className="flex items-center gap-2 h-12"
            >
              <Download className="h-4 w-4" />
              CSV 내보내기
            </Button>

            {/* JSON 내보내기 */}
            <Button
              onClick={handleExportJson}
              disabled={!hasData}
              variant="outline"
              className="flex items-center gap-2 h-12"
            >
              <FileDown className="h-4 w-4" />
              JSON 백업
            </Button>
          </div>

          {/* 안내 메시지 */}
          {!hasData && (
            <div className="text-center py-4 text-muted-foreground">
              <FileDown className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>내보낼 데이터가 없습니다.</p>
              <p className="text-sm">먼저 심사 결과를 입력해주세요.</p>
            </div>
          )}

          {/* 사용법 안내 */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• <strong>PDF</strong>: 공식 문서용 형식으로 내보냅니다</p>
            <p>• <strong>CSV</strong>: 엑셀에서 편집 가능한 형식으로 내보냅니다</p>
            <p>• <strong>JSON</strong>: 데이터 백업용 형식으로 내보냅니다</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsExporter; 