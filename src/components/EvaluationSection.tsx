
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileDown, Save } from 'lucide-react';

const EvaluationSection = () => {
  const [seriesNumber, setSeriesNumber] = useState('');
  const [category, setCategory] = useState('');
  const [artistName, setArtistName] = useState('');
  const [workTitle, setWorkTitle] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [judgeSignature, setJudgeSignature] = useState('');
  
  // Score state 
  const [pointsScore, setPointsScore] = useState<number | null>(null);
  const [structureScore, setStructureScore] = useState<number | null>(null);
  const [compositionScore, setCompositionScore] = useState<number | null>(null);
  const [harmonyScore, setHarmonyScore] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState<number>(0);

  // Generate series number on component mount
  useEffect(() => {
    generateSeriesNumber();
    setFormattedCurrentDate();
  }, []);

  // Calculate total score whenever any score changes
  useEffect(() => {
    calculateTotalScore();
  }, [pointsScore, structureScore, compositionScore, harmonyScore]);

  const generateSeriesNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    setSeriesNumber(`${year}-${month}-${day}-${hours}${minutes}${seconds}`);
  };

  const setFormattedCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    setCurrentDate(`${year}년 ${month}월 ${day}일`);
  };

  const calculateTotalScore = () => {
    const points = pointsScore || 0;
    const structure = structureScore || 0;
    const composition = compositionScore || 0;
    const harmony = harmonyScore || 0;
    setTotalScore(points + structure + composition + harmony);
  };

  const handleScoreClick = (category: string, value: number) => {
    switch(category) {
      case 'points':
        setPointsScore(value);
        break;
      case 'structure':
        setStructureScore(value);
        break;
      case 'composition':
        setCompositionScore(value);
        break;
      case 'harmony':
        setHarmonyScore(value);
        break;
      default:
        break;
    }
  };

  const handlePdfDownload = () => {
    // PDF generation would be implemented here
    alert('PDF 다운로드 기능은 추후 구현될 예정입니다.');
  };

  const handleCsvExport = () => {
    // CSV export would be implemented here
    alert('CSV 내보내기 기능은 추후 구현될 예정입니다.');
  };

  // Render score buttons for a specific range
  const renderScoreRange = (category: string, min: number, max: number) => {
    const buttons = [];
    for (let i = min; i <= max; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handleScoreClick(category, i)}
          className={`w-8 h-8 flex items-center justify-center text-xs border border-gray-300 rounded-md hover:bg-[#C53030] hover:text-white hover:border-[#C53030] transition-colors 
            ${
              (category === 'points' && pointsScore === i) ||
              (category === 'structure' && structureScore === i) ||
              (category === 'composition' && compositionScore === i) ||
              (category === 'harmony' && harmonyScore === i)
                ? 'bg-[#C53030] text-white border-[#C53030]'
                : 'bg-white'
            }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <section className="calligraphy-section" id="evaluation-score-form">
      <h2 className="calligraphy-section-title">심사표</h2>
      
      <div className="form-header mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="series-number" className="block text-sm font-medium text-gray-700 mb-1">심사번호</Label>
            <Input 
              id="series-number"
              value={seriesNumber}
              readOnly
              className="w-full bg-[#e9ecef] cursor-not-allowed"
            />
          </div>
          <div>
            <Label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">부 문</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="부문 선택..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="한글서예">한글서예</SelectItem>
                <SelectItem value="한문서예">한문서예</SelectItem>
                <SelectItem value="현대서예">현대서예</SelectItem>
                <SelectItem value="캘리그라피">캘리그라피</SelectItem>
                <SelectItem value="전각・서각">전각・서각</SelectItem>
                <SelectItem value="문인화・동양화・민화">문인화・동양화・민화</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="artist-name" className="block text-sm font-medium text-gray-700 mb-1">작가이름</Label>
            <Input 
              id="artist-name"
              value={artistName}
              onChange={(e) => setArtistName(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="work-title" className="block text-sm font-medium text-gray-700 mb-1">작품명제</Label>
            <Input 
              id="work-title"
              value={workTitle}
              onChange={(e) => setWorkTitle(e.target.value)}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="criteria-section mb-6 border border-[#88A891] bg-white rounded-md p-4">
        <h3 className="text-lg font-medium mb-3 text-[#9B4444] border-b border-[#88A891] pb-2">심사기준</h3>
        <ol className="ml-5 pl-2 mb-4">
          <li className="mb-1">옛 법첩 기준 작품을 선정하되 서체별 구성, 여백, 조화, 묵색에 중점을 두고 작품성의 우열을 결정한다.</li>
          <li className="mb-1">점획ㆍ결구ㆍ장법ㆍ조화의 완성미를 심사하되 아래 표의 여러 요소들을 비교 심사한다.</li>
        </ol>
        
        <Table className="mb-4 border border-gray-300">
          <TableHeader>
            <TableRow>
              <TableHead className="text-center bg-[#f8f9fa] border border-gray-300">점획(點劃)</TableHead>
              <TableHead className="text-center bg-[#f8f9fa] border border-gray-300">결구(結構)</TableHead>
              <TableHead className="text-center bg-[#f8f9fa] border border-gray-300">장법(章法)</TableHead>
              <TableHead className="text-center bg-[#f8f9fa] border border-gray-300">조화(調和)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-center bg-white border border-gray-300">방원(方圓)</TableCell>
              <TableCell className="text-center bg-white border border-gray-300">대소(大小)</TableCell>
              <TableCell className="text-center bg-white border border-gray-300">농담(濃淡)</TableCell>
              <TableCell className="text-center bg-white border border-gray-300">기운(氣韻)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center bg-white border border-gray-300">곡직(曲直)</TableCell>
              <TableCell className="text-center bg-white border border-gray-300">소밀(疏密)</TableCell>
              <TableCell className="text-center bg-white border border-gray-300">강유(剛柔)</TableCell>
              <TableCell className="text-center bg-white border border-gray-300">아속(雅俗)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center bg-white border border-gray-300">경중(輕重)</TableCell>
              <TableCell className="text-center bg-white border border-gray-300">허실(虛實)</TableCell>
              <TableCell className="text-center bg-white border border-gray-300">완급(緩急)</TableCell>
              <TableCell className="text-center bg-white border border-gray-300">미추(美醜)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center bg-white border border-gray-300">장로(藏露)</TableCell>
              <TableCell className="text-center bg-white border border-gray-300">향배(向背)</TableCell>
              <TableCell className="text-center bg-white border border-gray-300">여백(餘白)</TableCell>
              <TableCell className="text-center bg-white border border-gray-300">통변(通變)</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="text-center bg-white border border-gray-300">형질(形質)</TableCell>
              <TableCell className="text-center bg-white border border-gray-300">호응(呼應)</TableCell>
              <TableCell className="text-center bg-white border border-gray-300">구성(構成)</TableCell>
              <TableCell className="text-center bg-white border border-gray-300">창신(創新)</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="mb-6">
        <Table className="border border-gray-300">
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2} className="text-center bg-[#f8f9fa] border border-gray-300 w-[20%]">평가항목</TableHead>
              <TableHead colSpan={5} className="text-center bg-[#f8f9fa] border border-gray-300">득점 범위</TableHead>
              <TableHead rowSpan={2} className="text-center bg-[#f8f9fa] border border-gray-300 w-[15%]">획득점수</TableHead>
            </TableRow>
            <TableRow>
              <TableHead className="text-center bg-[#f8f9fa] border border-gray-300 w-[12%] text-sm">1-5</TableHead>
              <TableHead className="text-center bg-[#f8f9fa] border border-gray-300 w-[12%] text-sm">6-10</TableHead>
              <TableHead className="text-center bg-[#f8f9fa] border border-gray-300 w-[12%] text-sm">11-15</TableHead>
              <TableHead className="text-center bg-[#f8f9fa] border border-gray-300 w-[12%] text-sm">16-20</TableHead>
              <TableHead className="text-center bg-[#f8f9fa] border border-gray-300 w-[12%] text-sm">21-25</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="text-center border border-gray-300">점획(點劃)</TableCell>
              <TableCell className="text-center border border-gray-300 p-1">
                <div className="flex justify-center space-x-1">{renderScoreRange('points', 1, 5)}</div>
              </TableCell>
              <TableCell className="text-center border border-gray-300 p-1">
                <div className="flex justify-center space-x-1">{renderScoreRange('points', 6, 10)}</div>
              </TableCell>
              <TableCell className="text-center border border-gray-300 p-1">
                <div className="flex justify-center space-x-1">{renderScoreRange('points', 11, 15)}</div>
              </TableCell>
              <TableCell className="text-center border border-gray-300 p-1">
                <div className="flex justify-center space-x-1">{renderScoreRange('points', 16, 20)}</div>
              </TableCell>
              <TableCell className="text-center border border-gray-300 p-1">
                <div className="flex justify-center space-x-1">{renderScoreRange('points', 21, 25)}</div>
              </TableCell>
              <TableCell className="text-center border border-gray-300">
                <Input 
                  value={pointsScore !== null ? pointsScore.toString() : ''} 
                  readOnly
                  className="text-center font-bold bg-[#e9ecef] w-[80%] mx-auto"
                />
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell className="text-center border border-gray-300">결구(結構)</TableCell>
              <TableCell className="text-center border border-gray-300 p-1">
                <div className="flex justify-center space-x-1">{renderScoreRange('structure', 1, 5)}</div>
              </TableCell>
              <TableCell className="text-center border border-gray-300 p-1">
                <div className="flex justify-center space-x-1">{renderScoreRange('structure', 6, 10)}</div>
              </TableCell>
              <TableCell className="text-center border border-gray-300 p-1">
                <div className="flex justify-center space-x-1">{renderScoreRange('structure', 11, 15)}</div>
              </TableCell>
              <TableCell className="text-center border border-gray-300 p-1">
                <div className="flex justify-center space-x-1">{renderScoreRange('structure', 16, 20)}</div>
              </TableCell>
              <TableCell className="text-center border border-gray-300 p-1">
                <div className="flex justify-center space-x-1">{renderScoreRange('structure', 21, 25)}</div>
              </TableCell>
              <TableCell className="text-center border border-gray-300">
                <Input 
                  value={structureScore !== null ? structureScore.toString() : ''} 
                  readOnly
                  className="text-center font-bold bg-[#e9ecef] w-[80%] mx-auto"
                />
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell className="text-center border border-gray-300">장법(章法)</TableCell>
              <TableCell className="text-center border border-gray-300 p-1">
                <div className="flex justify-center space-x-1">{renderScoreRange('composition', 1, 5)}</div>
              </TableCell>
              <TableCell className="text-center border border-gray-300 p-1">
                <div className="flex justify-center space-x-1">{renderScoreRange('composition', 6, 10)}</div>
              </TableCell>
              <TableCell className="text-center border border-gray-300 p-1">
                <div className="flex justify-center space-x-1">{renderScoreRange('composition', 11, 15)}</div>
              </TableCell>
              <TableCell className="text-center border border-gray-300 p-1">
                <div className="flex justify-center space-x-1">{renderScoreRange('composition', 16, 20)}</div>
              </TableCell>
              <TableCell className="text-center border border-gray-300 p-1">
                <div className="flex justify-center space-x-1">{renderScoreRange('composition', 21, 25)}</div>
              </TableCell>
              <TableCell className="text-center border border-gray-300">
                <Input 
                  value={compositionScore !== null ? compositionScore.toString() : ''} 
                  readOnly
                  className="text-center font-bold bg-[#e9ecef] w-[80%] mx-auto"
                />
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell className="text-center border border-gray-300">조화(調和)</TableCell>
              <TableCell className="text-center border border-gray-300 p-1">
                <div className="flex justify-center space-x-1">{renderScoreRange('harmony', 1, 5)}</div>
              </TableCell>
              <TableCell className="text-center border border-gray-300 p-1">
                <div className="flex justify-center space-x-1">{renderScoreRange('harmony', 6, 10)}</div>
              </TableCell>
              <TableCell className="text-center border border-gray-300 p-1">
                <div className="flex justify-center space-x-1">{renderScoreRange('harmony', 11, 15)}</div>
              </TableCell>
              <TableCell className="text-center border border-gray-300 p-1">
                <div className="flex justify-center space-x-1">{renderScoreRange('harmony', 16, 20)}</div>
              </TableCell>
              <TableCell className="text-center border border-gray-300 p-1">
                <div className="flex justify-center space-x-1">{renderScoreRange('harmony', 21, 25)}</div>
              </TableCell>
              <TableCell className="text-center border border-gray-300">
                <Input 
                  value={harmonyScore !== null ? harmonyScore.toString() : ''} 
                  readOnly
                  className="text-center font-bold bg-[#e9ecef] w-[80%] mx-auto"
                />
              </TableCell>
            </TableRow>
            
            <TableRow>
              <TableCell colSpan={6} className="text-right font-bold bg-[#eee] border border-gray-300">
                총점
              </TableCell>
              <TableCell className="text-center border border-gray-300">
                <Input 
                  value={totalScore.toString()} 
                  readOnly
                  className="text-center font-bold bg-[#e9ecef] w-[80%] mx-auto text-lg"
                />
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      <div className="signature-section border-t border-[#C53030] pt-10 flex justify-between items-end">
        <p className="text-sm text-[#1A1F2C] m-0 pb-2">작성일: {currentDate}</p>
        <div className="flex items-baseline gap-2">
          <Label htmlFor="judge-signature" className="font-bold whitespace-nowrap">심사위원:</Label>
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

      <div className="button-container border-t border-[#C53030] pt-6 mt-10 flex justify-between items-center">
        <p className="text-xs text-[#8E9196] m-0">© The Asian Society of Calligraphic Arts (ASCA). All rights reserved.</p>
        <div className="flex gap-2">
          <Button 
            onClick={handlePdfDownload}
            className="bg-[#28a745] hover:bg-[#218838]"
          >
            <FileDown className="w-4 h-4 mr-1" />
            PDF 다운로드
          </Button>
          <Button 
            onClick={handleCsvExport}
            className="bg-[#007bff] hover:bg-[#0056b3]"
          >
            <Save className="w-4 h-4 mr-1" />
            CSV 내보내기
          </Button>
        </div>
      </div>
    </section>
  );
};

export default EvaluationSection;
