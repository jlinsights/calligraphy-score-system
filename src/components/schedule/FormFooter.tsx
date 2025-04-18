import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Save, FileDown } from 'lucide-react';

interface FormFooterProps {
  currentDate: string;
  judgeSignature: string;
  setJudgeSignature: (value: string) => void;
  handlePdfDownload: () => void;
  handleCsvExport: () => void;
}

const FormFooter: React.FC<FormFooterProps> = ({
  currentDate,
  judgeSignature,
  setJudgeSignature,
  handlePdfDownload,
  handleCsvExport
}) => {
  return (
    <>
      <div className="signature-section border-t border-primary pt-6 sm:pt-10 flex flex-col sm:flex-row justify-between sm:items-end gap-4 sm:gap-0">
        <p className="text-xs sm:text-sm text-foreground m-0 pb-2">작성일: {currentDate}</p>
        <div className="flex flex-wrap items-baseline gap-2">
          <Label htmlFor="judge-signature" className="font-bold whitespace-nowrap text-foreground text-sm">심사위원장:</Label>
          <div className="w-full sm:w-[250px] relative">
            <Input 
              id="judge-signature"
              value={judgeSignature}
              onChange={(e) => setJudgeSignature(e.target.value)}
              className="border-0 border-b border-input rounded-none bg-transparent px-0 py-2 text-sm"
            />
          </div>
          <span className="text-xs sm:text-sm text-foreground whitespace-nowrap pb-2">(서명)</span>
        </div>
      </div>

      <div className="button-container border-t border-primary pt-4 sm:pt-6 mt-6 sm:mt-10 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
        <p className="text-[10px] sm:text-xs text-muted-foreground m-0 text-center sm:text-left">© The Asian Society of Calligraphic Arts (ASCA). All rights reserved.</p>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button 
            onClick={handlePdfDownload}
            className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm flex-1 sm:flex-initial"
          >
            <FileDown className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            PDF 다운로드
          </Button>
          <Button 
            onClick={handleCsvExport}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm flex-1 sm:flex-initial"
          >
            <Save className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
            CSV 내보내기
          </Button>
        </div>
      </div>
    </>
  );
};

export default FormFooter;
