import React, { useState, lazy, Suspense, useEffect } from 'react';
import CalligraphyHeader from '@/components/CalligraphyHeader';
import NavigationMenu from '@/components/NavigationMenu';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// 동적 임포트를 사용하여 코드 분할
const ScheduleSection = lazy(() => import('@/components/ScheduleSection'));
const EvaluationSection = lazy(() => import('@/components/EvaluationSection'));
const FeedbackSection = lazy(() => import('@/components/FeedbackSection'));
const ResultsSection = lazy(() => import('@/components/ResultsSection'));

// 향상된 로딩 컴포넌트
const LoadingComponent = () => (
  <Card className="p-8 mx-auto max-w-4xl">
    <div className="space-y-6">
      <div className="flex items-center justify-center mb-6">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <div className="flex gap-2 mt-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
      </div>
    </div>
  </Card>
);

const Index = () => {
  const [activeSection, setActiveSection] = useState('schedule');
  const [mounted, setMounted] = useState(false);

  // 컴포넌트가 마운트된 후에만 렌더링을 시작하도록 설정
  useEffect(() => {
    setMounted(true);
  }, []);

  // 섹션별 메타데이터
  const sectionMeta = {
    schedule: { title: '심사계획서', description: '심사 일정과 계획을 관리합니다' },
    evaluation: { title: '심사표', description: '작품별 심사 결과를 입력합니다' },
    feedback: { title: '심사의견서', description: '심사위원의 종합 의견을 작성합니다' },
    results: { title: '심사결과종합표', description: '전체 심사 결과를 확인합니다' }
  };

  // 적절한 섹션 렌더링
  const renderActiveSection = () => {
    if (!mounted) return <LoadingComponent />;
    
    const currentMeta = sectionMeta[activeSection as keyof typeof sectionMeta];
    
    return (
      <div className="space-y-6">
        {/* 섹션 헤더 */}
        <div className="text-center py-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            {currentMeta?.title}
          </h2>
          <p className="text-muted-foreground text-sm md:text-base">
            {currentMeta?.description}
          </p>
        </div>

        {/* 섹션 콘텐츠 */}
        <div className="min-h-[400px]">
          <Suspense fallback={<LoadingComponent />}>
            {activeSection === 'schedule' && <ScheduleSection />}
            {activeSection === 'evaluation' && <EvaluationSection />}
            {activeSection === 'feedback' && <FeedbackSection />}
            {activeSection === 'results' && <ResultsSection />}
          </Suspense>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <CalligraphyHeader />
      
      <main className="max-w-7xl mx-auto px-4 pb-16">
        <NavigationMenu 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />
        
        {renderActiveSection()}
      </main>
        
      {/* 푸터 */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-foreground">
              © 2025 The Asian Society of Calligraphic Arts (ASCA)
            </p>
            <p className="text-xs text-muted-foreground">
              Oriental Calligraphy Evaluation Management System
            </p>
            <div className="flex justify-center items-center gap-2 mt-4">
              <div className="w-1 h-1 bg-primary rounded-full"></div>
              <span className="text-xs text-muted-foreground">전통과 현대의 조화</span>
              <div className="w-1 h-1 bg-primary rounded-full"></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
