import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface EvaluationHeaderProps {
  seriesNumber: string;
  category: string;
  setCategory: (value: string) => void;
  artistName: string;
  setArtistName: (value: string) => void;
  workTitle: string;
  setWorkTitle: (value: string) => void;
}

const EvaluationHeader: React.FC<EvaluationHeaderProps> = ({
  seriesNumber,
  category,
  setCategory,
  artistName,
  setArtistName,
  workTitle,
  setWorkTitle
}) => {
  return (
    <div className="form-header mb-4 sm:mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-3 sm:mb-4">
        <div>
          <Label htmlFor="series-number" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">심사번호</Label>
          <Input 
            id="series-number"
            value={seriesNumber}
            readOnly
            className="w-full bg-[#e9ecef] cursor-not-allowed text-xs sm:text-sm py-1.5 sm:py-2"
          />
        </div>
        <div>
          <Label htmlFor="category" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">부 문</Label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger id="category" className="text-xs sm:text-sm py-1.5 sm:py-2">
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        <div>
          <Label htmlFor="artist-name" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">작가이름</Label>
          <Input 
            id="artist-name"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            className="w-full text-xs sm:text-sm py-1.5 sm:py-2"
          />
        </div>
        <div>
          <Label htmlFor="work-title" className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">작품명제</Label>
          <Input 
            id="work-title"
            value={workTitle}
            onChange={(e) => setWorkTitle(e.target.value)}
            className="w-full text-xs sm:text-sm py-1.5 sm:py-2"
          />
        </div>
      </div>
    </div>
  );
};

export default EvaluationHeader;
