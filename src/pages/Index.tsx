
import React, { useState } from 'react';
import CalligraphyHeader from '@/components/CalligraphyHeader';
import NavigationMenu from '@/components/NavigationMenu';
import ScheduleSection from '@/components/ScheduleSection';
import EvaluationSection from '@/components/EvaluationSection';
import FeedbackSection from '@/components/FeedbackSection';
import ResultsSection from '@/components/ResultsSection';

const Index = () => {
  const [activeSection, setActiveSection] = useState('schedule');

  // Render the appropriate section based on activeSection
  const renderActiveSection = () => {
    switch (activeSection) {
      case 'schedule':
        return <ScheduleSection />;
      case 'evaluation':
        return <EvaluationSection />;
      case 'feedback':
        return <FeedbackSection />;
      case 'results':
        return <ResultsSection />;
      default:
        return <ScheduleSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <CalligraphyHeader />
      
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <NavigationMenu 
          activeSection={activeSection} 
          setActiveSection={setActiveSection} 
        />
        
        {renderActiveSection()}
        
        <footer className="mt-12 text-center text-sm text-muted-foreground">
          <p>© 2025 동양서예 심사관리 시스템</p>
          <p className="mt-1">Oriental Calligraphy Evaluation Management System</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
