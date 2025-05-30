import React, { useEffect, useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import './FeedbackSection.css';
import { Label as UILabel } from '@/components/ui/label';
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { FileDown, FileText } from 'lucide-react';

interface CategoryOpinion {
  id: string;
  name: string;
  opinion: string;
}

const FeedbackSection: React.FC = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [signatureName, setSignatureName] = useState('');
  
  const formRef = useRef<HTMLDivElement>(null);
  
  const [generalOpinion, setGeneralOpinion] = useState('');
  const [overallSummary, setOverallSummary] = useState('');
  const [isCsvGenerating, setIsCsvGenerating] = useState(false);
  const [isMarkdownGenerating, setIsMarkdownGenerating] = useState(false);
  const [categoryOpinions, setCategoryOpinions] = useState<CategoryOpinion[]>([
    { id: "hangul", name: "한글 부문", opinion: "" },
    { id: "hanja", name: "한문 부문", opinion: "" },
    { id: "modern", name: "현대서예 부문", opinion: "" },
    { id: "calligraphy", name: "캘리그라피 부문", opinion: "" },
    { id: "seal", name: "전각, 서각 부문", opinion: "" },
    { id: "oriental", name: "문인화/수묵화", opinion: "" }
  ]);

  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    setCurrentDate(formattedDate);
    
    loadAllFromLocalStorage();
  }, []);
  
  const loadAllFromLocalStorage = () => {
    setGeneralOpinion(loadFromLocalStorage('asca-general-opinion'));  
    setOverallSummary(loadFromLocalStorage('overall-summary'));
    
    const savedSignature = localStorage.getItem('asca-opinion-signature');
    if (savedSignature) {
      setSignatureName(savedSignature);
    }
    
    // 카테고리 의견 로드
    try {
      const savedCategoryOpinions = localStorage.getItem('asca-opinion-categories');
      if (savedCategoryOpinions) {
        const parsedCategoryOpinions = JSON.parse(savedCategoryOpinions);
        const updatedOpinions = categoryOpinions.map(category => {
          const savedCategory = parsedCategoryOpinions.find((item: CategoryOpinion) => item.id === category.id);
          return savedCategory ? { ...category, opinion: savedCategory.opinion } : category;
        });
        setCategoryOpinions(updatedOpinions);
      }
    } catch (error) {
      console.error("Error loading category opinions from localStorage:", error);
    }
  };
  
  const loadFromLocalStorage = (key: string) => {
    const savedValue = localStorage.getItem(`asca-opinion-${key}`);
    return savedValue || '';
  };
  
  const saveToLocalStorage = (id: string, value: string) => {
    localStorage.setItem(`asca-opinion-${id}`, value);
  };
  
  // 카테고리 의견 저장
  useEffect(() => {
    try {
      localStorage.setItem('asca-opinion-categories', JSON.stringify(categoryOpinions));
    } catch (error) {
      console.error("Error saving category opinions to localStorage:", error);
    }
  }, [categoryOpinions]);

  const handleGeneralOpinionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGeneralOpinion(e.target.value);
    saveToLocalStorage('asca-general-opinion', e.target.value);
  };

  const handleOverallSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOverallSummary(e.target.value);
    saveToLocalStorage('overall-summary', e.target.value);
  };

  const handleCategoryOpinionChange = (id: string, value: string) => {
    setCategoryOpinions(prevOpinions => 
      prevOpinions.map(opinion => 
        opinion.id === id ? { ...opinion, opinion: value } : opinion
      )
    );
  };
  
  // CSV 다운로드 기능 추가
  const handleCsvExport = () => {
    try {
      setIsCsvGenerating(true);
      
      // CSV 데이터 생성
      let csvContent = `\uFEFF`;
      
      csvContent += `전체 심사평\n`;
      csvContent += `"${generalOpinion}"\n\n`;
      
      csvContent += `부문별 심사의견\n`;
      categoryOpinions.forEach(category => {
        if (category.opinion) {
          csvContent += `${category.name},"${category.opinion}"\n`;
        }
      });
      
      csvContent += `\n심사총평 및 제언\n`;
      csvContent += `"${overallSummary}"\n\n`;
      
      csvContent += `작성일,${currentDate}\n`;
      csvContent += `심사위원장,${signatureName}`;
      
      // 파일 다운로드
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      const filename = `심사의견서_${new Date().getTime()}.csv`;
      
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
    } finally {
      setIsCsvGenerating(false);
    }
  };
  
  // 마크다운 다운로드 기능 추가
  const handleDownloadMarkdown = () => {
    try {
      setIsMarkdownGenerating(true);
      
      // 마크다운 콘텐츠 생성
      let markdownContent = `# 심사 의견서\n\n`;
      
      markdownContent += `## 전체 심사평\n\n`;
      markdownContent += `${generalOpinion}\n\n`;
      
      markdownContent += `## 부문별 심사의견\n\n`;
      categoryOpinions.forEach(category => {
        if (category.opinion) {
          markdownContent += `### ${category.name}\n\n`;
          markdownContent += `${category.opinion}\n\n`;
        }
      });
      
      markdownContent += `## 심사총평 및 제언\n\n`;
      markdownContent += `${overallSummary}\n\n`;
      
      markdownContent += `작성일: ${currentDate}\n\n`;
      markdownContent += `심사위원장: ${signatureName}`;
      
      // 파일 다운로드
      const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      
      // 파일명 생성
      const filename = `심사의견서_${new Date().getTime()}.md`;
      link.setAttribute('download', filename);
      
      // 링크 클릭하여 다운로드
      document.body.appendChild(link);
      link.click();
      
      // 임시 요소 제거
      setTimeout(() => {
        if (document.body.contains(link)) {
          document.body.removeChild(link);
        }
        URL.revokeObjectURL(url);
        setIsMarkdownGenerating(false);
      }, 100);
    } catch (error) {
      console.error('마크다운 내보내기 오류:', error);
      setIsMarkdownGenerating(false);
      alert('마크다운 파일을 생성하는 중 오류가 발생했습니다.');
    }
  };
  
  return (
    <section className="calligraphy-section" id="feedback-form" ref={formRef}>
      <h2 className="calligraphy-section-title">심사 의견서</h2>
      
      <div className="flex flex-col space-y-3 mb-5">
        <div>
          <UILabel htmlFor="general-opinion" className="text-base md:text-lg font-medium mb-1 block">전체 심사평</UILabel>
          <Textarea 
            id="general-opinion" 
            placeholder="작품에 대한 전체적인 심사평을 작성해주세요." 
            className="min-h-[120px] md:min-h-[150px] text-sm md:text-base"
            value={generalOpinion}
            onChange={handleGeneralOpinionChange}
          />
        </div>
      </div>
      
      <div className="mb-5">
        <UILabel className="text-base md:text-lg font-medium mb-2 block">부문별 심사의견</UILabel>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {categoryOpinions.map((category) => (
            <Card key={category.id} className="shadow-sm">
              <CardContent className="p-2 sm:p-3 md:p-4">
                <UILabel htmlFor={`category-${category.id}`} className="block font-medium text-xs sm:text-sm md:text-base mb-1 md:mb-2 text-foreground">
                  {category.name}
                </UILabel>
                <Textarea
                  id={`category-${category.id}`}
                  value={category.opinion}
                  onChange={(e) => handleCategoryOpinionChange(category.id, e.target.value)}
                  placeholder={`${category.name}에 대한 의견을 입력하세요.`}
                  className="min-h-[70px] sm:min-h-[80px] md:min-h-[100px] w-full text-xs sm:text-sm"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="mb-5">
        <UILabel htmlFor="overall-summary" className="text-base md:text-lg font-medium mb-1 block">심사총평 및 제언</UILabel>
        <Textarea 
          id="overall-summary" 
          placeholder="작품에 대한 총평 및 제언사항을 자세히 작성해주세요." 
          className="min-h-[120px] md:min-h-[150px] text-sm md:text-base"
          value={overallSummary}
          onChange={handleOverallSummaryChange}
        />
      </div>
      
      <div className="signature-section border-t border-primary pt-2 sm:pt-4 md:pt-6 mt-3 md:mt-6 flex flex-col sm:flex-row justify-between sm:items-end gap-2 sm:gap-0">
        <p className="text-xs text-foreground m-0 mb-1 sm:mb-0 pb-0 sm:pb-2">작성일: {currentDate}</p>
        <div className="flex flex-col sm:flex-row items-start sm:items-baseline gap-1 sm:gap-2 w-full sm:w-auto">
          <Label htmlFor="signature-input" className="font-bold whitespace-nowrap text-foreground text-sm mb-1 sm:mb-0">심사위원장:</Label>
          <div className="w-full sm:w-[200px] md:w-[250px] relative">
            <Input 
              id="signature-input"
              value={signatureName}
              onChange={(e) => setSignatureName(e.target.value)}
              className="border-0 border-b border-input rounded-none bg-transparent px-0 py-1 text-sm"
              placeholder="이름을 입력하세요"
            />
          </div>
          <span className="text-xs sm:text-sm text-foreground whitespace-nowrap pb-0 sm:pb-2 mt-1 sm:mt-0">(서명)</span>
        </div>
      </div>

      <div className="button-container border-t border-primary pt-2 sm:pt-4 md:pt-6 mt-2 sm:mt-4 flex flex-col-reverse sm:flex-row justify-between items-center gap-2 sm:gap-0">
        <p className="text-[9px] sm:text-xs text-muted-foreground m-0 text-center sm:text-left w-full sm:w-auto mt-2 sm:mt-0">
          © {new Date().getFullYear()} 동양서예협회 (The Asian Society of Calligraphic Arts)
        </p>
        <div className="flex flex-wrap gap-2 justify-center w-full sm:w-auto sm:justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleCsvExport}
            disabled={isCsvGenerating}
            className="flex items-center px-2 py-1 h-auto text-xs sm:text-sm"
          >
            <FileDown className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span>{isCsvGenerating ? "CSV 생성 중..." : "CSV 다운로드"}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleDownloadMarkdown}
            disabled={isMarkdownGenerating}
            className="flex items-center px-2 py-1 h-auto text-xs sm:text-sm"
          >
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
            <span>{isMarkdownGenerating ? "마크다운 생성 중..." : "마크다운 다운로드"}</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeedbackSection;
