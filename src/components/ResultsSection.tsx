
import React, { useState, useEffect, useRef } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileDown, Save, Plus, X } from 'lucide-react';
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
    
    // Set default evaluation date to today
    setEvaluationDate(`${year}-${month}-${day}`);
  };

  const initializeRows = () => {
    const initialRows: ResultRow[] = [];
    for (let i = 0; i < 5; i++) {
      initialRows.push(createNewRow(i + 1));
    }
    setResultsData(initialRows);
    setNextRowId(5); // Start next ID after the initial rows
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

    // If score fields are updated, recalculate average, rank, and grade
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
    // Calculate average scores and grades
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

    // Calculate rankings
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

    // Update ranking in original data
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
      // Create CSV content
      const headers = ['번호', '작가', '작품명', '심사1', '심사2', '심사3', '평균', '순위', '등급', '비고'];
      
      let csvContent = `\uFEFF심사 일시:,${evaluationDate}\n`;
      csvContent += `심사 부문:,${category}\n`;
      csvContent += `작성일:,${currentDate}\n\n`;
      
      // Add headers
      csvContent += headers.join(',') + '\n';
      
      // Add data rows
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
      
      // Create blob and trigger download
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
      // Prepare form for PDF generation
      const form = formRef.current;
      form.classList.add('pdf-generating');
      
      // Create canvas of the form
      const canvas = await html2canvas(form, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        onclone: (clonedDoc) => {
          // Remove buttons and other non-printable elements
          clonedDoc.querySelectorAll('.button-container, .add-row-button, .delete-row-btn').forEach(
            el => el.remove()
          );
          
          // Make inputs look like regular text
          clonedDoc.querySelectorAll('input, select').forEach(input => {
            input.setAttribute('style', 'border: none; background-color: transparent; padding: 0; margin: 0;');
            (input as HTMLInputElement).readOnly = true;
          });
        }
      });
      
      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasAspectRatio = canvas.width / canvas.height;
      const pageMargin = 15;
      
      // Add content to PDF
      pdf.setFontSize(16);
      pdf.text('심사 결과 종합표', pdfWidth / 2, pageMargin, { align: 'center' });
      
      pdf.setFontSize(10);
      pdf.text(`심사 일시: ${evaluationDate}`, pageMargin, pageMargin + 10);
      pdf.text(`심사 부문: ${category}`, pageMargin, pageMargin + 15);
      
      // Add the form image
      const contentWidth = pdfWidth - (pageMargin * 2);
      const contentHeight = contentWidth / canvasAspectRatio;
      pdf.addImage(imgData, 'PNG', pageMargin, pageMargin + 25, contentWidth, contentHeight);
      
      // Add signature at bottom
      const finalY = pdfHeight - pageMargin - 10;
      pdf.text(`작성일: ${currentDate}`, pageMargin, finalY);
      pdf.text(`심사위원장: ${judgeSignature || '_______________'} (서명)`, pdfWidth - pageMargin - 80, finalY);
      
      // Save PDF
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
    <div className="calligraphy-section" ref={formRef}>
      <h2 className="calligraphy-section-title">심사결과종합표</h2>
      
      <div className="mb-6 flex flex-wrap gap-4">
        <div className="w-full md:w-auto flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">심사 일시</label>
          <Input 
            type="date"
            value={evaluationDate}
            onChange={(e) => setEvaluationDate(e.target.value)}
            className="w-full"
          />
        </div>
        
        <div className="w-full md:w-auto flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">심사 부문</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#C53030]"
          >
            <option value="" disabled>부문 선택...</option>
            <option value="한글서예">한글서예</option>
            <option value="한문서예">한문서예</option>
            <option value="현대서예">현대서예</option>
            <option value="캘리그라피">캘리그라피</option>
            <option value="전각・서각">전각・서각</option>
            <option value="문인화・동양화・민화">문인화・동양화・민화</option>
          </select>
        </div>
      </div>

      <div className="text-right mb-2">
        <Button 
          onClick={addRow} 
          size="sm" 
          variant="outline" 
          className="bg-[#6c757d] hover:bg-[#5a6268] text-white border-0"
        >
          <Plus className="w-4 h-4 mr-1" /> 행 추가
        </Button>
      </div>

      <div className="overflow-x-auto mb-6">
        <Table className="w-full border border-gray-200">
          <TableHeader>
            <TableRow className="bg-gray-50">
              <TableHead className="w-[5%] text-center border-b">번호</TableHead>
              <TableHead className="w-[15%] text-left border-b">작가</TableHead>
              <TableHead className="w-[18%] text-left border-b">작품명</TableHead>
              <TableHead className="w-[8%] text-center border-b">심사1</TableHead>
              <TableHead className="w-[8%] text-center border-b">심사2</TableHead>
              <TableHead className="w-[8%] text-center border-b">심사3</TableHead>
              <TableHead className="w-[8%] text-center border-b">평균</TableHead>
              <TableHead className="w-[6%] text-center border-b">순위</TableHead>
              <TableHead className="w-[7%] text-center border-b">등급</TableHead>
              <TableHead className="w-[12%] text-left border-b">비고</TableHead>
              <TableHead className="w-[5%] text-center border-b">삭제</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {resultsData.map((row) => (
              <TableRow 
                key={row.rowId} 
                className={getGradeClass(row.grade)}
              >
                <TableCell className="text-center font-medium border-b">
                  {row.displayId}
                </TableCell>
                <TableCell className="border-b">
                  <Input 
                    value={row.artist}
                    onChange={(e) => handleInputChange(row.rowId, 'artist', e.target.value)}
                    className="w-full p-1 text-sm"
                  />
                </TableCell>
                <TableCell className="border-b">
                  <Input 
                    value={row.title}
                    onChange={(e) => handleInputChange(row.rowId, 'title', e.target.value)}
                    className="w-full p-1 text-sm"
                  />
                </TableCell>
                <TableCell className="border-b">
                  <Input 
                    type="number"
                    min="0"
                    max="100"
                    value={row.score1}
                    onChange={(e) => handleInputChange(row.rowId, 'score1', e.target.value)}
                    className="w-full p-1 text-center text-sm"
                  />
                </TableCell>
                <TableCell className="border-b">
                  <Input 
                    type="number"
                    min="0"
                    max="100"
                    value={row.score2}
                    onChange={(e) => handleInputChange(row.rowId, 'score2', e.target.value)}
                    className="w-full p-1 text-center text-sm"
                  />
                </TableCell>
                <TableCell className="border-b">
                  <Input 
                    type="number"
                    min="0"
                    max="100"
                    value={row.score3}
                    onChange={(e) => handleInputChange(row.rowId, 'score3', e.target.value)}
                    className="w-full p-1 text-center text-sm"
                  />
                </TableCell>
                <TableCell className="text-center font-medium border-b">
                  {row.average !== null ? row.average : ''}
                </TableCell>
                <TableCell className="text-center font-medium border-b">
                  {row.rank !== null ? row.rank : ''}
                </TableCell>
                <TableCell className="text-center font-medium border-b">
                  {row.grade}
                </TableCell>
                <TableCell className="border-b">
                  <Input 
                    value={row.remarks}
                    onChange={(e) => handleInputChange(row.rowId, 'remarks', e.target.value)}
                    className="w-full p-1 text-sm"
                  />
                </TableCell>
                <TableCell className="text-center border-b">
                  <Button 
                    onClick={() => deleteRow(row.rowId)} 
                    variant="ghost" 
                    size="sm" 
                    className="p-1 h-auto text-[#C53030] hover:text-[#9B4444] hover:bg-gray-100"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-white p-4 rounded-md border border-gray-200 mb-6">
        <h3 className="text-lg font-medium mb-3">수상 등급별 분포</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-3 border border-gray-200 rounded-md text-center bg-[rgba(144,238,144,0.3)]">
            <div className="text-sm text-gray-500 mb-1">A등급 (90점 이상)</div>
            <div className="text-xl font-bold text-[#28a745]">
              {resultsData.filter(r => r.grade === 'A').length}명
            </div>
          </div>
          <div className="p-3 border border-gray-200 rounded-md text-center bg-[rgba(135,206,250,0.3)]">
            <div className="text-sm text-gray-500 mb-1">B등급 (80-89점)</div>
            <div className="text-xl font-bold text-[#007bff]">
              {resultsData.filter(r => r.grade === 'B').length}명
            </div>
          </div>
          <div className="p-3 border border-gray-200 rounded-md text-center bg-[rgba(255,255,224,0.3)]">
            <div className="text-sm text-gray-500 mb-1">C등급 (70-79점)</div>
            <div className="text-xl font-bold text-[#f08c00]">
              {resultsData.filter(r => r.grade === 'C').length}명
            </div>
          </div>
          <div className="p-3 border border-gray-200 rounded-md text-center bg-[rgba(255,192,203,0.3)]">
            <div className="text-sm text-gray-500 mb-1">D등급 (69점 이하)</div>
            <div className="text-xl font-bold text-[#6c757d]">
              {resultsData.filter(r => r.grade === 'D').length}명
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-[#C53030] pt-10 flex justify-between items-end mb-6">
        <p className="text-sm text-[#1A1F2C] m-0 pb-2">작성일: {currentDate}</p>
        <div className="flex items-baseline gap-2">
          <label htmlFor="judge-signature" className="font-bold whitespace-nowrap">심사위원장:</label>
          <div className="w-[250px] relative">
            <Input 
              id="judge-signature"
              value={judgeSignature}
              onChange={(e) => setJudgeSignature(e.target.value)}
              className="border-0 border-b border-[#1A1F2C] rounded-none bg-transparent px-0 py-2"
            />
          </div>
          <span className="text-sm text-[#1A1F2C] whitespace-nowrap pb-2">(서명)</span>
        </div>
      </div>

      <div className="border-t border-[#C53030] pt-6 mt-10 flex justify-between items-center">
        <p className="text-xs text-[#8E9196] m-0">© The Asian Society of Calligraphic Arts (ASCA). All rights reserved.</p>
        <div className="flex gap-2">
          <Button 
            onClick={handlePdfDownload}
            className="bg-[#28a745] hover:bg-[#218838] text-white"
          >
            <FileDown className="w-4 h-4 mr-1" />
            PDF
          </Button>
          <Button 
            onClick={handleExportCsv}
            className="bg-[#007bff] hover:bg-[#0056b3] text-white"
          >
            <Save className="w-4 h-4 mr-1" />
            CSV
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsSection;
