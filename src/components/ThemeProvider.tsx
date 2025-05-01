import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 파비콘 업데이트 함수
const updateFavicon = (isDarkMode: boolean) => {
  const favicon = document.getElementById('favicon') as HTMLLinkElement;
  const appleTouchIcon = document.getElementById('apple-touch-icon') as HTMLLinkElement;
  const themeColorMeta = document.getElementById('theme-color-meta') as HTMLMetaElement;
  
  if (favicon) {
    favicon.href = isDarkMode ? './logo-light.png' : './logo-black.png';
  }
  
  if (appleTouchIcon) {
    appleTouchIcon.href = isDarkMode ? './logo-light.png' : './logo-black.png';
  }
  
  if (themeColorMeta) {
    themeColorMeta.content = isDarkMode ? '#1e1e2e' : '#ffffff';
  }
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    // Check if theme is stored in localStorage
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    
    // If theme is stored, use it
    if (storedTheme) {
      setTheme(storedTheme);
      const isDarkMode = storedTheme === 'dark';
      document.documentElement.classList.toggle('dark', isDarkMode);
      updateFavicon(isDarkMode);
    } else {
      // Default to light mode instead of checking system preference
      setTheme('light');
      document.documentElement.classList.toggle('dark', false);
      updateFavicon(false);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    const isDarkMode = newTheme === 'dark';
    document.documentElement.classList.toggle('dark', isDarkMode);
    updateFavicon(isDarkMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
