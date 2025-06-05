import { createClient } from '@supabase/supabase-js';

// 환경 변수에서 Supabase URL과 API 키를 가져옵니다
// 실제 값은 .env 파일이나 Vercel 환경 변수에 설정해야 합니다
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Supabase 클라이언트 생성
export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Supabase 연결을 테스트하는 함수
 * @returns 연결 성공 여부와 메시지를 포함한 객체
 */
export async function testSupabaseConnection() {
  try {
    // 간단한 쿼리를 실행하여 연결 테스트
    const { data, error } = await supabase.from('evaluations').select('id').limit(1);
    
    if (error) {
      console.error('Supabase 연결 테스트 에러:', error);
      return {
        success: false,
        error: error.message,
        details: error
      };
    }
    
    return {
      success: true,
      message: 'Supabase에 성공적으로 연결되었습니다.',
      data
    };
  } catch (err) {
    console.error('Supabase 연결 테스트 중 예외 발생:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : '알 수 없는 오류',
      details: err
    };
  }
} 