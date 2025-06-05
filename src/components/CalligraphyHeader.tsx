import React, { useEffect, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// 로고 이미지를 직접 import
import logoLightImage from '/logo-light.png';
import logoBlackImage from '/logo-black.png';

const CalligraphyHeader = () => {
  const { theme } = useTheme();
  const [logoSrc, setLogoSrc] = useState<string>('');

  // 테마 변경 시 로고 이미지 소스 업데이트
  useEffect(() => {
    // Vite에서 정적 이미지 처리 - import한 이미지 사용
    setLogoSrc(theme === 'dark' ? logoLightImage : logoBlackImage);
  }, [theme]);

  return (
    <header className="relative py-8 md:py-16 bg-gradient-to-b from-background to-muted/20">
      {/* 데스크탑 로고 */}
      <div className="absolute top-6 left-6 transition-all hover:scale-105 hidden md:block">
        <a 
          href="https://orientalcalligraphy.org" 
          target="_blank" 
          rel="noopener noreferrer"
          className="block"
        >
          {logoSrc && (
            <img 
              src={logoSrc} 
              alt="동양서예협회 로고" 
              className="w-32 h-auto drop-shadow-sm hover:drop-shadow-md transition-all duration-200"
              onError={(e) => {
                console.error('로고 이미지 로딩 오류:', e);
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
          )}
        </a>
      </div>

      <div className="mx-auto max-w-5xl px-4 text-center">
        {/* 모바일 중앙 로고 */}
        <div className="flex justify-center mb-6 md:hidden">
          <a 
            href="https://orientalcalligraphy.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-all hover:scale-105"
          >
            {logoSrc && (
              <img 
                src={logoSrc} 
                alt="동양서예협회 로고" 
                className="w-24 h-auto drop-shadow-sm"
                onError={(e) => {
                  console.error('로고 이미지 로딩 오류:', e);
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            )}
          </a>
        </div>
        
        {/* 메인 타이틀 */}
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight leading-tight">
            동양서예 심사관리 시스템
          </h1>
          
          <div className="flex items-center justify-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-sm px-3 py-1">
              Oriental Calligraphy
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1">
              Evaluation System
            </Badge>
          </div>
          
          {/* 장식적 요소 */}
          <div className="flex justify-center items-center gap-2 mt-6">
            <div className="h-px bg-gradient-to-r from-transparent to-primary w-16"></div>
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <div className="h-px bg-gradient-to-r from-primary via-primary to-transparent w-32"></div>
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <div className="h-px bg-gradient-to-l from-transparent to-primary w-16"></div>
          </div>
        </div>

        {/* 서브텍스트 */}
        <p className="text-muted-foreground text-base md:text-lg mt-6 max-w-2xl mx-auto leading-relaxed">
          전통적인 동양서예의 가치를 현대적 기술로 계승하는 통합 심사관리 플랫폼
        </p>
      </div>

      {/* 배경 장식 */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 left-10 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
      </div>
    </header>
  );
};

export default CalligraphyHeader;
