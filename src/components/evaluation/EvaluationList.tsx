import React, { useEffect, useState } from 'react';
import { getAllEvaluations, EvaluationData } from '@/services/evaluationService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function EvaluationList() {
  const [evaluations, setEvaluations] = useState<EvaluationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvaluations() {
      try {
        setLoading(true);
        const data = await getAllEvaluations();
        setEvaluations(data);
      } catch (err) {
        console.error('Error fetching evaluations:', err);
        setError('심사 데이터를 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    }

    fetchEvaluations();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-48">데이터를 불러오는 중...</div>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
        <p className="font-medium">오류</p>
        <p>{error}</p>
      </div>
    );
  }

  if (evaluations.length === 0) {
    return (
      <div className="text-center p-8 border border-border rounded-md">
        <p className="text-muted-foreground mb-4">아직 심사 데이터가 없습니다.</p>
        <Button asChild>
          <Link to="/evaluation">새 심사 시작하기</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">심사 목록</h2>
        <Button asChild>
          <Link to="/evaluation">새 심사</Link>
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">작품번호</TableHead>
              <TableHead>작가명</TableHead>
              <TableHead>작품명</TableHead>
              <TableHead className="text-center">총점</TableHead>
              <TableHead className="text-center">심사일</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {evaluations.map((evaluation) => (
              <TableRow key={evaluation.id}>
                <TableCell className="font-medium">{evaluation.seriesNumber}</TableCell>
                <TableCell>{evaluation.artistName}</TableCell>
                <TableCell>{evaluation.workTitle}</TableCell>
                <TableCell className="text-center">{evaluation.totalScore}</TableCell>
                <TableCell className="text-center">
                  {new Date(evaluation.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" asChild>
                      <Link to={`/results/${evaluation.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="icon" asChild>
                      <Link to={`/evaluation/edit/${evaluation.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="destructive" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 