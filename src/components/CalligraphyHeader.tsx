import React, { useEffect, useState } from 'react';
import { useTheme } from '@/components/ThemeProvider';

const CalligraphyHeader = () => {
  const { theme } = useTheme();
  const [logoSrc, setLogoSrc] = useState<string>('');

  // 테마 변경 시 로고 이미지 소스 업데이트
  useEffect(() => {
    setLogoSrc(theme === 'dark' ? '/logo-light.png' : '/logo-black.png');
  }, [theme]);

  return (
    <header className="relative py-8 md:py-12">
      {/* 로고 및 외부 링크 */}
      <a 
        href="https://orientalcalligraphy.org" 
        target="_blank" 
        rel="noopener noreferrer"
        className="absolute top-2 left-4 md:top-4 md:left-6 transition-opacity hover:opacity-80"
      >
        <img 
          src={logoSrc} 
          alt="동양서예협회 로고" 
          className="w-24 md:w-28 h-auto"
        />
      </a>

      <div className="mx-auto max-w-4xl px-4 text-center">
        <h1 className="text-4xl md:text-5xl mb-6 font-bold text-foreground tracking-tight transition-colors duration-200">동양서예 심사관리 시스템</h1>
        <p className="text-muted-foreground mb-4 text-lg">Oriental Calligraphy Evaluation Management System</p>
        <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
      </div>
    </header>
  );
};

export default CalligraphyHeader;
