
import React, { useState, useEffect } from 'react';
import EvaluationHeader from '@/components/evaluation/EvaluationHeader';
import EvaluationCriteriaTable from '@/components/evaluation/EvaluationCriteriaTable';
import ScoreTable from '@/components/evaluation/ScoreTable';
import GradingGuidelines from '@/components/schedule/GradingGuidelines';
import FormFooter from '@/components/schedule/FormFooter';

const EvaluationSection = () => {
  const [seriesNumber, setSeriesNumber] = useState('');
  const [category, setCategory] = useState('');
  const [artistName, setArtistName] = useState('');
  const [workTitle, setWorkTitle] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [judgeSignature, setJudgeSignature] = useState('');
  
  const [pointsScore, setPointsScore] = useState<number | null>(null);
  const [structureScore, setStructureScore] = useState<number | null>(null);
  const [compositionScore, setCompositionScore] = useState<number | null>(null);
  const [harmonyScore, setHarmonyScore] = useState<number | null>(null);
  const [totalScore, setTotalScore] = useState<number>(0);

  useEffect(() => {
    generateSeriesNumber();
    setFormattedCurrentDate();
  }, []);

  useEffect(() => {
    calculateTotalScore();
  }, [pointsScore, structureScore, compositionScore, harmonyScore]);

  const generateSeriesNumber = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    setSeriesNumber(`${year}-${month}-${day}-${hours}${minutes}${seconds}`);
  };

  const setFormattedCurrentDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    setCurrentDate(`${year}년 ${month}월 ${day}일`);
  };

  const calculateTotalScore = () => {
    const points = pointsScore || 0;
    const structure = structureScore || 0;
    const composition = compositionScore || 0;
    const harmony = harmonyScore || 0;
    setTotalScore(points + structure + composition + harmony);
  };

  const handleScoreClick = (category: string, value: number) => {
    switch(category) {
      case 'points':
        setPointsScore(value);
        break;
      case 'structure':
        setStructureScore(value);
        break;
      case 'composition':
        setCompositionScore(value);
        break;
      case 'harmony':
        setHarmonyScore(value);
        break;
      default:
        break;
    }
  };

  const handlePdfDownload = () => {
    alert('PDF 다운로드 기능은 추후 구현될 예정입니다.');
  };

  const handleCsvExport = () => {
    alert('CSV 내보내기 기능은 추후 구현될 예정입니다.');
  };

  const renderScoreRange = (category: string, min: number, max: number) => {
    const buttons = [];
    for (let i = min; i <= max; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handleScoreClick(category, i)}
          className={`w-8 h-8 flex items-center justify-center text-xs border border-gray-300 rounded-md hover:bg-[#C53030] hover:text-white hover:border-[#C53030] transition-colors 
            ${
              (category === 'points' && pointsScore === i) ||
              (category === 'structure' && structureScore === i) ||
              (category === 'composition' && compositionScore === i) ||
              (category === 'harmony' && harmonyScore === i)
                ? 'bg-[#C53030] text-white border-[#C53030]'
                : 'bg-white'
            }`}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <section className="calligraphy-section" id="evaluation-score-form">
      <h2 className="calligraphy-section-title">심사표</h2>
      
      <EvaluationHeader 
        seriesNumber={seriesNumber}
        category={category}
        setCategory={setCategory}
        artistName={artistName}
        setArtistName={setArtistName}
        workTitle={workTitle}
        setWorkTitle={setWorkTitle}
      />

      <EvaluationCriteriaTable />

      <ScoreTable
        pointsScore={pointsScore}
        structureScore={structureScore}
        compositionScore={compositionScore}
        harmonyScore={harmonyScore}
        totalScore={totalScore}
        handleScoreClick={handleScoreClick}
        renderScoreRange={renderScoreRange}
      />

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

export default EvaluationSection;
