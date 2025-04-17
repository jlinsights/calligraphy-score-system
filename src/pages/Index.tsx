import React, { useState, lazy, Suspense } from 'react';
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

  // Render the appropriate section based on activeSection
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'schedule':
        return <ScheduleSection />;
      case 'evaluation':
        return <EvaluationSection />;
      case 'feedback':
        return <FeedbackSection />;
      case 'results':
        return <ResultsSection />;
      default:
        return <ScheduleSection />;
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
        
        <Suspense fallback={<LoadingComponent />}>
          {renderActiveSection()}
        </Suspense>
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>© 2025 The Asian Society of Calligraphic Arts (ASCA)</p>
          <p className="mt-1">Oriental Calligraphy Evaluation Management System</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
