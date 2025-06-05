import { supabase } from '@/lib/supabase';

// 심사 데이터 인터페이스
export interface EvaluationData {
  id: string;
  seriesNumber: string;
  category: string;
  artistName: string;
  workTitle: string;
  pointsScore: number | null;
  structureScore: number | null;
  compositionScore: number | null;
  harmonyScore: number | null;
  totalScore: number;
  judgeSignature: string;
  comments: string | null;
  createdAt: string;
}

/**
 * 모든 심사 데이터 가져오기
 */
export async function getAllEvaluations() {
  const { data, error } = await supabase
    .from('evaluations')
    .select('*')
    .order('createdAt', { ascending: false });

  if (error) {
    console.error('Error fetching evaluations:', error);
    throw error;
  }

  return data as EvaluationData[];
}

/**
 * ID로 특정 심사 데이터 가져오기
 */
export async function getEvaluationById(id: string) {
  const { data, error } = await supabase
    .from('evaluations')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching evaluation with id ${id}:`, error);
    throw error;
  }

  return data as EvaluationData;
}

/**
 * 새 심사 데이터 생성하기
 */
export async function createEvaluation(evaluation: Omit<EvaluationData, 'id' | 'createdAt'>) {
  const { data, error } = await supabase
    .from('evaluations')
    .insert([{ ...evaluation, createdAt: new Date().toISOString() }])
    .select();

  if (error) {
    console.error('Error creating evaluation:', error);
    throw error;
  }

  return data?.[0] as EvaluationData;
}

/**
 * 심사 데이터 업데이트하기
 */
export async function updateEvaluation(id: string, updates: Partial<EvaluationData>) {
  const { data, error } = await supabase
    .from('evaluations')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error(`Error updating evaluation with id ${id}:`, error);
    throw error;
  }

  return data?.[0] as EvaluationData;
}

/**
 * 심사 데이터 삭제하기
 */
export async function deleteEvaluation(id: string) {
  const { error } = await supabase
    .from('evaluations')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting evaluation with id ${id}:`, error);
    throw error;
  }

  return true;
} 