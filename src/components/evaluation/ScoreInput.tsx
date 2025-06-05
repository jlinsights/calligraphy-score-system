import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calculator } from 'lucide-react';
import { ScoreInputProps } from './types';

const ScoreInput: React.FC<ScoreInputProps> = ({
  category,
  currentScore,
  onScoreChange,
  minScore,
  maxScore,
  title,
  description,
}) => {
  const renderScoreButtons = () => {
    const buttons = [];
    for (let i = minScore; i <= maxScore; i++) {
      const isSelected = currentScore === i;
      buttons.push(
        <button
          key={i}
          onClick={() => onScoreChange(category, i)}
          className={`
            w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 
            flex items-center justify-center 
            text-[9px] sm:text-[10px] md:text-xs 
            border border-border rounded-md 
            transition-all duration-200
            hover:bg-primary hover:text-primary-foreground hover:border-primary
            hover:scale-105
            ${isSelected 
              ? 'bg-primary text-primary-foreground border-primary shadow-md' 
              : 'bg-background hover:bg-primary/10'
            }
          `}
        >
          {i}
        </button>
      );
    }
    return buttons;
  };

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calculator className="h-4 w-4 text-primary" />
            <span className="text-sm sm:text-base">{title}</span>
          </div>
          {currentScore !== null && (
            <Badge variant="default" className="text-sm font-bold">
              {currentScore}점
            </Badge>
          )}
        </CardTitle>
        {description && (
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            {description}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* 점수 범위 표시 */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>최소: {minScore}점</span>
            <span>최대: {maxScore}점</span>
          </div>

          {/* 점수 버튼들 */}
          <div className="grid grid-cols-10 sm:grid-cols-12 md:grid-cols-15 gap-1 sm:gap-2">
            {renderScoreButtons()}
          </div>

          {/* 선택된 점수 표시 */}
          <div className="text-center">
            {currentScore !== null ? (
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-primary/10 rounded-md">
                <Calculator className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  선택된 점수: <span className="text-primary font-bold">{currentScore}점</span>
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3 py-2 bg-muted/50 rounded-md">
                <Calculator className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">점수를 선택해주세요</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ScoreInput; 