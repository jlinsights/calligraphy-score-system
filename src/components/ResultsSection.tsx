import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, Plus, X, FileText, FileOutput } from 'lucide-react';
import SectionFooter from "@/components/ui/section-footer";
import { generatePdfFromElement } from '@/utils/pdfUtils';
import TurndownService from 'turndown';
import { toast } from "@/components/ui/use-toast";

interface ResultRow {
  rowId: number;
  displayId: number;
  artist: string;
  title: string;
  score1: string;
  score2: string;
  score3: string;
  average: number | null;
  rank: number | null;
  grade: string;
  remarks: string;
}

// 심사 결과 인터페이스 정의
interface EvaluationResult {
  id: string;
  date: string;
  category: string;
  artistName: string;
  workTitle: string;
  pointsScore: number | null;
  structureScore: number | null;
  compositionScore: number | null;
  harmonyScore: number | null;
  totalScore: number;
  judgeSignature: string;
  timestamp: number;
}

const ResultsSection = () => {
  const [resultsData, setResultsData] = useState<ResultRow[]>([]);
  const [nextRowId, setNextRowId] = useState(0);
  const [evaluationDate, setEvaluationDate] = useState('');
  const [category, setCategory] = useState('');
  const [judgeSignature, setJudgeSignature] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const formRef = useRef<HTMLDivElement>(null);
  const [isMarkdownGenerating, setIsMarkdownGenerating] = useState(false);
  const [availableCategories, setAvailableCategories] = useState<string[]>([]);

  useEffect(() => {
    setFormattedCurrentDate();
    initializeRows();
    loadSignatureFromLocalStorage();
    loadAvailableCategories();
  }, []);

  // 카테고리가 변경될 때 해당 카테고리의 데이터 로드
  useEffect(() => {
    if (category) {
      loadEvaluationsByCategory(category);
    }
  }, [category]);

  const loadSignatureFromLocalStorage = () => {
    const savedSignature = localStorage.getItem('judgeSignature');
    if (savedSignature) {
      setJudgeSignature(savedSignature);
    }
  };

  // 사용 가능한 심사 부문 목록 로드
  const loadAvailableCategories = () => {
    try {
      const resultsStr = localStorage.getItem('evaluationResults');
      if (!resultsStr) return;

      const results: EvaluationResult[] = JSON.parse(resultsStr);
      const categories = Array.from(new Set(results.map(r => r.category))).filter(Boolean);
      
      setAvailableCategories(categories);
    } catch (error) {
      console.error('카테고리 로드 중 오류 발생:', error);
    }
  };

  // 선택된 부문의 평가 데이터 로드
  const loadEvaluationsByCategory = (selectedCategory: string) => {
    try {
      const resultsStr = localStorage.getItem('evaluationResults');
      if (!resultsStr) return;

      const results: EvaluationResult[] = JSON.parse(resultsStr);
      const filteredResults = results.filter(r => r.category === selectedCategory);
      
      if (filteredResults.length === 0) {
        toast({
          title: "알림",
          description: "해당 부문에 저장된 심사 결과가 없습니다.",
          duration: 3000,
        });
        return;
      }

      // 날짜 정보 설정 (첫 번째 항목의 날짜 사용)
      if (filteredResults.length > 0) {
        setEvaluationDate(filteredResults[0].date);
      }

      // 행 데이터 생성
      const newRows: ResultRow[] = filteredResults.map((result, index) => ({
        rowId: index,
        displayId: index + 1,
        artist: result.artistName,
        title: result.workTitle,
        score1: result.totalScore.toString(),
        score2: '',
        score3: '',
        average: null,
        rank: null,
        grade: '',
        remarks: ''
      }));

      // 최소 5개의 행 보장
      while (newRows.length < 5) {
        newRows.push(createNewRow(newRows.length + 1));
      }

      // 데이터 설정
      setResultsData(newRows);
      setNextRowId(newRows.length);
      
      // 계산 수행
      updateCalculationsAndRank(newRows);

      toast({
        title: "데이터 로드 완료",
        description: `${selectedCategory} 부문의 ${filteredResults.length}개 심사 결과를 로드했습니다.`,
        duration: 3000,
      });
    } catch (error) {
      console.error('평가 데이터 로드 중 오류 발생:', error);
      toast({
        title: "오류",
        description: "데이터 로드 중 오류가 발생했습니다.",
        duration: 3000,
        variant: "destructive"
      });
    }
  };

  const setFormattedCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    setCurrentDate(`${year}년 ${month}월 ${day}일`);
    
    setEvaluationDate(`${year}-${month}-${day}`);
  };

  const initializeRows = () => {
    const initialRows: ResultRow[] = [];
    for (let i = 0; i < 5; i++) {
      initialRows.push(createNewRow(i + 1));
    }
    setResultsData(initialRows);
    setNextRowId(5);
  };

  const createNewRow = (displayId: number): ResultRow => {
    return {
      rowId: displayId - 1,
      displayId: displayId,
      artist: '',
      title: '',
      score1: '',
      score2: '',
      score3: '',
      average: null,
      rank: null,
      grade: '',
      remarks: ''
    };
  };

  const addRow = () => {
    const newRow = createNewRow(resultsData.length + 1);
    newRow.rowId = nextRowId;
    setResultsData([...resultsData, newRow]);
    setNextRowId(nextRowId + 1);
  };

  const updateRowNumbers = () => {
    return resultsData.map((row, index) => ({
      ...row,
      displayId: index + 1
    }));
  };

  const deleteRow = (rowId: number) => {
    if (window.confirm(`이 행을 삭제하시겠습니까?`)) {
      const updatedData = resultsData.filter(row => row.rowId !== rowId);
      const renumberedData = updatedData.map((row, index) => ({
        ...row,
        displayId: index + 1
      }));
      setResultsData(renumberedData);
    }
  };

  const handleInputChange = (rowId: number, field: keyof ResultRow, value: string) => {
    const updatedData = resultsData.map(row => {
      if (row.rowId === rowId) {
        return { ...row, [field]: value };
      }
      return row;
    });
    
    setResultsData(updatedData);

    if (field === 'score1' || field === 'score2' || field === 'score3') {
      updateCalculationsAndRank(updatedData);
    }
  };

  const calculateGrade = (score: number | null): string => {
    if (score === null || isNaN(score)) return '';
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    return 'D';
  };

  const updateCalculationsAndRank = (data: ResultRow[] = resultsData) => {
    let calculatedData = data.map(row => {
      const scores = [row.score1, row.score2, row.score3]
        .map(s => parseFloat(s))
        .filter(s => !isNaN(s) && s >= 0 && s <= 100);

      if (scores.length > 0) {
        const average = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
        return {
          ...row,
          average,
          grade: calculateGrade(average)
        };
      }
      return {
        ...row,
        average: null,
        grade: ''
      };
    });

    const validData = calculatedData.filter(d => d.average !== null);
    validData.sort((a, b) => (b.average ?? 0) - (a.average ?? 0));

    let currentRank = 0;
    let itemsAtCurrentRank = 0;
    let lastScore = -Infinity;

    validData.forEach((row) => {
      if (row.average !== lastScore) {
        currentRank += itemsAtCurrentRank;
        itemsAtCurrentRank = 1;
        lastScore = row.average ?? -Infinity;
        row.rank = currentRank;
      } else {
        itemsAtCurrentRank++;
        row.rank = currentRank;
      }
    });

    calculatedData = calculatedData.map(row => {
      const validRow = validData.find(vr => vr.rowId === row.rowId);
      if (validRow) {
        return {
          ...row,
          rank: validRow.rank
        };
      }
      return {
        ...row,
        rank: null
      };
    });

    setResultsData(calculatedData);
  };

  const getGradeClass = (grade: string): string => {
    if (!grade) return '';
    return `bg-${grade.toLowerCase() === 'a' ? '[rgba(144,238,144,0.3)]' : 
            grade.toLowerCase() === 'b' ? '[rgba(135,206,250,0.3)]' : 
            grade.toLowerCase() === 'c' ? '[rgba(255,255,224,0.3)]' : 
            '[rgba(255,192,203,0.3)]'}`;
  };

  const handleExportCsv = () => {
    try {
      const headers = ['번호', '작가', '작품명', '심사1', '심사2', '심사3', '평균', '순위', '등급', '비고'];
      
      let csvContent = `\uFEFF심사 일시:,${evaluationDate}\n`;
      csvContent += `심사 부문:,${category}\n`;
      csvContent += `작성일:,${currentDate}\n\n`;
      
      csvContent += headers.join(',') + '\n';
      
      resultsData.forEach(row => {
        const rowData = [
          row.displayId,
          row.artist,
          row.title,
          row.score1,
          row.score2,
          row.score3,
          row.average?.toString() || '',
          row.rank?.toString() || '',
          row.grade,
          row.remarks
        ];
        csvContent += rowData.join(',') + '\n';
      });
      
      const encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvContent);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', `심사결과종합표_${category ? category + '_' : ''}${evaluationDate}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('CSV 내보내기 오류:', error);
      alert('CSV 내보내기에 실패했습니다.');
    }
  };

  const handleDownloadMarkdown = () => {
    try {
      setIsMarkdownGenerating(true);
      
      // Turndown 서비스 초기화
      const turndownService = new TurndownService();
      
      // 마크다운 콘텐츠 생성
      let markdownContent = `# 심사 결과 종합표\n\n`;
      markdownContent += `**심사 일시:** ${evaluationDate}\n`;
      markdownContent += `**심사 부문:** ${category}\n`;
      markdownContent += `**작성일:** ${currentDate}\n\n`;
      
      // 테이블 헤더
      markdownContent += `| 번호 | 작가 | 작품명 | 심사1 | 심사2 | 심사3 | 평균 | 순위 | 등급 | 비고 |\n`;
      markdownContent += `| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |\n`;
      
      // 테이블 내용
      resultsData.forEach(row => {
        markdownContent += `| ${row.displayId} | ${row.artist} | ${row.title} | ${row.score1} | ${row.score2} | ${row.score3} | ${row.average || ''} | ${row.rank || ''} | ${row.grade} | ${row.remarks} |\n`;
      });
      
      markdownContent += `\n**서명:** ${judgeSignature}\n`;
      
      // 파일 다운로드
      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `심사결과종합표_${category ? category + '_' : ''}${evaluationDate}.md`;
      link.click();
      
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('마크다운 생성 오류:', error);
      alert('마크다운 생성에 실패했습니다.');
    } finally {
      setIsMarkdownGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 md:py-8 font-sans">
      <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md text-gray-900 dark:text-gray-100">
        <div className="mb-4 text-center">
          <h1 className="text-2xl font-bold">심사 결과 종합표</h1>
        </div>
        
        <div ref={formRef} className="print-content">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 sm:gap-4 mb-4">
            <div className="flex flex-col">
              <Label htmlFor="evaluation-date" className="mb-1 text-xs sm:text-sm">심사 일시</Label>
              <Input 
                id="evaluation-date" 
                type="date" 
                value={evaluationDate}
                onChange={(e) => setEvaluationDate(e.target.value)}
                className="text-xs sm:text-sm py-1 h-8"
              />
            </div>
            <div className="flex flex-col">
              <Label htmlFor="category" className="mb-1 text-xs sm:text-sm">심사 부문</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="category" className="text-xs sm:text-sm h-8">
                  <SelectValue placeholder="심사 부문 선택" />
                </SelectTrigger>
                <SelectContent>
                  {availableCategories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-xs sm:text-sm">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col">
              <Label htmlFor="judge-signature" className="mb-1 text-xs sm:text-sm">심사위원 성명</Label>
              <Input 
                id="judge-signature" 
                type="text" 
                value={judgeSignature}
                onChange={(e) => setJudgeSignature(e.target.value)}
                className="text-xs sm:text-sm py-1 h-8"
              />
            </div>
          </div>
          
          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="inline-block min-w-full py-2 align-middle">
              <Table className="min-w-full border-collapse">
                <TableHeader className="bg-gray-100 dark:bg-gray-700">
                  <TableRow>
                    <TableHead className="py-1 px-2 text-xs whitespace-nowrap">번호</TableHead>
                    <TableHead className="py-1 px-2 text-xs">작가</TableHead>
                    <TableHead className="py-1 px-2 text-xs">작품명</TableHead>
                    <TableHead className="py-1 px-2 text-xs whitespace-nowrap">심사1</TableHead>
                    <TableHead className="py-1 px-2 text-xs whitespace-nowrap">심사2</TableHead>
                    <TableHead className="py-1 px-2 text-xs whitespace-nowrap">심사3</TableHead>
                    <TableHead className="py-1 px-2 text-xs whitespace-nowrap">평균</TableHead>
                    <TableHead className="py-1 px-2 text-xs whitespace-nowrap">순위</TableHead>
                    <TableHead className="py-1 px-2 text-xs whitespace-nowrap">등급</TableHead>
                    <TableHead className="py-1 px-2 text-xs whitespace-nowrap">비고</TableHead>
                    <TableHead className="py-1 px-2 text-xs sr-only print:hidden">작업</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resultsData.map((row) => (
                    <TableRow key={row.rowId} className="border-b border-gray-200 dark:border-gray-700">
                      <TableCell className="py-1 px-2 text-xs">{row.displayId}</TableCell>
                      <TableCell className="py-1 px-2">
                        <Input 
                          value={row.artist} 
                          onChange={(e) => handleInputChange(row.rowId, 'artist', e.target.value)}
                          className="text-xs p-1 h-8 w-full"
                        />
                      </TableCell>
                      <TableCell className="py-1 px-2">
                        <Input 
                          value={row.title} 
                          onChange={(e) => handleInputChange(row.rowId, 'title', e.target.value)}
                          className="text-xs p-1 h-8 w-full"
                        />
                      </TableCell>
                      <TableCell className="py-1 px-2">
                        <Input 
                          type="number"
                          min={0}
                          max={100}
                          value={row.score1} 
                          onChange={(e) => handleInputChange(row.rowId, 'score1', e.target.value)}
                          className="text-xs p-1 h-8 w-16"
                        />
                      </TableCell>
                      <TableCell className="py-1 px-2">
                        <Input 
                          type="number"
                          min={0}
                          max={100}
                          value={row.score2} 
                          onChange={(e) => handleInputChange(row.rowId, 'score2', e.target.value)}
                          className="text-xs p-1 h-8 w-16"
                        />
                      </TableCell>
                      <TableCell className="py-1 px-2">
                        <Input 
                          type="number"
                          min={0}
                          max={100}
                          value={row.score3} 
                          onChange={(e) => handleInputChange(row.rowId, 'score3', e.target.value)}
                          className="text-xs p-1 h-8 w-16"
                        />
                      </TableCell>
                      <TableCell className="py-1 px-2 text-xs text-center">{row.average !== null ? row.average.toFixed(1) : ''}</TableCell>
                      <TableCell className="py-1 px-2 text-xs text-center">{row.rank}</TableCell>
                      <TableCell className={`py-1 px-2 text-xs text-center ${getGradeClass(row.grade)}`}>{row.grade}</TableCell>
                      <TableCell className="py-1 px-2">
                        <Input 
                          value={row.remarks} 
                          onChange={(e) => handleInputChange(row.rowId, 'remarks', e.target.value)}
                          className="text-xs p-1 h-8 w-full"
                        />
                      </TableCell>
                      <TableCell className="py-1 px-2 print:hidden">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteRow(row.rowId)}
                          className="h-6 w-6"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="mt-6">
            <h2 className="text-lg font-semibold mb-2">등급 배분</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="bg-[rgba(144,238,144,0.3)] p-2 rounded">
                <p className="font-bold text-center">A</p>
                <p className="text-sm text-center">90점 이상</p>
                <p className="text-center text-sm mt-1">
                  {resultsData.filter(r => r.grade === 'A').length}명
                </p>
              </div>
              <div className="bg-[rgba(135,206,250,0.3)] p-2 rounded">
                <p className="font-bold text-center">B</p>
                <p className="text-sm text-center">80점 이상 90점 미만</p>
                <p className="text-center text-sm mt-1">
                  {resultsData.filter(r => r.grade === 'B').length}명
                </p>
              </div>
              <div className="bg-[rgba(255,255,224,0.3)] p-2 rounded">
                <p className="font-bold text-center">C</p>
                <p className="text-sm text-center">70점 이상 80점 미만</p>
                <p className="text-center text-sm mt-1">
                  {resultsData.filter(r => r.grade === 'C').length}명
                </p>
              </div>
              <div className="bg-[rgba(255,192,203,0.3)] p-2 rounded">
                <p className="font-bold text-center">D</p>
                <p className="text-sm text-center">70점 미만</p>
                <p className="text-center text-sm mt-1">
                  {resultsData.filter(r => r.grade === 'D').length}명
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-right">
            <p className="text-xs sm:text-sm">날짜: {currentDate}</p>
            <p className="text-xs sm:text-sm mt-1">서명: {judgeSignature}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2 justify-between items-center mt-6 print:hidden">
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addRow}
              className="flex items-center"
            >
              <Plus className="h-4 w-4 mr-1" />
              <span className="text-xs">행 추가</span>
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleDownloadMarkdown}
              disabled={isMarkdownGenerating}
              className="flex items-center"
            >
              <FileOutput className="h-4 w-4 mr-1" />
              <span className="text-xs">MD 내보내기</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleExportCsv}
              className="flex items-center"
            >
              <FileText className="h-4 w-4 mr-1" />
              <span className="text-xs">CSV 내보내기</span>
            </Button>
          </div>
        </div>
      </div>
      
      <SectionFooter 
        currentDate={currentDate}
        signature={judgeSignature}
        setSignature={setJudgeSignature}
        handleCsvExport={handleExportCsv}
        handleMarkdownDownload={handleDownloadMarkdown}
        isCsvGenerating={false}
        isMarkdownGenerating={isMarkdownGenerating}
      />
    </div>
  );
};

export default ResultsSection;
