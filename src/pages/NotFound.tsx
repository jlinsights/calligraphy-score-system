import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Home, ArrowLeft, FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center space-y-6">
        {/* 아이콘과 상태 */}
        <div className="space-y-4">
          <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
            <FileQuestion className="h-10 w-10 text-muted-foreground" />
          </div>
          
          <div className="space-y-2">
            <Badge variant="destructive" className="text-lg px-4 py-1">
              404
            </Badge>
            <h1 className="text-2xl font-bold text-foreground">
              페이지를 찾을 수 없습니다
            </h1>
          </div>
        </div>

        {/* 설명 */}
        <div className="space-y-3">
          <p className="text-muted-foreground">
            요청하신 페이지가 존재하지 않거나 이동되었을 수 있습니다.
          </p>
          
          {location.pathname && (
            <div className="bg-muted/30 rounded-lg p-3">
              <p className="text-sm text-muted-foreground">
                요청 경로: <code className="text-xs bg-muted px-1 py-0.5 rounded">{location.pathname}</code>
              </p>
            </div>
          )}
        </div>

        {/* 액션 버튼들 */}
        <div className="space-y-3">
          <Button asChild className="w-full">
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              메인 페이지로 돌아가기
            </Link>
          </Button>
          
          <Button variant="outline" onClick={() => window.history.back()} className="w-full">
            <ArrowLeft className="mr-2 h-4 w-4" />
            이전 페이지로
          </Button>
        </div>

        {/* 푸터 정보 */}
        <div className="pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            동양서예 심사관리 시스템
          </p>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
