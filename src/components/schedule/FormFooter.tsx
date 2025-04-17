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
      <div className="signature-section border-t border-primary pt-10 flex justify-between items-end">
        <p className="text-sm text-foreground m-0 pb-2">작성일: {currentDate}</p>
        <div className="flex items-baseline gap-2">
          <Label htmlFor="judge-signature" className="font-bold whitespace-nowrap text-foreground">심사위원장:</Label>
          <div className="w-[250px] relative">
            <Input 
              id="judge-signature"
              value={judgeSignature}
              onChange={(e) => setJudgeSignature(e.target.value)}
              className="border-0 border-b border-input rounded-none bg-transparent px-0 py-2"
            />
          </div>
          <span className="text-sm text-foreground whitespace-nowrap pb-2">(서명)</span>
        </div>
      </div>

      <div className="button-container border-t border-primary pt-6 mt-10 flex justify-between items-center">
        <p className="text-xs text-muted-foreground m-0">© The Asian Society of Calligraphic Arts (ASCA). All rights reserved.</p>
        <div className="flex gap-2">
          <Button 
            onClick={handlePdfDownload}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <FileDown className="w-4 h-4 mr-1" />
            PDF 다운로드
          </Button>
          <Button 
            onClick={handleCsvExport}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Save className="w-4 h-4 mr-1" />
            CSV 내보내기
          </Button>
        </div>
      </div>
    </>
  );
};

export default FormFooter;
