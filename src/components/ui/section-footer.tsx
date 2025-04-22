import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FileDown, FileText } from "lucide-react";

export interface SectionFooterProps {
  currentDate: string;
  signature: string;
  setSignature: (value: string) => void;
  handlePdfDownload?: () => void;
  handleCsvExport?: () => void;
  handleMarkdownDownload?: () => void;
  isPdfGenerating?: boolean;
  isCsvGenerating?: boolean;
  isMarkdownGenerating?: boolean;
}

const SectionFooter: React.FC<SectionFooterProps> = ({
  currentDate,
  signature,
  setSignature,
  handlePdfDownload,
  handleCsvExport,
  handleMarkdownDownload,
  isPdfGenerating = false,
  isCsvGenerating = false,
  isMarkdownGenerating = false
}) => {
  return (
    <div className="mt-6 bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-md text-gray-900 dark:text-gray-100 print:hidden">
      <div className="space-y-4">
        <div className="flex flex-col">
          <Label htmlFor="signature" className="mb-1 text-sm">서명</Label>
          <Input 
            id="signature" 
            type="text" 
            value={signature}
            onChange={(e) => setSignature(e.target.value)}
            className="text-sm"
            placeholder="심사위원 성명을 입력하세요"
          />
        </div>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-4">
          <div className="text-xs sm:text-sm w-full sm:w-auto text-left">
            <p>© {new Date().getFullYear()} 동양서예협회</p>
          </div>
          
          <div className="flex flex-wrap gap-2 justify-end w-full sm:w-auto">
            {handlePdfDownload && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handlePdfDownload}
                disabled={isPdfGenerating}
                className="flex items-center"
              >
                <FileText className="h-4 w-4 mr-1" />
                <span className="text-xs">{isPdfGenerating ? "PDF 생성 중..." : "PDF 다운로드"}</span>
              </Button>
            )}
            
            {handleCsvExport && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCsvExport}
                disabled={isCsvGenerating}
                className="flex items-center"
              >
                <FileDown className="h-4 w-4 mr-1" />
                <span className="text-xs">{isCsvGenerating ? "CSV 생성 중..." : "CSV 다운로드"}</span>
              </Button>
            )}
            
            {handleMarkdownDownload && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleMarkdownDownload}
                disabled={isMarkdownGenerating}
                className="flex items-center"
              >
                <FileText className="h-4 w-4 mr-1" />
                <span className="text-xs">{isMarkdownGenerating ? "마크다운 생성 중..." : "마크다운 다운로드"}</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionFooter; 