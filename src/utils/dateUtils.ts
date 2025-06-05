/**
 * 날짜 관련 유틸리티 함수들
 */

// 현재 날짜를 YYYY-MM-DD 형식으로 반환
export function getCurrentDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// 현재 날짜를 한국어 형식으로 반환 (YYYY년 MM월 DD일)
export function getCurrentDateKorean(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일`;
}

// YYYY-MM-DD 형식을 한국어 형식으로 변환
export function formatDateToKorean(dateString: string): string {
  if (!dateString) return '';
  
  const [year, month, day] = dateString.split('-');
  return `${year}년 ${month}월 ${day}일`;
}

// 한국어 날짜를 YYYY-MM-DD 형식으로 변환
export function formatKoreanToDate(koreanDate: string): string {
  if (!koreanDate) return '';
  
  const match = koreanDate.match(/(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일/);
  if (!match) return '';
  
  const [, year, month, day] = match;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// 날짜 유효성 검사
export function isValidDate(dateString: string): boolean {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
}

// 두 날짜 사이의 일수 계산
export function getDaysBetween(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// 날짜 비교 (startDate가 endDate보다 이전인지)
export function isDateBefore(startDate: string, endDate: string): boolean {
  return new Date(startDate) < new Date(endDate);
}

// 날짜 비교 (startDate가 endDate와 같은지)
export function isSameDate(date1: string, date2: string): boolean {
  return new Date(date1).toDateString() === new Date(date2).toDateString();
}

// 현재 날짜가 주어진 날짜 범위 내에 있는지 확인
export function isDateInRange(targetDate: string, startDate: string, endDate: string): boolean {
  const target = new Date(targetDate);
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  return target >= start && target <= end;
}

// 날짜에 일수 추가
export function addDays(dateString: string, days: number): string {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split('T')[0];
}

// 날짜에서 일수 빼기
export function subtractDays(dateString: string, days: number): string {
  return addDays(dateString, -days);
}

// 월의 첫 번째 날 구하기
export function getFirstDayOfMonth(dateString: string): string {
  const date = new Date(dateString);
  return new Date(date.getFullYear(), date.getMonth(), 1).toISOString().split('T')[0];
}

// 월의 마지막 날 구하기
export function getLastDayOfMonth(dateString: string): string {
  const date = new Date(dateString);
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString().split('T')[0];
}

// 요일 구하기 (한국어)
export function getDayOfWeekKorean(dateString: string): string {
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const date = new Date(dateString);
  return days[date.getDay()];
}

// 상대적 날짜 표시 (예: "3일 전", "1주일 후")
export function getRelativeDate(dateString: string): string {
  const now = new Date();
  const target = new Date(dateString);
  const diffTime = target.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '내일';
  if (diffDays === -1) return '어제';
  if (diffDays > 0) {
    if (diffDays <= 7) return `${diffDays}일 후`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)}주일 후`;
    return `${Math.ceil(diffDays / 30)}개월 후`;
  } else {
    const absDays = Math.abs(diffDays);
    if (absDays <= 7) return `${absDays}일 전`;
    if (absDays <= 30) return `${Math.ceil(absDays / 7)}주일 전`;
    return `${Math.ceil(absDays / 30)}개월 전`;
  }
}

// 날짜 범위 생성 (시작일부터 종료일까지의 모든 날짜)
export function getDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
    dates.push(date.toISOString().split('T')[0]);
  }
  
  return dates;
} 