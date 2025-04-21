import React, { useEffect, useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './FeedbackSection.css';
import { FileDown, Save, FileText, FileOutput } from 'lucide-react';
import SectionFooter from "@/components/ui/section-footer";
import { generatePdfFromElement } from '@/utils/pdfUtils';
import TurndownService from 'turndown';
import { Label as UILabel } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Send } from 'lucide-react';

const FeedbackSection: React.FC = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [signatureName, setSignatureName] = useState('');
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState<boolean>(false);
  const [isExportingCSV, setIsExportingCSV] = useState<boolean>(false);
  const [isExportingMarkdown, setIsExportingMarkdown] = useState<boolean>(false);
  const [isExportingPdf, setIsExportingPdf] = useState<boolean>(false);
  
  const formRef = useRef<HTMLDivElement>(null);
  
  const [generalOpinion, setGeneralOpinion] = useState('');
  const [pointsOpinion, setPointsOpinion] = useState('');
  const [structureOpinion, setStructureOpinion] = useState('');
  const [compositionOpinion, setCompositionOpinion] = useState('');
  const [harmonyOpinion, setHarmonyOpinion] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [category, setCategory] = useState('');
  const [artistName, setArtistName] = useState('');
  const [workTitle, setWorkTitle] = useState('');
  const [workNumber, setWorkNumber] = useState('');
  
  const [judgeSignature, setJudgeSignature] = useState('');

  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setCurrentDate(formattedDate);
    
    const datePart = formattedDate.replace(/-/g, '');
    const randomPart = Math.floor(1000 + Math.random() * 9000);
    setSerialNumber(`FD-${datePart}-${randomPart}`);
    
    loadAllFromLocalStorage();
  }, []);
  
  const loadAllFromLocalStorage = () => {
    setGeneralOpinion(loadFromLocalStorage('asca-general-opinion'));
    setPointsOpinion(loadFromLocalStorage('asca-points-opinion'));
    setStructureOpinion(loadFromLocalStorage('asca-structure-opinion'));
    setCompositionOpinion(loadFromLocalStorage('asca-composition-opinion'));
    setHarmonyOpinion(loadFromLocalStorage('asca-harmony-opinion'));
    
    const savedSignature = localStorage.getItem('asca-opinion-signature');
    if (savedSignature) {
      setSignatureName(savedSignature);
    }
  };
  
  const loadFromLocalStorage = (key: string) => {
    const savedValue = localStorage.getItem(`asca-opinion-${key}`);
    return savedValue || '';
  };
  
  const saveToLocalStorage = (id: string, value: string) => {
    localStorage.setItem(`asca-opinion-${id}`, value);
  };
  
  const updatePrintContent = () => {
    if (!formRef.current) return;
    
    const textareas = formRef.current.querySelectorAll('textarea');
    textareas.forEach((textarea) => {
      const textareaId = textarea.id;
      const printContentId = textareaId + '-print';
      const printContent = document.getElementById(printContentId);
      
      if (printContent) {
        printContent.textContent = (textarea as HTMLTextAreaElement).value;
      }
    });
  };
  
  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      setIsPdfGenerating(true);
      
      if (!formRef.current) {
        alert('폼 정보를 가져올 수 없습니다.');
        setIsGeneratingPDF(false);
        setIsPdfGenerating(false);
        return;
      }
      
      const form = formRef.current;
      
      // PDF 생성을 위한 스타일 정리
      const buttonContainers = form.querySelectorAll('.button-container');
      const tempStyles: { el: HTMLElement; display: string }[] = [];
      
      // 버튼 컨테이너 숨기기 및 원래 스타일 저장
      buttonContainers.forEach(el => {
        const htmlEl = el as HTMLElement;
        tempStyles.push({ el: htmlEl, display: htmlEl.style.display });
        htmlEl.style.display = 'none';
      });
      
      // PDF 생성을 위한 클래스 추가
      form.classList.add('pdf-generating');
      
      // 파일명 생성
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const filename = `심사의견서_${year}${month}${day}.pdf`;
      
      // 텍스트 내용 업데이트
      updatePrintContent();
      
      // PDF 생성
      await generatePdfFromElement(
        form,
        filename,
        '심사의견서',
        currentDate,
        signatureName
      );
      
      // 원래 스타일로 복원
      tempStyles.forEach(item => {
        item.el.style.display = item.display;
      });
      form.classList.remove('pdf-generating');
      
      alert('심사의견서가 PDF로 저장되었습니다.');
    } catch (error) {
      console.error('PDF 생성 중 오류 발생:', error);
      alert('PDF 생성 중 오류가 발생했습니다.');
    } finally {
      setIsGeneratingPDF(false);
      setIsPdfGenerating(false);
    }
  };
  
  const handleExportCSV = () => {
    try {
      setIsExportingCSV(true);
      
      // CSV 헤더 생성
      const headers = [
        '작성일', 
        '심사위원장', 
        '전체 심사평', 
        '점획(點劃)', 
        '결구(結構)', 
        '장법(章法)', 
        '조화(調和)', 
        '심사총평 및 제언',
        '등급결정 기준',
        '동점자 처리방안',
        '심사결과 확정'
      ];
      
      // 등급결정 기준 데이터
      const gradingCriteria = 
        '90점 이상: 대상 및 최우수상 후보, ' +
        '85점 이상: 우수상 후보, ' +
        '80점 이상: 특선 후보, ' +
        '75점 이상: 입선 후보';
      
      // 동점자 처리 데이터
      const tiebreakCriteria = 
        '조화(調和) 점수가 높은 작품우선, ' +
        '장법(章法) 점수가 높은 작품우선, ' +
        '심사위원 간 협의를 통한 결정';
      
      // 심사결과 확정 데이터
      const resultConfirmation = 
        '1. 심사위원장은 종합심사 결과를 이사장에게 전달합니다. ' +
        '2. 이사회는 심사결과를 검토하고 최종 승인합니다. ' +
        '3. 확정된 심사결과는 수상자에게 개별 통보하며, 협회 홈페이지에 게시합니다.';
      
      // 데이터 생성
      const data = [
        currentDate,
        signatureName,
        generalOpinion,
        pointsOpinion,
        structureOpinion,
        compositionOpinion,
        harmonyOpinion,
        gradingCriteria,
        tiebreakCriteria,
        resultConfirmation
      ].map(text => `"${text?.replace(/"/g, '""') || ''}"`); // CSV 이스케이핑 처리
      
      // CSV 파일 내용 생성
      const BOM = '\uFEFF'; // Excel에서 UTF-8 인코딩을 올바르게 인식하기 위한 BOM 추가
      const csvContent = BOM + [
        headers.join(','),
        data.join(',')
      ].join('\n');
      
      // 파일 다운로드
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      
      // 현재 날짜로 파일명 생성
      const today = new Date();
      const dateStr = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`;
      link.setAttribute('download', `심사의견서_${dateStr}.csv`);
      
      // 링크 클릭하여 다운로드
      document.body.appendChild(link);
      link.click();
      
      // 임시 요소 제거 (타임아웃으로 지연 처리)
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
        setIsExportingCSV(false);
        alert('심사의견을 CSV 파일로 내보냈습니다.');
      }, 100);
    } catch (error) {
      console.error('CSV 내보내기 오류:', error);
      setIsExportingCSV(false);
      alert('CSV 파일을 생성하는 중 오류가 발생했습니다.');
    }
  };

  const handleDownloadMarkdown = async () => {
    try {
      setIsExportingMarkdown(true);
      const turndownService = new TurndownService();

      // 현재 날짜와 시간 포맷
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0];
      
      // 마크다운 컨텐츠 생성
      let markdownContent = `# 서예 작품 피드백\n\n`;
      markdownContent += `## 작품 정보\n\n`;
      markdownContent += `- **일련 번호**: ${serialNumber || '미지정'}\n`;
      markdownContent += `- **평가 일자**: ${currentDate || new Date().toLocaleDateString()}\n`;
      markdownContent += `- **부문**: ${category || '미지정'}\n`;
      markdownContent += `- **작가명**: ${artistName || '미지정'}\n`;
      markdownContent += `- **작품명**: ${workTitle || '미지정'}\n\n`;
      
      markdownContent += `## 종합 의견\n\n${generalOpinion || '(의견이 없습니다)'}\n\n`;
      
      markdownContent += `## 세부 평가\n\n`;
      markdownContent += `### 점획(點劃)\n\n${pointsOpinion || '(의견이 없습니다)'}\n\n`;
      markdownContent += `### 결구(結構)\n\n${structureOpinion || '(의견이 없습니다)'}\n\n`;
      markdownContent += `### 장법(章法)\n\n${compositionOpinion || '(의견이 없습니다)'}\n\n`;
      markdownContent += `### 조화(調和)\n\n${harmonyOpinion || '(의견이 없습니다)'}\n\n`;
      
      markdownContent += `## 심사위원\n\n`;
      markdownContent += `${judgeSignature || '미지정'}\n\n`;
      markdownContent += `---\n\n`;
      markdownContent += `생성일시: ${dateStr} ${timeStr}`;
      
      // 파일 다운로드
      const blob = new Blob([markdownContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `서예심사_피드백_${serialNumber || '미지정'}_${dateStr}.md`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Markdown 다운로드 오류:', error);
    } finally {
      setIsExportingMarkdown(false);
    }
  };

  return (
    <section className="calligraphy-section" id="feedback-form" ref={formRef}>
      <h2 className="calligraphy-section-title">심사 의견서</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex flex-col space-y-2">
          <UILabel htmlFor="work-number" className="font-medium">작품 번호</UILabel>
          <Input 
            id="work-number" 
            className="max-w-xs" 
            value={serialNumber}
            onChange={(e) => setSerialNumber(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col space-y-2">
          <UILabel htmlFor="category" className="font-medium">심사 부문</UILabel>
          <Input 
            id="category" 
            className="max-w-xs" 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col space-y-2">
          <UILabel htmlFor="artist-name" className="font-medium">작가명</UILabel>
          <Input 
            id="artist-name" 
            className="max-w-xs" 
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col space-y-2">
          <UILabel htmlFor="work-title" className="font-medium">작품명</UILabel>
          <Input 
            id="work-title" 
            className="max-w-xs"
            value={workTitle}
            onChange={(e) => setWorkTitle(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex flex-col space-y-4 mb-6">
        <div>
          <UILabel htmlFor="general-opinion" className="text-lg font-medium mb-1 block">종합 의견</UILabel>
          <Textarea 
            id="general-opinion" 
            placeholder="작품에 대한 종합적인 의견을 작성해주세요." 
            className="min-h-[150px]"
            value={generalOpinion}
            onChange={(e) => setGeneralOpinion(e.target.value)}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <UILabel htmlFor="points-opinion" className="text-lg font-medium mb-1 block">점획(點劃)</UILabel>
          <Textarea 
            id="points-opinion" 
            placeholder="획의 형태, 필력, 운필에 대한 의견을 작성해주세요." 
            className="min-h-[120px]"
            value={pointsOpinion}
            onChange={(e) => setPointsOpinion(e.target.value)}
          />
        </div>
        
        <div>
          <UILabel htmlFor="structure-opinion" className="text-lg font-medium mb-1 block">결구(結構)</UILabel>
          <Textarea 
            id="structure-opinion" 
            placeholder="글자의 구조와 균형, 자간에 대한 의견을 작성해주세요." 
            className="min-h-[120px]"
            value={structureOpinion}
            onChange={(e) => setStructureOpinion(e.target.value)}
          />
        </div>
        
        <div>
          <UILabel htmlFor="composition-opinion" className="text-lg font-medium mb-1 block">장법(章法)</UILabel>
          <Textarea 
            id="composition-opinion" 
            placeholder="작품의 전체적인 구도와 여백 활용에 대한 의견을 작성해주세요." 
            className="min-h-[120px]"
            value={compositionOpinion}
            onChange={(e) => setCompositionOpinion(e.target.value)}
          />
        </div>
        
        <div>
          <UILabel htmlFor="harmony-opinion" className="text-lg font-medium mb-1 block">조화(調和)</UILabel>
          <Textarea 
            id="harmony-opinion" 
            placeholder="작품의 통일성, 조화, 개성에 대한 의견을 작성해주세요." 
            className="min-h-[120px]"
            value={harmonyOpinion}
            onChange={(e) => setHarmonyOpinion(e.target.value)}
          />
        </div>
      </div>
      
      <div className="button-container">
        <Button
          onClick={handleDownloadPDF}
          className="py-5 px-8 text-lg"
          disabled={isExportingPdf}
        >
          {isExportingPdf ? '생성 중...' : 'PDF 다운로드'}
          <FileDown className="ml-2 h-5 w-5" />
        </Button>
        
        <Button
          onClick={handleExportCSV}
          className="py-5 px-8 text-lg bg-emerald-600 hover:bg-emerald-700"
          disabled={isExportingCSV}
        >
          {isExportingCSV ? '내보내는 중...' : 'CSV 내보내기'}
          <FileText className="ml-2 h-5 w-5" />
        </Button>
        
        <Button
          onClick={handleDownloadMarkdown}
          className="py-5 px-8 text-lg bg-emerald-600 hover:bg-emerald-700"
          disabled={isExportingMarkdown}
        >
          {isExportingMarkdown ? '내보내는 중...' : '마크다운 내보내기'}
          <FileOutput className="ml-2 h-5 w-5" />
        </Button>
      </div>
      
      <SectionFooter
        currentDate={currentDate}
        signature={signatureName}
        setSignature={setSignatureName}
        handleCsvExport={handleExportCSV}
        handleMarkdownDownload={handleDownloadMarkdown}
        isCsvGenerating={isExportingCSV}
        isMarkdownGenerating={isExportingMarkdown}
      />
    </section>
  );
};

export default FeedbackSection;
