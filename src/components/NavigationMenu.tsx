import React from 'react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavigationMenuProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'schedule', label: '심사계획서', icon: '📋' },
    { id: 'evaluation', label: '심사표', icon: '📝' },
    { id: 'feedback', label: '심사의견서', icon: '💭' },
    { id: 'results', label: '심사결과종합표', icon: '📊' },
  ];

  return (
    <nav className="mb-8 relative">
      {/* 메인 네비게이션 */}
      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            variant={activeSection === item.id ? "default" : "outline"}
            size="lg"
            className={cn(
              "h-12 px-4 md:px-6 transition-all duration-200 font-medium",
              "border-2 hover:scale-105 active:scale-95",
              activeSection === item.id
                ? "bg-primary text-primary-foreground shadow-lg border-primary"
                : "bg-card text-card-foreground hover:bg-accent hover:text-accent-foreground border-border hover:border-primary/50"
            )}
          >
            <span className="text-base mr-2 hidden sm:inline">{item.icon}</span>
            <span className="text-sm md:text-base">{item.label}</span>
          </Button>
        ))}
      </div>
      
      {/* 관리자 링크 */}
      <div className="absolute right-0 top-1/2 transform -translate-y-1/2 hidden md:block">
        <Button 
          asChild
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Link to="/admin">
            <Settings className="h-4 w-4 mr-1" />
            <span>관리자</span>
          </Link>
        </Button>
      </div>

      {/* 모바일 관리자 링크 */}
      <div className="flex justify-center mt-4 md:hidden">
        <Button 
          asChild
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Link to="/admin">
            <Settings className="h-4 w-4 mr-1" />
            <span>관리자</span>
          </Link>
        </Button>
      </div>
    </nav>
  );
};

export default NavigationMenu;
