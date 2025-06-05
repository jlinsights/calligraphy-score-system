/**
 * 점수 계산 관련 유틸리티 함수들
 */

// 점수 데이터 타입
export interface ScoreData {
  score1: string | number;
  score2: string | number;
  score3: string | number;
}

// 평균 점수 계산
export function calculateAverage(scores: ScoreData): number | null {
  const s1 = typeof scores.score1 === 'string' ? parseFloat(scores.score1) : scores.score1;
  const s2 = typeof scores.score2 === 'string' ? parseFloat(scores.score2) : scores.score2;
  const s3 = typeof scores.score3 === 'string' ? parseFloat(scores.score3) : scores.score3;
  
  // 모든 점수가 유효한 숫자인지 확인
  if (isNaN(s1) || isNaN(s2) || isNaN(s3)) {
    return null;
  }
  
  // 점수 범위 검증 (0-100)
  if (s1 < 0 || s1 > 100 || s2 < 0 || s2 > 100 || s3 < 0 || s3 > 100) {
    return null;
  }
  
  return Math.round((s1 + s2 + s3) / 3 * 10) / 10; // 소수점 첫째자리까지
}

// 등급 계산 (한국 서예 심사 기준)
export function calculateGrade(average: number | null): string {
  if (average === null || isNaN(average)) return '';
  
  if (average >= 95) return '수'; // 최우수
  if (average >= 85) return '우'; // 우수
  if (average >= 75) return '미'; // 미
  if (average >= 65) return '양'; // 양
  return '가'; // 가
}

// 등급별 색상 클래스 반환
export function getGradeColorClass(grade: string): string {
  switch (grade) {
    case '수': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
    case '우': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
    case '미': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
    case '양': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
    case '가': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
  }
}

// 등급별 설명 반환
export function getGradeDescription(grade: string): string {
  switch (grade) {
    case '수': return '95점 이상 - 최우수작';
    case '우': return '85점 이상 - 우수작';
    case '미': return '75점 이상 - 미작';
    case '양': return '65점 이상 - 양작';
    case '가': return '65점 미만 - 가작';
    default: return '등급 미정';
  }
}

// 순위 계산 (동점자 처리 포함)
export function calculateRanks<T extends { average: number | null; id: string | number }>(
  data: T[]
): T[] {
  // 평균 점수가 있는 데이터만 필터링
  const validData = data.filter(item => item.average !== null);
  
  // 평균 점수로 정렬 (내림차순)
  const sorted = [...validData].sort((a, b) => (b.average || 0) - (a.average || 0));
  
  // 순위 부여 (동점자 처리)
  let currentRank = 1;
  const rankedData = sorted.map((item, index) => {
    if (index > 0 && item.average !== sorted[index - 1].average) {
      currentRank = index + 1;
    }
    return { ...item, rank: currentRank };
  });
  
  // 원본 데이터에 순위 정보 병합
  return data.map(item => {
    const rankedItem = rankedData.find(r => r.id === item.id);
    return rankedItem ? { ...item, rank: rankedItem.rank } : { ...item, rank: null };
  });
}

// 점수 유효성 검사
export function isValidScore(score: string | number): boolean {
  const numScore = typeof score === 'string' ? parseFloat(score) : score;
  return !isNaN(numScore) && numScore >= 0 && numScore <= 100;
}

// 점수 정규화 (문자열을 숫자로 변환하고 범위 검증)
export function normalizeScore(score: string | number): number | null {
  const numScore = typeof score === 'string' ? parseFloat(score) : score;
  
  if (isNaN(numScore)) return null;
  if (numScore < 0) return 0;
  if (numScore > 100) return 100;
  
  return Math.round(numScore * 10) / 10; // 소수점 첫째자리까지
}

// 통계 계산
export function calculateStatistics(scores: (number | null)[]): {
  total: number;
  average: number;
  highest: number;
  lowest: number;
  median: number;
  standardDeviation: number;
} {
  const validScores = scores.filter(score => score !== null) as number[];
  
  if (validScores.length === 0) {
    return {
      total: 0,
      average: 0,
      highest: 0,
      lowest: 0,
      median: 0,
      standardDeviation: 0,
    };
  }
  
  const total = validScores.length;
  const sum = validScores.reduce((acc, score) => acc + score, 0);
  const average = sum / total;
  const highest = Math.max(...validScores);
  const lowest = Math.min(...validScores);
  
  // 중앙값 계산
  const sortedScores = [...validScores].sort((a, b) => a - b);
  const median = total % 2 === 0
    ? (sortedScores[total / 2 - 1] + sortedScores[total / 2]) / 2
    : sortedScores[Math.floor(total / 2)];
  
  // 표준편차 계산
  const variance = validScores.reduce((acc, score) => acc + Math.pow(score - average, 2), 0) / total;
  const standardDeviation = Math.sqrt(variance);
  
  return {
    total,
    average: Math.round(average * 10) / 10,
    highest,
    lowest,
    median: Math.round(median * 10) / 10,
    standardDeviation: Math.round(standardDeviation * 10) / 10,
  };
}

// 등급별 분포 계산
export function calculateGradeDistribution(grades: string[]): Record<string, number> {
  const distribution = { '수': 0, '우': 0, '미': 0, '양': 0, '가': 0 };
  
  grades.forEach(grade => {
    if (grade in distribution) {
      distribution[grade as keyof typeof distribution]++;
    }
  });
  
  return distribution;
}

// 점수 범위별 분포 계산
export function calculateScoreRangeDistribution(scores: (number | null)[]): Record<string, number> {
  const validScores = scores.filter(score => score !== null) as number[];
  const distribution = {
    '90-100': 0,
    '80-89': 0,
    '70-79': 0,
    '60-69': 0,
    '0-59': 0,
  };
  
  validScores.forEach(score => {
    if (score >= 90) distribution['90-100']++;
    else if (score >= 80) distribution['80-89']++;
    else if (score >= 70) distribution['70-79']++;
    else if (score >= 60) distribution['60-69']++;
    else distribution['0-59']++;
  });
  
  return distribution;
}

// 점수 포맷팅 (소수점 처리)
export function formatScore(score: number | null, decimals: number = 1): string {
  if (score === null) return '-';
  return score.toFixed(decimals);
}

// 백분위 계산
export function calculatePercentile(score: number, allScores: number[]): number {
  const validScores = allScores.filter(s => !isNaN(s));
  if (validScores.length === 0) return 0;
  
  const lowerCount = validScores.filter(s => s < score).length;
  return Math.round((lowerCount / validScores.length) * 100);
} 