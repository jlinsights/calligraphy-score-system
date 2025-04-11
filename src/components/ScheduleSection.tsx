
import React, { useState, useEffect } from 'react';
import PlanForm from './schedule/PlanForm';
import EvaluationCriteria from './schedule/EvaluationCriteria';
import GradingGuidelines from './schedule/GradingGuidelines';
import FormFooter from './schedule/FormFooter';

const ScheduleSection = () => {
  const [judgeChair, setJudgeChair] = useState('');
  const [evalDate, setEvalDate] = useState('');
  const [evalCategory, setEvalCategory] = useState('');
  const [judges, setJudges] = useState(['', '', '']);
  const [planContent, setPlanContent] = useState('');
  const [judgeSignature, setJudgeSignature] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (!evalDate) setEvalDate(today);
    
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    setCurrentDate(`${year}년 ${month}월 ${day}일`);
  }, [evalDate]);

  const handleJudgeChange = (index: number, value: string) => {
    const updatedJudges = [...judges];
    updatedJudges[index] = value;
    setJudges(updatedJudges);
  };

  const handlePdfDownload = () => {
    alert('PDF 다운로드 기능은 추후 구현될 예정입니다.');
  };

  const handleCsvExport = () => {
    alert('CSV 내보내기 기능은 추후 구현될 예정입니다.');
  };

  return (
    <section className="calligraphy-section" id="evaluation-plan-form">
      <h2 className="calligraphy-section-title">심사계획서</h2>
      
      <PlanForm
        judgeChair={judgeChair}
        setJudgeChair={setJudgeChair}
        evalDate={evalDate}
        setEvalDate={setEvalDate}
        evalCategory={evalCategory}
        setEvalCategory={setEvalCategory}
        judges={judges}
        handleJudgeChange={handleJudgeChange}
        planContent={planContent}
        setPlanContent={setPlanContent}
      />
      
      <EvaluationCriteria />
      
      <GradingGuidelines />
      
      <FormFooter
        currentDate={currentDate}
        judgeSignature={judgeSignature}
        setJudgeSignature={setJudgeSignature}
        handlePdfDownload={handlePdfDownload}
        handleCsvExport={handleCsvExport}
      />
    </section>
  );
};

export default ScheduleSection;
