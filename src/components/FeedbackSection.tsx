import React, { useEffect, useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import './FeedbackSection.css';
import { Label as UILabel } from '@/components/ui/label';
import { Card, CardContent } from "@/components/ui/card";
import SectionFooter from "@/components/ui/section-footer";

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
  const [serialNumber, setSerialNumber] = useState('');
  const [category, setCategory] = useState('');
  const [artistName, setArtistName] = useState('');
  const [workTitle, setWorkTitle] = useState('');
  const [categoryOpinions, setCategoryOpinions] = useState<CategoryOpinion[]>([
    { id: "creativity", name: "창의성(創意性)", opinion: "" },
    { id: "authenticity", name: "진정성(眞情性)", opinion: "" },
    { id: "skill", name: "기법성(技法性)", opinion: "" },
    { id: "completeness", name: "완성도(完成度)", opinion: "" },
    { id: "personality", name: "개성(個性)", opinion: "" },
    { id: "originality", name: "독창성(獨創性)", opinion: "" }
  ]);

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

  const handleCategoryOpinionChange = (id: string, value: string) => {
    setCategoryOpinions(prevOpinions => 
      prevOpinions.map(opinion => 
        opinion.id === id ? { ...opinion, opinion: value } : opinion
      )
    );
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
          <UILabel htmlFor="general-opinion" className="text-lg font-medium mb-1 block">전체 심사평</UILabel>
          <Textarea 
            id="general-opinion" 
            placeholder="작품에 대한 전체적인 심사평을 작성해주세요." 
            className="min-h-[150px]"
            value={generalOpinion}
            onChange={handleGeneralOpinionChange}
          />
        </div>
      </div>
      
      <div className="mb-6">
        <UILabel className="text-lg font-medium mb-3 block">부문별 심사의견</UILabel>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categoryOpinions.map((category) => (
            <Card key={category.id} className="shadow-sm">
              <CardContent className="p-3 sm:p-4">
                <UILabel htmlFor={`category-${category.id}`} className="block font-medium text-sm sm:text-base mb-2 text-foreground">
                  {category.name}
                </UILabel>
                <Textarea
                  id={`category-${category.id}`}
                  value={category.opinion}
                  onChange={(e) => handleCategoryOpinionChange(category.id, e.target.value)}
                  placeholder={`${category.name}에 대한 의견을 입력하세요.`}
                  className="min-h-[80px] sm:min-h-[100px] w-full text-sm"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <UILabel htmlFor="overall-summary" className="text-lg font-medium mb-1 block">심사총평 및 제언</UILabel>
        <Textarea 
          id="overall-summary" 
          placeholder="심사 결과에 대한 총평 및 제언사항을 작성해주세요." 
          className="min-h-[150px]"
          value={loadFromLocalStorage('overall-summary')}
          onChange={(e) => saveToLocalStorage('overall-summary', e.target.value)}
        />
      </div>
      
      <SectionFooter 
        currentDate={currentDate}
        signature={signatureName}
        setSignature={setSignatureName}
      />
    </section>
  );
};

export default FeedbackSection;
