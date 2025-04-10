
import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { Toggle } from './ui/toggle';
import { useTheme } from './ThemeProvider';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Toggle 
      aria-label="Toggle dark mode" 
      className="fixed top-4 right-4 z-50 border border-gray-200 dark:border-gray-600 rounded-md p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-md"
      pressed={theme === 'dark'}
      onPressedChange={toggleTheme}
    >
      {theme === 'dark' ? <Moon className="h-5 w-5 text-gray-100" /> : <Sun className="h-5 w-5" />}
    </Toggle>
  );
};

export default ThemeToggle;
