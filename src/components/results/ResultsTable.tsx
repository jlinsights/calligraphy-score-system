import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Trophy, ClipboardList } from 'lucide-react';
import { ResultsTableProps } from './types';

const ResultsTable: React.FC<ResultsTableProps> = ({
  resultsData,
  onInputChange,
  onAddRow,
  onDeleteRow,
  getGradeClass,
}) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          심사 결과표
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* 행 추가 버튼 */}
        <div className="flex justify-end mb-4">
          <Button 
            onClick={onAddRow}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            행 추가
          </Button>
        </div>

        {/* 테이블 */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12 text-center">번호</TableHead>
                <TableHead className="w-32">성명</TableHead>
                <TableHead className="w-48">작품명</TableHead>
                <TableHead className="w-20 text-center">점필법</TableHead>
                <TableHead className="w-20 text-center">구성법</TableHead>
                <TableHead className="w-20 text-center">조화법</TableHead>
                <TableHead className="w-20 text-center">평균점수</TableHead>
                <TableHead className="w-16 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Trophy className="h-4 w-4" />
                    순위
                  </div>
                </TableHead>
                <TableHead className="w-16 text-center">등급</TableHead>
                <TableHead className="w-48">비고</TableHead>
                <TableHead className="w-12 text-center">삭제</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {resultsData.map((row) => (
                <TableRow key={row.rowId} className="hover:bg-muted/30">
                  {/* 번호 */}
                  <TableCell className="text-center font-medium">
                    {row.displayId}
                  </TableCell>

                  {/* 성명 */}
                  <TableCell>
                    <Input
                      value={row.artist}
                      onChange={(e) => onInputChange(row.rowId, 'artist', e.target.value)}
                      placeholder="성명"
                      className="bg-muted/50 border-0 focus:bg-background"
                    />
                  </TableCell>

                  {/* 작품명 */}
                  <TableCell>
                    <Input
                      value={row.title}
                      onChange={(e) => onInputChange(row.rowId, 'title', e.target.value)}
                      placeholder="작품명"
                      className="bg-muted/50 border-0 focus:bg-background"
                    />
                  </TableCell>

                  {/* 점필법 */}
                  <TableCell>
                    <Input
                      type="number"
                      value={row.score1}
                      onChange={(e) => onInputChange(row.rowId, 'score1', e.target.value)}
                      placeholder="0"
                      min="0"
                      max="100"
                      className="text-center bg-muted/50 border-0 focus:bg-background"
                    />
                  </TableCell>

                  {/* 구성법 */}
                  <TableCell>
                    <Input
                      type="number"
                      value={row.score2}
                      onChange={(e) => onInputChange(row.rowId, 'score2', e.target.value)}
                      placeholder="0"
                      min="0"
                      max="100"
                      className="text-center bg-muted/50 border-0 focus:bg-background"
                    />
                  </TableCell>

                  {/* 조화법 */}
                  <TableCell>
                    <Input
                      type="number"
                      value={row.score3}
                      onChange={(e) => onInputChange(row.rowId, 'score3', e.target.value)}
                      placeholder="0"
                      min="0"
                      max="100"
                      className="text-center bg-muted/50 border-0 focus:bg-background"
                    />
                  </TableCell>

                  {/* 평균점수 */}
                  <TableCell className="text-center">
                    <div className="font-medium">
                      {row.average !== null ? row.average.toFixed(1) : '-'}
                    </div>
                  </TableCell>

                  {/* 순위 */}
                  <TableCell className="text-center">
                    <div className="font-medium">
                      {row.rank !== null ? (
                        <Badge variant="outline" className="text-xs">
                          {row.rank}등
                        </Badge>
                      ) : (
                        '-'
                      )}
                    </div>
                  </TableCell>

                  {/* 등급 */}
                  <TableCell className="text-center">
                    <Badge className={getGradeClass(row.grade)}>
                      {row.grade || '-'}
                    </Badge>
                  </TableCell>

                  {/* 비고 */}
                  <TableCell>
                    <Textarea
                      value={row.remarks}
                      onChange={(e) => onInputChange(row.rowId, 'remarks', e.target.value)}
                      placeholder="비고"
                      className="min-h-[60px] bg-muted/50 border-0 focus:bg-background resize-none"
                    />
                  </TableCell>

                  {/* 삭제 버튼 */}
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteRow(row.rowId)}
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* 데이터가 없을 때 */}
        {resultsData.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <ClipboardList className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>아직 등록된 심사 결과가 없습니다.</p>
            <p className="text-sm">위의 "행 추가" 버튼을 클릭하여 시작하세요.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsTable; 