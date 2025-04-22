import React, { useEffect, useState, useRef } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import './FeedbackSection.css';
import { Label as UILabel } from '@/components/ui/label';
import SectionFooter from "@/components/ui/section-footer";

const FeedbackSection: React.FC = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [signatureName, setSignatureName] = useState('');
  
  const formRef = useRef<HTMLDivElement>(null);
  
  const [generalOpinion, setGeneralOpinion] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [category, setCategory] = useState('');
  const [artistName, setArtistName] = useState('');
  const [workTitle, setWorkTitle] = useState('');

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
  };
  
  const loadFromLocalStorage = (key: string) => {
    const savedValue = localStorage.getItem(`asca-opinion-${key}`);
    return savedValue || '';
  };
  
  const saveToLocalStorage = (id: string, value: string) => {
    localStorage.setItem(`asca-opinion-${id}`, value);
  };

  const handleGeneralOpinionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGeneralOpinion(e.target.value);
    saveToLocalStorage('asca-general-opinion', e.target.value);
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
