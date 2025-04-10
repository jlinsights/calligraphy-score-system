
import React from 'react';

const CalligraphyHeader = () => {
  return (
    <header className="text-center py-8 md:py-12">
      <div className="mx-auto max-w-4xl px-4">
        <h1 className="text-4xl md:text-5xl mb-6 font-bold text-foreground tracking-tight transition-colors duration-200">동양서예협회 심사관리 시스템</h1>
        <p className="text-muted-foreground mb-4">Oriental Calligraphy Association Evaluation Management System</p>
        <div className="w-24 h-1 bg-primary mx-auto mb-6"></div>
      </div>
    </header>
  );
};

export default CalligraphyHeader;
