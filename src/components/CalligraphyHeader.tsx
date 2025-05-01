import React, { useEffect, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';

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
    <header className="relative py-6 md:py-12">
      {/* 데스크탑에서만 보이는 로고 */}
      <a 
        href="https://orientalcalligraphy.org" 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute top-4 left-6 transition-opacity hover:opacity-80 hidden md:block"
      >
        {logoSrc && (
          <img 
            src={logoSrc} 
            alt="동양서예협회 로고" 
            className="w-28 h-auto"
            onError={(e) => {
              console.error('로고 이미지 로딩 오류:', e);
              // 에러 발생시 기본 이미지 경로 설정
              e.currentTarget.src = '/placeholder.svg';
            }}
          />
        )}
      </a>

      <div className="mx-auto max-w-4xl px-4 text-center">
        {/* 모바일에서만 보이는 중앙 정렬된 로고 */}
        <div className="flex justify-center mb-3 md:hidden">
          <a 
            href="https://orientalcalligraphy.org" 
            target="_blank" 
            rel="noopener noreferrer"
            className="transition-opacity hover:opacity-80"
          >
            {logoSrc && (
              <img 
                src={logoSrc} 
                alt="동양서예협회 로고" 
                className="w-20 h-auto"
                onError={(e) => {
                  console.error('로고 이미지 로딩 오류:', e);
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            )}
          </a>
        </div>
        
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 md:mb-6 font-bold text-foreground tracking-tight transition-colors duration-200 leading-tight">
          동양서예 심사관리 시스템
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4">Oriental Calligraphy Evaluation System</p>
        <div className="w-16 sm:w-20 md:w-24 h-1 bg-primary mx-auto mb-4 md:mb-6"></div>
      </div>
    </header>
  );
};

export default CalligraphyHeader;
