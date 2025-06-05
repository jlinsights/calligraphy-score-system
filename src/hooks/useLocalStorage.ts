import { useState, useEffect } from 'react';

/**
 * localStorage와 동기화되는 상태를 관리하는 훅
 * @param key localStorage 키
 * @param initialValue 초기값
 * @returns [value, setValue, removeValue]
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // 초기값 설정
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`localStorage에서 ${key} 읽기 실패:`, error);
      return initialValue;
    }
  });

  // 값 설정 함수
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 함수일 경우 현재 값을 인자로 전달
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      setStoredValue(valueToStore);
      
      // localStorage에 저장
      if (valueToStore === undefined || valueToStore === null) {
        window.localStorage.removeItem(key);
      } else {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`localStorage에 ${key} 저장 실패:`, error);
    }
  };

  // 값 제거 함수
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      window.localStorage.removeItem(key);
    } catch (error) {
      console.error(`localStorage에서 ${key} 제거 실패:`, error);
    }
  };

  // storage 이벤트 리스너 (다른 탭에서 변경시 동기화)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.warn(`storage 이벤트 처리 실패:`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  return [storedValue, setValue, removeValue];
}

/**
 * localStorage에서 배열 데이터를 관리하는 특화된 훅
 * @param key localStorage 키
 * @param initialValue 초기 배열 값
 * @returns [array, addItem, removeItem, updateItem, clearAll]
 */
export function useLocalStorageArray<T extends { id: string | number }>(
  key: string,
  initialValue: T[] = []
) {
  const [array, setArray, removeArray] = useLocalStorage<T[]>(key, initialValue);

  // 아이템 추가
  const addItem = (item: T) => {
    setArray(prev => [...prev, item]);
  };

  // 아이템 제거
  const removeItem = (id: string | number) => {
    setArray(prev => prev.filter(item => item.id !== id));
  };

  // 아이템 업데이트
  const updateItem = (id: string | number, updates: Partial<T>) => {
    setArray(prev =>
      prev.map(item =>
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  // 전체 삭제
  const clearAll = () => {
    removeArray();
  };

  // 아이템 찾기
  const findItem = (id: string | number) => {
    return array.find(item => item.id === id);
  };

  return {
    array,
    addItem,
    removeItem,
    updateItem,
    clearAll,
    findItem,
    setArray
  };
} 