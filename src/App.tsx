import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import ThemeToggle from "./components/ThemeToggle";
import React, { lazy, Suspense, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import './App.css';

// 지연 로딩으로 페이지 컴포넌트 임포트
const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Admin = lazy(() => import('./pages/Admin'));

// 향상된 로딩 컴포넌트
const AppLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
    <Card className="p-8 max-w-md w-full">
      <div className="space-y-6">
        <div className="flex items-center justify-center mb-6">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-6 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            동양서예 심사관리 시스템을 불러오는 중...
          </p>
        </div>
      </div>
    </Card>
  </div>
);

// React Query 클라이언트 설정
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5분
    },
  },
});

const App = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // 앱 초기화
  useEffect(() => {
    console.log("Oriental Calligraphy Evaluation System - Initializing...");
    
    // 앱 로딩 시뮬레이션 (실제로는 필요한 초기화 작업 수행)
    const timer = setTimeout(() => {
      setIsLoaded(true);
      console.log("App initialized successfully");
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return <AppLoader />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <div className="relative">
            {/* 글로벌 알림 시스템 */}
            <Toaster />
            <Sonner />
            
            {/* 테마 토글 버튼 */}
            <ThemeToggle />
            
            {/* 라우터 */}
            <HashRouter>
              <Suspense fallback={<AppLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/index" element={<Navigate to="/" replace />} />
                  <Route path="/home" element={<Navigate to="/" replace />} />
                  <Route path="/admin" element={<Admin />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </HashRouter>
          </div>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
