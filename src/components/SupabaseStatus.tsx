import React, { useEffect, useState } from 'react';
import { testSupabaseConnection } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

interface ConnectionStatus {
  success: boolean;
  message?: string;
  error?: string;
  isLoading: boolean;
}

export function SupabaseStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({
    success: false,
    isLoading: true
  });

  const checkConnection = async () => {
    setStatus(prev => ({ ...prev, isLoading: true }));
    
    try {
      const result = await testSupabaseConnection();
      
      setStatus({
        success: result.success,
        message: result.message,
        error: result.error,
        isLoading: false
      });
    } catch (error) {
      setStatus({
        success: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
        isLoading: false
      });
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="space-y-4 my-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Supabase 연결 상태</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={checkConnection}
          disabled={status.isLoading}
        >
          {status.isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          새로고침
        </Button>
      </div>

      {status.isLoading ? (
        <div className="flex items-center justify-center p-4 border rounded-md">
          <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
          <span>연결 상태 확인 중...</span>
        </div>
      ) : status.success ? (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>연결됨</AlertTitle>
          <AlertDescription>{status.message}</AlertDescription>
        </Alert>
      ) : (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>연결 오류</AlertTitle>
          <AlertDescription>{status.error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
} 