import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileDown, Save, Plus, X } from 'lucide-react';
import SectionFooter from "@/components/ui/section-footer";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

const ResultsSection = () => {
  const [resultsData, setResultsData] = useState<ResultRow[]>([]);
  const [nextRowId, setNextRowId] = useState(0);
  const [evaluationDate, setEvaluationDate] = useState('');
  const [category, setCategory] = useState('');
  const [judgeSignature, setJudgeSignature] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const formRef = useRef<HTMLDivElement>(null);
  const isGeneratingPdf = useRef(false);

  useEffect(() => {
    setFormattedCurrentDate();
    initializeRows();
  }, []);

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
          `"${row.artist}"`,
          `"${row.title}"`,
          row.score1,
          row.score2,
          row.score3,
          row.average !== null ? row.average : '',
          row.rank !== null ? row.rank : '',
          row.grade,
          `"${row.remarks}"`
        ];
        csvContent += rowData.join(',') + '\n';
      });
      
      csvContent += `\n심사위원장 서명:,"${judgeSignature}"`;
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename = `심사결과종합표_${category || '전체'}_${evaluationDate || new Date().toISOString().split('T')[0]}.csv`;
      
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error("CSV 생성 오류:", error);
      alert("CSV 파일을 생성하는 중 오류가 발생했습니다.");
    }
  };

  const handlePdfDownload = async () => {
    if (!formRef.current || isGeneratingPdf.current) return;
    
    isGeneratingPdf.current = true;
    
    try {
      const form = formRef.current;
      form.classList.add('pdf-generating');
      
      const canvas = await html2canvas(form, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          clonedDoc.querySelectorAll('.button-container, .add-row-button, .delete-row-btn').forEach(
            el => el.remove()
          );
          
          clonedDoc.querySelectorAll('input, select').forEach(input => {
            input.setAttribute('style', 'border: none; background-color: transparent; padding: 0; margin: 0;');
            (input as HTMLInputElement).readOnly = true;
          });
        }
      });
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      const contentWidth = pdfWidth - (margin * 2);
      
      pdf.setFontSize(16);
      pdf.text('심사 결과 종합표', pdfWidth / 2, margin, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.text(`심사 일시: ${evaluationDate}`, margin, margin + 10);
      pdf.text(`심사 부문: ${category}`, margin, margin + 15);
      
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      const pageContentHeight = pdfHeight - (margin * 2) - 25;
      const ratio = canvas.width / imgWidth;
      const pageCount = Math.ceil(imgHeight / pageContentHeight);
      
      let srcY = 0;
      let yOffset = margin + 20;
      
      for (let i = 0; i < pageCount; i++) {
        if (i > 0) {
          pdf.addPage();
          yOffset = margin;
        }
        
        const canvasHeight = Math.min(
          (pageContentHeight * ratio),
          canvas.height - srcY
        );
        
        const destHeight = canvasHeight / ratio;
        
        pdf.addImage(
          imgData,
          'PNG',
          margin,
          yOffset,
          imgWidth,
          destHeight
        );
        
        srcY += canvasHeight;
      }
      
      const lastPage = pdf.getNumberOfPages();
      pdf.setPage(lastPage);
      const finalY = pdfHeight - (margin / 2);
      pdf.text(`작성일: ${currentDate}`, margin, finalY);
      pdf.text(`심사위원장: ${judgeSignature || '_______________'} (서명)`, pdfWidth - margin - 80, finalY);
      
      const filename = `심사결과종합표_${category || '전체'}_${evaluationDate || new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(filename);
      
    } catch (error) {
      console.error("PDF 생성 오류:", error);
      alert("PDF 파일을 생성하는 중 오류가 발생했습니다.");
    } finally {
      if (formRef.current) {
        formRef.current.classList.remove('pdf-generating');
      }
      isGeneratingPdf.current = false;
    }
  };

  return (
    <section className="calligraphy-section" ref={formRef}>
      <h2 className="calligraphy-section-title">심사결과종합표</h2>
      
      <div className="form-header mb-4 sm:mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="eval-date" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">심사 일시</Label>
            <Input 
              id="eval-date"
              type="date"
              value={evaluationDate}
              onChange={(e) => setEvaluationDate(e.target.value)}
              className="w-full h-8 sm:h-10 text-xs sm:text-sm"
            />
          </div>
          
          <div>
            <Label htmlFor="eval-category" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">심사 부문</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="eval-category" className="h-8 sm:h-10 text-xs sm:text-sm">
                <SelectValue placeholder="부문 선택..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="한글서예" className="text-xs sm:text-sm">한글서예</SelectItem>
                <SelectItem value="한문서예" className="text-xs sm:text-sm">한문서예</SelectItem>
                <SelectItem value="현대서예" className="text-xs sm:text-sm">현대서예</SelectItem>
                <SelectItem value="캘리그라피" className="text-xs sm:text-sm">캘리그라피</SelectItem>
                <SelectItem value="전각・서각" className="text-xs sm:text-sm">전각・서각</SelectItem>
                <SelectItem value="문인화・동양화・민화" className="text-xs sm:text-sm">문인화・동양화・민화</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="text-right mb-2">
        <Button 
          onClick={addRow} 
          size="sm" 
          className="bg-[#6c757d] hover:bg-[#5a6268] text-white text-xs sm:text-sm h-7 sm:h-9"
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1" /> 행 추가
        </Button>
      </div>

      <div className="overflow-x-auto mb-6 border-b border-[#E4D7C5] pb-4">
        <Table className="w-full border border-gray-300 table-fixed">
          <TableHeader>
            <TableRow className="bg-[#f8f9fa]">
              <TableHead className="w-[40px] text-center border border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">번호</TableHead>
              <TableHead className="w-[80px] sm:w-[15%] text-left border border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">작가</TableHead>
              <TableHead className="w-[100px] sm:w-[18%] text-left border border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">작품명</TableHead>
              <TableHead className="w-[50px] sm:w-[8%] text-center border border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">심사1</TableHead>
              <TableHead className="w-[50px] sm:w-[8%] text-center border border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">심사2</TableHead>
              <TableHead className="w-[50px] sm:w-[8%] text-center border border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">심사3</TableHead>
              <TableHead className="w-[50px] sm:w-[8%] text-center border border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">평균</TableHead>
              <TableHead className="w-[40px] sm:w-[6%] text-center border border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">순위</TableHead>
              <TableHead className="w-[40px] sm:w-[7%] text-center border border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">등급</TableHead>
              <TableHead className="w-[80px] sm:w-[12%] text-left border border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">비고</TableHead>
              <TableHead className="w-[40px] sm:w-[5%] text-center border border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">삭제</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resultsData.map((row) => (
              <TableRow 
                key={row.rowId} 
                className={getGradeClass(row.grade)}
              >
                <TableCell className="text-center font-medium border border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">
                  {row.displayId}
                </TableCell>
                <TableCell className="border border-gray-300 p-0 sm:p-1">
                  <Input 
                    value={row.artist}
                    onChange={(e) => handleInputChange(row.rowId, 'artist', e.target.value)}
                    className="w-full p-1 text-xs sm:text-sm border-0 h-7 sm:h-8"
                  />
                </TableCell>
                <TableCell className="border border-gray-300 p-0 sm:p-1">
                  <Input 
                    value={row.title}
                    onChange={(e) => handleInputChange(row.rowId, 'title', e.target.value)}
                    className="w-full p-1 text-xs sm:text-sm border-0 h-7 sm:h-8"
                  />
                </TableCell>
                <TableCell className="border border-gray-300 p-0 sm:p-1">
                  <Input 
                    type="number"
                    min="0"
                    max="100"
                    value={row.score1}
                    onChange={(e) => handleInputChange(row.rowId, 'score1', e.target.value)}
                    className="w-full p-1 text-center text-xs sm:text-sm border-0 h-7 sm:h-8"
                  />
                </TableCell>
                <TableCell className="border border-gray-300 p-0 sm:p-1">
                  <Input 
                    type="number"
                    min="0"
                    max="100"
                    value={row.score2}
                    onChange={(e) => handleInputChange(row.rowId, 'score2', e.target.value)}
                    className="w-full p-1 text-center text-xs sm:text-sm border-0 h-7 sm:h-8"
                  />
                </TableCell>
                <TableCell className="border border-gray-300 p-0 sm:p-1">
                  <Input 
                    type="number"
                    min="0"
                    max="100"
                    value={row.score3}
                    onChange={(e) => handleInputChange(row.rowId, 'score3', e.target.value)}
                    className="w-full p-1 text-center text-xs sm:text-sm border-0 h-7 sm:h-8"
                  />
                </TableCell>
                <TableCell className="text-center font-medium border border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">
                  {row.average !== null ? row.average : ''}
                </TableCell>
                <TableCell className="text-center font-medium border border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">
                  {row.rank !== null ? row.rank : ''}
                </TableCell>
                <TableCell className="text-center font-medium border border-gray-300 p-1 sm:p-2 text-xs sm:text-sm">
                  {row.grade}
                </TableCell>
                <TableCell className="border border-gray-300 p-0 sm:p-1">
                  <Input 
                    value={row.remarks}
                    onChange={(e) => handleInputChange(row.rowId, 'remarks', e.target.value)}
                    className="w-full p-1 text-xs sm:text-sm border-0 h-7 sm:h-8"
                  />
                </TableCell>
                <TableCell className="text-center border border-gray-300 p-0 sm:p-1">
                  <Button 
                    onClick={() => deleteRow(row.rowId)} 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 text-[#C53030] hover:text-[#9B4444] hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mb-6 border-b border-[#E4D7C5] pb-4">
        <h3 className="text-lg sm:text-xl font-medium mb-2 text-[#1A1F2C] border-b border-[#C53030] pb-2 inline-block">수상 등급별 분포</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
          <div className="p-2 sm:p-3 border border-gray-300 rounded-md text-center bg-[rgba(144,238,144,0.3)]">
            <div className="text-xs sm:text-sm text-gray-500 mb-1">A등급 (90점 이상)</div>
            <div className="text-lg sm:text-xl font-bold text-[#28a745]">
              {resultsData.filter(r => r.grade === 'A').length}명
            </div>
          </div>
          <div className="p-2 sm:p-3 border border-gray-300 rounded-md text-center bg-[rgba(135,206,250,0.3)]">
            <div className="text-xs sm:text-sm text-gray-500 mb-1">B등급 (80-89점)</div>
            <div className="text-lg sm:text-xl font-bold text-[#007bff]">
              {resultsData.filter(r => r.grade === 'B').length}명
            </div>
          </div>
          <div className="p-2 sm:p-3 border border-gray-300 rounded-md text-center bg-[rgba(255,255,224,0.3)]">
            <div className="text-xs sm:text-sm text-gray-500 mb-1">C등급 (70-79점)</div>
            <div className="text-lg sm:text-xl font-bold text-[#f08c00]">
              {resultsData.filter(r => r.grade === 'C').length}명
            </div>
          </div>
          <div className="p-2 sm:p-3 border border-gray-300 rounded-md text-center bg-[rgba(255,192,203,0.3)]">
            <div className="text-xs sm:text-sm text-gray-500 mb-1">D등급 (69점 이하)</div>
            <div className="text-lg sm:text-xl font-bold text-[#6c757d]">
              {resultsData.filter(r => r.grade === 'D').length}명
            </div>
          </div>
        </div>
      </div>

      <div className="form-section mb-6 border-b border-[#E4D7C5] pb-4">
        <h3 className="text-lg sm:text-xl font-medium mb-2 text-[#1A1F2C] border-b border-[#C53030] pb-2 inline-block">등급결정 및 동점자 처리</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <h4 className="font-medium mb-1 sm:mb-2 text-sm sm:text-base">등급결정 기준</h4>
            <ul className="list-disc pl-4 sm:pl-5 space-y-0.5 sm:space-y-1 text-xs sm:text-sm">
              <li>90점 이상: 대상 및 최우수상 후보</li>
              <li>85점 이상: 우수상 후보</li>
              <li>80점 이상: 특선 후보</li>
              <li>75점 이상: 입선 후보</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-1 sm:mb-2 text-sm sm:text-base">동점자 발생시 처리방안</h4>
            <ul className="list-disc pl-4 sm:pl-5 space-y-0.5 sm:space-y-1 text-xs sm:text-sm">
              <li>조화(調和) 점수가 높은 작품우선</li>
              <li>장법(章法) 점수가 높은 작품우선</li>
              <li>심사위원 간 협의를 통한 결정</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="form-section mb-6 border-b border-[#E4D7C5] pb-4">
        <h3 className="text-lg sm:text-xl font-medium mb-2 text-[#1A1F2C] border-b border-[#C53030] pb-2 inline-block">심사결과 확정</h3>
        <ol className="list-decimal pl-4 sm:pl-5 space-y-0.5 sm:space-y-1 text-xs sm:text-sm">
          <li>심사위원장은 종합심사 결과를 이사장에게 보고한다.</li>
          <li>이사회는 심사결과를 검토하고 최종 승인한다.</li>
          <li>확정된 심사결과는 수상자에게 개별 통보하며, 협회 홈페이지에 게시한다.</li>
        </ol>
      </div>

      <SectionFooter
        currentDate={currentDate}
        signature={judgeSignature}
        setSignature={setJudgeSignature}
        signatureLabel="심사위원"
        handlePdfDownload={handlePdfDownload}
        handleCsvExport={handleExportCsv}
        isPdfGenerating={isGeneratingPdf.current}
      />
    </section>
  );
};

export default ResultsSection;
