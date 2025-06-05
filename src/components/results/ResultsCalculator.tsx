import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator, RotateCcw } from 'lucide-react';
import { ResultsCalculatorProps, ResultRow } from './types';

const ResultsCalculator: React.FC<ResultsCalculatorProps> = ({
  resultsData,
  onUpdateCalculations,
}) => {
  // 평균 계산 함수
  const calculateAverage = (score1: string, score2: string, score3: string): number | null => {
    const s1 = parseFloat(score1);
    const s2 = parseFloat(score2);
    const s3 = parseFloat(score3);
    
    if (isNaN(s1) || isNaN(s2) || isNaN(s3)) {
      return null;
    }
    
    return (s1 + s2 + s3) / 3;
  };

  // 등급 계산 함수
  const calculateGrade = (average: number | null): string => {
    if (average === null) return '';
    
    if (average >= 95) return '수';
    if (average >= 85) return '우';
    if (average >= 75) return '미';
    if (average >= 65) return '양';
    return '가';
  };

  // 순위 계산 함수
  const calculateRanks = (data: ResultRow[]): ResultRow[] => {
    // 평균 점수가 있는 데이터만 필터링
    const validData = data.filter(row => row.average !== null);
    
    // 평균 점수로 정렬 (내림차순)
    const sorted = validData.sort((a, b) => (b.average || 0) - (a.average || 0));
    
    // 순위 부여 (동점자 처리)
    let currentRank = 1;
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i].average !== sorted[i - 1].average) {
        currentRank = i + 1;
      }
      sorted[i].rank = currentRank;
    }
    
    // 원본 데이터에 순위 정보 업데이트
    return data.map(row => {
      const rankedRow = sorted.find(r => r.rowId === row.rowId);
      return rankedRow || { ...row, rank: null };
    });
  };

  // 모든 계산 수행
  const performCalculations = (data?: ResultRow[]) => {
    const targetData = data || resultsData;
    
    // 1. 평균 계산 및 등급 부여
    const withAverages = targetData.map(row => ({
      ...row,
      average: calculateAverage(row.score1, row.score2, row.score3),
    })).map(row => ({
      ...row,
      grade: calculateGrade(row.average),
    }));
    
    // 2. 순위 계산
    const withRanks = calculateRanks(withAverages);
    
    // 3. 상태 업데이트
    onUpdateCalculations(withRanks);
  };

  // 계산 초기화
  const resetCalculations = () => {
    const resetData = resultsData.map(row => ({
      ...row,
      average: null,
      rank: null,
      grade: '',
    }));
    
    onUpdateCalculations(resetData);
  };

  // 통계 계산
  const getStatistics = () => {
    const validScores = resultsData
      .map(row => row.average)
      .filter(avg => avg !== null) as number[];
    
    if (validScores.length === 0) {
      return {
        total: 0,
        highest: 0,
        lowest: 0,
        average: 0,
      };
    }
    
    return {
      total: validScores.length,
      highest: Math.max(...validScores),
      lowest: Math.min(...validScores),
      average: validScores.reduce((sum, score) => sum + score, 0) / validScores.length,
    };
  };

  const stats = getStatistics();

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          점수 계산 및 통계
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* 계산 버튼들 */}
          <div className="flex gap-2">
            <Button 
              onClick={() => performCalculations()}
              className="flex items-center gap-2"
            >
              <Calculator className="h-4 w-4" />
              점수 계산
            </Button>
            <Button 
              onClick={resetCalculations}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              초기화
            </Button>
          </div>

          {/* 통계 정보 */}
          {stats.total > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{stats.total}</div>
                <div className="text-sm text-muted-foreground">총 참가자</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.highest.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">최고 점수</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.lowest.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">최저 점수</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.average.toFixed(1)}</div>
                <div className="text-sm text-muted-foreground">평균 점수</div>
              </div>
            </div>
          )}

          {/* 등급별 분포 */}
          {stats.total > 0 && (
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="font-medium mb-3">등급별 분포</h4>
              <div className="grid grid-cols-5 gap-2 text-center text-sm">
                {['수', '우', '미', '양', '가'].map(grade => {
                  const count = resultsData.filter(row => row.grade === grade).length;
                  const percentage = stats.total > 0 ? (count / stats.total * 100).toFixed(1) : '0';
                  
                  return (
                    <div key={grade} className="p-2 bg-background rounded border">
                      <div className="font-medium">{grade}</div>
                      <div className="text-lg font-bold text-primary">{count}</div>
                      <div className="text-xs text-muted-foreground">{percentage}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsCalculator; 