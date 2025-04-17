import React, { useState, lazy, Suspense, useEffect } from 'react';
import CalligraphyHeader from '@/components/CalligraphyHeader';
import NavigationMenu from '@/components/NavigationMenu';

// 동적 임포트를 사용하여 코드 분할
const ScheduleSection = lazy(() => import('@/components/ScheduleSection'));
const EvaluationSection = lazy(() => import('@/components/EvaluationSection'));
const FeedbackSection = lazy(() => import('@/components/FeedbackSection'));
const ResultsSection = lazy(() => import('@/components/ResultsSection'));

// 로딩 상태를 위한 컴포넌트
const LoadingComponent = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

const Index = () => {
  const [activeSection, setActiveSection] = useState('schedule');
  const [mounted, setMounted] = useState(false);

  // 컴포넌트가 마운트된 후에만 렌더링을 시작하도록 설정
  useEffect(() => {
    setMounted(true);
  }, []);

  // Render the appropriate section based on activeSection
  const renderActiveSection = () => {
    if (!mounted) return <LoadingComponent />;
    
    switch (activeSection) {
      case 'schedule':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <ScheduleSection />
          </Suspense>
        );
      case 'evaluation':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <EvaluationSection />
          </Suspense>
        );
      case 'feedback':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <FeedbackSection />
          </Suspense>
        );
      case 'results':
        return (
          <Suspense fallback={<LoadingComponent />}>
            <ResultsSection />
          </Suspense>
        );
      default:
        return (
          <Suspense fallback={<LoadingComponent />}>
            <ScheduleSection />
          </Suspense>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <CalligraphyHeader />
      
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <NavigationMenu 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />
        
        {renderActiveSection()}
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>© 2025 The Asian Society of Calligraphic Arts (ASCA)</p>
          <p className="mt-1">Oriental Calligraphy Evaluation Management System</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
