import { useState, useCallback } from 'react';

// 검증 규칙 타입
export interface ValidationRule<T = unknown> {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: T) => string | null;
}

// 검증 결과 타입
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// 폼 검증 훅
export function useFormValidation<T extends Record<string, unknown>>(
  initialValues: T,
  validationRules: Partial<Record<keyof T, ValidationRule>>
) {
  const [values, setFormValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // 단일 필드 검증
  const validateField = useCallback((name: keyof T, value: unknown): string | null => {
    const rules = validationRules[name];
    if (!rules) return null;

    // 필수 필드 검증
    if (rules.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      return '이 필드는 필수입니다.';
    }

    // 값이 없으면 다른 검증은 건너뛰기
    if (!value && !rules.required) return null;

    // 문자열 길이 검증
    if (typeof value === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        return `최소 ${rules.minLength}자 이상 입력해주세요.`;
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        return `최대 ${rules.maxLength}자까지 입력 가능합니다.`;
      }
    }

    // 숫자 범위 검증
    if (typeof value === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        return `${rules.min} 이상의 값을 입력해주세요.`;
      }
      if (rules.max !== undefined && value > rules.max) {
        return `${rules.max} 이하의 값을 입력해주세요.`;
      }
    }

    // 패턴 검증
    if (rules.pattern && typeof value === 'string' && !rules.pattern.test(value)) {
      return '올바른 형식으로 입력해주세요.';
    }

    // 커스텀 검증
    if (rules.custom) {
      return rules.custom(value);
    }

    return null;
  }, [validationRules]);

  // 전체 폼 검증
  const validateForm = useCallback((): ValidationResult => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(key => {
      const error = validateField(key as keyof T, values[key as keyof T]);
      if (error) {
        newErrors[key] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return { isValid, errors: newErrors };
  }, [values, validateField, validationRules]);

  // 값 업데이트
  const setValue = useCallback((name: keyof T, value: unknown) => {
    setFormValues(prev => ({ ...prev, [name]: value }));
    
    // 실시간 검증 (터치된 필드만)
    if (touched[name as string]) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error || ''
      }));
    }
  }, [touched, validateField]);

  // 여러 값 한번에 업데이트
  const setValues = useCallback((newValues: Partial<T>) => {
    setFormValues(prev => ({ ...prev, ...newValues }));
  }, []);

  // 필드 터치 상태 설정
  const setFieldTouched = useCallback((name: keyof T, isTouched: boolean = true) => {
    setTouched(prev => ({ ...prev, [name]: isTouched }));
    
    if (isTouched) {
      const error = validateField(name, values[name]);
      setErrors(prev => ({
        ...prev,
        [name]: error || ''
      }));
    }
  }, [values, validateField]);

  // 폼 리셋
  const resetForm = useCallback(() => {
    setFormValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  // 특정 필드 에러 클리어
  const clearFieldError = useCallback((name: keyof T) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[name as string];
      return newErrors;
    });
  }, []);

  // 모든 에러 클리어
  const clearAllErrors = useCallback(() => {
    setErrors({});
  }, []);

  // 필드별 헬퍼 함수
  const getFieldProps = useCallback((name: keyof T) => ({
    value: values[name] || '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValue(name, e.target.value);
    },
    onBlur: () => setFieldTouched(name),
    error: errors[name as string],
    hasError: Boolean(errors[name as string]),
  }), [values, errors, setValue, setFieldTouched]);

  return {
    values,
    errors,
    touched,
    setValue,
    setValues,
    setFieldTouched,
    validateField,
    validateForm,
    resetForm,
    clearFieldError,
    clearAllErrors,
    getFieldProps,
    isValid: Object.keys(errors).length === 0,
    hasErrors: Object.keys(errors).length > 0,
  };
}

// 일반적인 검증 규칙들
export const commonValidationRules = {
  required: { required: true },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value: string) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return '올바른 이메일 주소를 입력해주세요.';
      }
      return null;
    }
  },
  phone: {
    pattern: /^[0-9-+().\s]+$/,
    custom: (value: string) => {
      if (value && !/^[0-9-+().\s]+$/.test(value)) {
        return '올바른 전화번호를 입력해주세요.';
      }
      return null;
    }
  },
  score: {
    required: true,
    min: 0,
    max: 100,
    custom: (value: number) => {
      if (isNaN(value)) {
        return '숫자를 입력해주세요.';
      }
      if (value < 0 || value > 100) {
        return '0~100 사이의 점수를 입력해주세요.';
      }
      return null;
    }
  },
  koreanName: {
    required: true,
    minLength: 2,
    maxLength: 10,
    pattern: /^[가-힣]+$/,
    custom: (value: string) => {
      if (value && !/^[가-힣]+$/.test(value)) {
        return '한글 이름을 입력해주세요.';
      }
      return null;
    }
  }
}; 