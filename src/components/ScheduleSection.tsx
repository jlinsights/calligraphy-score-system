
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Save, FileDown } from 'lucide-react';

const ScheduleSection = () => {
  const [judgeChair, setJudgeChair] = useState('');
  const [evalDate, setEvalDate] = useState('');
  const [evalCategory, setEvalCategory] = useState('');
  const [judges, setJudges] = useState(['', '', '']);
  const [planContent, setPlanContent] = useState('');
  const [judgeSignature, setJudgeSignature] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Set default eval date to today
    const today = new Date().toISOString().split('T')[0];
    if (!evalDate) setEvalDate(today);
    
    // Set formatted current date for signature section
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    setCurrentDate(`${year}년 ${month}월 ${day}일`);
  }, [evalDate]);

  const handleJudgeChange = (index: number, value: string) => {
    const updatedJudges = [...judges];
    updatedJudges[index] = value;
    setJudges(updatedJudges);
  };

  const handlePdfDownload = () => {
    // PDF generation would be implemented here
    alert('PDF 다운로드 기능은 추후 구현될 예정입니다.');
  };

  const handleCsvExport = () => {
    // CSV export would be implemented here
    alert('CSV 내보내기 기능은 추후 구현될 예정입니다.');
  };

  return (
    <section className="calligraphy-section" id="evaluation-plan-form">
      <h2 className="calligraphy-section-title">심사계획서</h2>
      
      <div className="form-header mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="judge-chair" className="block text-sm font-medium text-gray-700 mb-1">심사위원장</Label>
            <Input 
              id="judge-chair"
              value={judgeChair}
              onChange={(e) => setJudgeChair(e.target.value)}
              placeholder="위원장 이름"
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="eval-date" className="block text-sm font-medium text-gray-700 mb-1">심사 일시</Label>
            <Input 
              id="eval-date"
              type="date"
              value={evalDate}
              onChange={(e) => setEvalDate(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="eval-category" className="block text-sm font-medium text-gray-700 mb-1">심사 부문</Label>
            <Select value={evalCategory} onValueChange={setEvalCategory}>
              <SelectTrigger id="eval-category">
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
      </div>

      <div className="judge-row-container border-b border-[#E4D7C5] pb-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {judges.map((judge, index) => (
            <div key={index}>
              <Label htmlFor={`judge-${index+1}`} className="block text-sm font-medium text-gray-700 mb-1">
                심사위원{index+1}
              </Label>
              <Input 
                id={`judge-${index+1}`}
                value={judge}
                onChange={(e) => handleJudgeChange(index, e.target.value)}
                placeholder="위원 이름"
                className="w-full"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="form-section mb-6 border-b border-[#E4D7C5] pb-4">
        <h3 className="text-xl font-medium mb-2 text-[#1A1F2C] border-b border-[#C53030] pb-2 inline-block">심사 계획 내용</h3>
        <div className="plan-content">
          <Textarea 
            id="plan-content-textarea"
            value={planContent}
            onChange={(e) => setPlanContent(e.target.value)}
            placeholder="심사 계획 내용을 작성해 주세요."
            rows={10}
            className="w-full border border-gray-300 p-4 bg-white min-h-[150px]"
          />
        </div>
      </div>

      <div className="form-section mb-6 border-b border-[#E4D7C5] pb-4">
        <h3 className="text-xl font-medium mb-2 text-[#1A1F2C] border-b border-[#C53030] pb-2 inline-block">심사 기준</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 mb-4">
            <thead>
              <tr className="bg-[#f8f9fa]">
                <th className="border border-gray-300 p-2 text-center">점획(點劃)</th>
                <th className="border border-gray-300 p-2 text-center">결구(結構)</th>
                <th className="border border-gray-300 p-2 text-center">장법(章法)</th>
                <th className="border border-gray-300 p-2 text-center">조화(調和)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 text-center">방원(方圓)</td>
                <td className="border border-gray-300 p-2 text-center">대소(大小)</td>
                <td className="border border-gray-300 p-2 text-center">농담(濃淡)</td>
                <td className="border border-gray-300 p-2 text-center">기운(氣韻)</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 text-center">곡직(曲直)</td>
                <td className="border border-gray-300 p-2 text-center">소밀(疏密)</td>
                <td className="border border-gray-300 p-2 text-center">강유(剛柔)</td>
                <td className="border border-gray-300 p-2 text-center">아속(雅俗)</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 text-center">경중(輕重)</td>
                <td className="border border-gray-300 p-2 text-center">허실(虛實)</td>
                <td className="border border-gray-300 p-2 text-center">완급(緩急)</td>
                <td className="border border-gray-300 p-2 text-center">미추(美醜)</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 text-center">장로(藏露)</td>
                <td className="border border-gray-300 p-2 text-center">향배(向背)</td>
                <td className="border border-gray-300 p-2 text-center">여백(餘白)</td>
                <td className="border border-gray-300 p-2 text-center">통변(通變)</td>
              </tr>
              <tr className="bg-white">
                <td className="border border-gray-300 p-2 text-center">형질(形質)</td>
                <td className="border border-gray-300 p-2 text-center">호응(呼應)</td>
                <td className="border border-gray-300 p-2 text-center">구성(構成)</td>
                <td className="border border-gray-300 p-2 text-center">창신(創新)</td>
              </tr>
            </tbody>
          </table>
          
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr>
                <th className="border border-gray-300 p-2 text-center bg-[#f8f9fa] w-[100px]">등급 기준</th>
                <td className="border border-gray-300 p-2 text-left pl-4 bg-white">
                  A 등급: 90점 이상<br/> 
                  B 등급: 80점 이상<br/> 
                  C 등급: 70점 이상<br/> 
                  D 등급: 70점 미만
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="signature-section border-t border-[#C53030] pt-10 flex justify-between items-end">
        <p className="text-sm text-[#1A1F2C] m-0 pb-2">작성일: {currentDate}</p>
        <div className="flex items-baseline gap-2">
          <Label htmlFor="judge-signature" className="font-bold whitespace-nowrap">심사위원장:</Label>
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
            PDF
          </Button>
          <Button 
            onClick={handleCsvExport}
            className="bg-[#007bff] hover:bg-[#0056b3]"
          >
            <Save className="w-4 h-4 mr-1" />
            CSV
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ScheduleSection;
