import React from 'react';
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface ScoreTableProps {
  pointsScore: number | null;
  structureScore: number | null;
  compositionScore: number | null;
  harmonyScore: number | null;
  totalScore: number;
  handleScoreClick: (category: string, value: number) => void;
  renderScoreRange: (category: string, min: number, max: number) => React.ReactNode[];
}

const ScoreTable: React.FC<ScoreTableProps> = ({
  pointsScore,
  structureScore,
  compositionScore,
  harmonyScore,
  totalScore,
  handleScoreClick,
  renderScoreRange
}) => {
  return (
    <div className="mb-6 border-b border-border pb-4">
      <Table className="border border-border">
        <TableHeader>
          <TableRow>
            <TableHead rowSpan={2} className="text-center bg-muted border border-border w-[20%]">평가항목</TableHead>
            <TableHead colSpan={5} className="text-center bg-muted border border-border">득점 범위</TableHead>
            <TableHead rowSpan={2} className="text-center bg-muted border border-border w-[15%]">획득점수</TableHead>
          </TableRow>
          <TableRow>
            <TableHead className="text-center bg-muted border border-border w-[12%] text-sm">1-5</TableHead>
            <TableHead className="text-center bg-muted border border-border w-[12%] text-sm">6-10</TableHead>
            <TableHead className="text-center bg-muted border border-border w-[12%] text-sm">11-15</TableHead>
            <TableHead className="text-center bg-muted border border-border w-[12%] text-sm">16-20</TableHead>
            <TableHead className="text-center bg-muted border border-border w-[12%] text-sm">21-25</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="text-center border border-border">점획(點劃)</TableCell>
            <TableCell className="text-center border border-border p-1">
              <div className="flex justify-center space-x-1">{renderScoreRange('points', 1, 5)}</div>
            </TableCell>
            <TableCell className="text-center border border-border p-1">
              <div className="flex justify-center space-x-1">{renderScoreRange('points', 6, 10)}</div>
            </TableCell>
            <TableCell className="text-center border border-border p-1">
              <div className="flex justify-center space-x-1">{renderScoreRange('points', 11, 15)}</div>
            </TableCell>
            <TableCell className="text-center border border-border p-1">
              <div className="flex justify-center space-x-1">{renderScoreRange('points', 16, 20)}</div>
            </TableCell>
            <TableCell className="text-center border border-border p-1">
              <div className="flex justify-center space-x-1">{renderScoreRange('points', 21, 25)}</div>
            </TableCell>
            <TableCell className="text-center border border-border">
              <Input 
                value={pointsScore !== null ? pointsScore.toString() : ''} 
                readOnly
                className="text-center font-bold bg-muted w-[80%] mx-auto"
              />
            </TableCell>
          </TableRow>
          
          <TableRow>
            <TableCell className="text-center border border-border">결구(結構)</TableCell>
            <TableCell className="text-center border border-border p-1">
              <div className="flex justify-center space-x-1">{renderScoreRange('structure', 1, 5)}</div>
            </TableCell>
            <TableCell className="text-center border border-border p-1">
              <div className="flex justify-center space-x-1">{renderScoreRange('structure', 6, 10)}</div>
            </TableCell>
            <TableCell className="text-center border border-border p-1">
              <div className="flex justify-center space-x-1">{renderScoreRange('structure', 11, 15)}</div>
            </TableCell>
            <TableCell className="text-center border border-border p-1">
              <div className="flex justify-center space-x-1">{renderScoreRange('structure', 16, 20)}</div>
            </TableCell>
            <TableCell className="text-center border border-border p-1">
              <div className="flex justify-center space-x-1">{renderScoreRange('structure', 21, 25)}</div>
            </TableCell>
            <TableCell className="text-center border border-border">
              <Input 
                value={structureScore !== null ? structureScore.toString() : ''} 
                readOnly
                className="text-center font-bold bg-muted w-[80%] mx-auto"
              />
            </TableCell>
          </TableRow>
          
          <TableRow>
            <TableCell className="text-center border border-border">장법(章法)</TableCell>
            <TableCell className="text-center border border-border p-1">
              <div className="flex justify-center space-x-1">{renderScoreRange('composition', 1, 5)}</div>
            </TableCell>
            <TableCell className="text-center border border-border p-1">
              <div className="flex justify-center space-x-1">{renderScoreRange('composition', 6, 10)}</div>
            </TableCell>
            <TableCell className="text-center border border-border p-1">
              <div className="flex justify-center space-x-1">{renderScoreRange('composition', 11, 15)}</div>
            </TableCell>
            <TableCell className="text-center border border-border p-1">
              <div className="flex justify-center space-x-1">{renderScoreRange('composition', 16, 20)}</div>
            </TableCell>
            <TableCell className="text-center border border-border p-1">
              <div className="flex justify-center space-x-1">{renderScoreRange('composition', 21, 25)}</div>
            </TableCell>
            <TableCell className="text-center border border-border">
              <Input 
                value={compositionScore !== null ? compositionScore.toString() : ''} 
                readOnly
                className="text-center font-bold bg-muted w-[80%] mx-auto"
              />
            </TableCell>
          </TableRow>
          
          <TableRow>
            <TableCell className="text-center border border-border">조화(調和)</TableCell>
            <TableCell className="text-center border border-border p-1">
              <div className="flex justify-center space-x-1">{renderScoreRange('harmony', 1, 5)}</div>
            </TableCell>
            <TableCell className="text-center border border-border p-1">
              <div className="flex justify-center space-x-1">{renderScoreRange('harmony', 6, 10)}</div>
            </TableCell>
            <TableCell className="text-center border border-border p-1">
              <div className="flex justify-center space-x-1">{renderScoreRange('harmony', 11, 15)}</div>
            </TableCell>
            <TableCell className="text-center border border-border p-1">
              <div className="flex justify-center space-x-1">{renderScoreRange('harmony', 16, 20)}</div>
            </TableCell>
            <TableCell className="text-center border border-border p-1">
              <div className="flex justify-center space-x-1">{renderScoreRange('harmony', 21, 25)}</div>
            </TableCell>
            <TableCell className="text-center border border-border">
              <Input 
                value={harmonyScore !== null ? harmonyScore.toString() : ''} 
                readOnly
                className="text-center font-bold bg-muted w-[80%] mx-auto"
              />
            </TableCell>
          </TableRow>
          
          <TableRow>
            <TableCell colSpan={6} className="text-right font-bold bg-muted border border-border">
              총점
            </TableCell>
            <TableCell className="text-center border border-border">
              <Input 
                value={totalScore.toString()} 
                readOnly
                className="text-center font-bold bg-muted w-[80%] mx-auto text-lg"
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
};

export default ScoreTable;
