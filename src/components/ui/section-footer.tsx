import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, FileDown } from 'lucide-react';

interface SectionFooterProps {
  currentDate: string;
  signature: string;
  setSignature: (value: string) => void;
  signatureLabel?: string;
  handlePdfDownload: () => void;
  handleCsvExport: () => void;
  isPdfGenerating?: boolean;
  isCsvGenerating?: boolean;
  copyrightYear?: number;
  organizationName?: string;
}

const SectionFooter: React.FC<SectionFooterProps> = ({
  currentDate,
  signature,
  setSignature,
  signatureLabel = "심사위원장",
  handlePdfDownload,
  handleCsvExport,
  isPdfGenerating = false,
  isCsvGenerating = false,
  copyrightYear = new Date().getFullYear(),
  organizationName = "동양서예협회 (Oriental Calligraphy Association)"
}) => {
  return (
    <>
      <div className="signature-section border-t border-primary pt-3 sm:pt-6 mt-4 sm:mt-8 flex flex-col sm:flex-row justify-between sm:items-end gap-3 sm:gap-0">
        <p className="text-xs sm:text-sm text-foreground m-0 mb-1 sm:mb-0 pb-0 sm:pb-2">작성일: {currentDate}</p>
        <div className="flex flex-col sm:flex-row items-start sm:items-baseline gap-1 sm:gap-2 w-full sm:w-auto">
          <Label htmlFor="signature-input" className="font-bold whitespace-nowrap text-foreground text-sm mb-1 sm:mb-0">{signatureLabel}:</Label>
          <div className="w-full sm:w-[200px] md:w-[250px] relative">
            <Input 
              id="signature-input"
              value={signature}
              onChange={(e) => setSignature(e.target.value)}
              className="border-0 border-b border-input rounded-none bg-transparent px-0 py-1 sm:py-2 text-sm"
              placeholder="이름을 입력하세요"
            />
          </div>
          <span className="text-xs sm:text-sm text-foreground whitespace-nowrap pb-0 sm:pb-2 mt-1 sm:mt-0">(서명)</span>
        </div>
      </div>

      <div className="button-container border-t border-primary pt-3 sm:pt-6 mt-3 sm:mt-6 flex flex-col-reverse sm:flex-row justify-between items-center gap-3 sm:gap-0">
        <p className="text-[9px] sm:text-xs text-muted-foreground m-0 text-center sm:text-left w-full sm:w-auto mt-2 sm:mt-0">
          © {copyrightYear} {organizationName}
        </p>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            onClick={handlePdfDownload}
            disabled={isPdfGenerating}
            className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm flex-1 sm:flex-initial h-9 sm:h-9 px-2 sm:px-3"
          >
            <FileDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            {isPdfGenerating ? '생성 중...' : 'PDF 다운로드'}
          </Button>
          <Button 
            onClick={handleCsvExport}
            disabled={isCsvGenerating}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm flex-1 sm:flex-initial h-9 sm:h-9 px-2 sm:px-3"
          >
            <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            {isCsvGenerating ? '생성 중...' : 'CSV 내보내기'}
          </Button>
        </div>
      </div>
    </>
  );
};

export default SectionFooter; 