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
    <div className="evaluation-header mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="form-group">
          <Label htmlFor="series-number" className="block font-medium text-sm mb-1">일련번호</Label>
          <Input
            id="series-number"
            value={seriesNumber}
            readOnly
            className="w-full h-9 text-sm bg-gray-50"
          />
        </div>
        
        <div className="form-group">
          <Label htmlFor="category" className="block font-medium text-sm mb-1">부문</Label>
          <Select
            value={category}
            onValueChange={setCategory}
          >
            <SelectTrigger id="category" className="w-full h-9 text-sm">
              <SelectValue placeholder="부문 선택" />
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
        
        <div className="form-group">
          <Label htmlFor="artist-name" className="block font-medium text-sm mb-1">작가명</Label>
          <Input
            id="artist-name"
            value={artistName}
            onChange={(e) => setArtistName(e.target.value)}
            className="w-full h-9 text-sm"
            placeholder="작가명을 입력하세요"
          />
        </div>
        
        <div className="form-group">
          <Label htmlFor="work-title" className="block font-medium text-sm mb-1">작품명</Label>
          <Input
            id="work-title"
            value={workTitle}
            onChange={(e) => setWorkTitle(e.target.value)}
            className="w-full h-9 text-sm"
            placeholder="작품명을 입력하세요"
          />
        </div>
      </div>
    </div>
  );
};

export default EvaluationHeader;
