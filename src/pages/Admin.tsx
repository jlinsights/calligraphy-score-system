import React, { useState } from 'react';
import CalligraphyHeader from '@/components/CalligraphyHeader';
import { SupabaseStatus } from '@/components/SupabaseStatus';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { EvaluationList } from '@/components/evaluation/EvaluationList';
import { ArrowLeft, Database, Settings, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('status');

  const tabItems = [
    { value: 'status', label: '시스템 상태', icon: Activity },
    { value: 'data', label: '데이터 관리', icon: Database },
    { value: 'settings', label: '설정', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      <CalligraphyHeader />
      
      <main className="max-w-7xl mx-auto px-4 pb-16">
        {/* 브레드크럼 네비게이션 */}
        <div className="flex items-center gap-4 py-6">
          <Button variant="outline" size="sm" asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              메인으로 돌아가기
            </Link>
          </Button>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary">ADMIN</Badge>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium">시스템 관리</span>
          </div>
        </div>

        <Separator className="mb-8" />
        
        {/* 페이지 헤더 */}
        <div className="space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-foreground">관리자 대시보드</h1>
          <p className="text-muted-foreground text-lg">
            시스템 상태를 모니터링하고 데이터를 관리할 수 있습니다
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            {tabItems.map((item) => {
              const Icon = item.icon;
              return (
                <TabsTrigger 
                  key={item.value} 
                  value={item.value}
                  className="flex items-center gap-2"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>
          
          <TabsContent value="status" className="space-y-6">
            <Card className="border-2">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  <CardTitle>시스템 상태</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Supabase 연결 상태 및 시스템 정보를 실시간으로 확인할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <SupabaseStatus />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="data" className="space-y-6">
            <Card className="border-2">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-primary" />
                  <CardTitle>데이터 관리</CardTitle>
                </div>
                <CardDescription className="text-base">
                  심사 데이터를 조회, 수정, 삭제할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <EvaluationList />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <Card className="border-2">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-primary" />
                  <CardTitle>시스템 설정</CardTitle>
                </div>
                <CardDescription className="text-base">
                  시스템 설정을 변경하고 관리할 수 있습니다.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-center py-12">
                  <div className="text-center space-y-3">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                      <Settings className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium text-foreground">설정 준비 중</h3>
                    <p className="text-muted-foreground max-w-sm">
                      시스템 설정 기능은 향후 업데이트에서 제공될 예정입니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
        
      {/* 푸터 */}
      <footer className="border-t bg-card/50 backdrop-blur-sm mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center space-y-2">
            <p className="text-sm font-medium text-foreground">
              © 2025 The Asian Society of Calligraphic Arts (ASCA)
            </p>
            <p className="text-xs text-muted-foreground">
              Oriental Calligraphy Evaluation Management System - Admin Panel
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Admin; 