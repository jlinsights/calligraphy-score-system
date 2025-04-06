
import React from 'react';
import { cn } from '@/lib/utils';

interface NavigationMenuProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const NavigationMenu: React.FC<NavigationMenuProps> = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: 'schedule', label: '심사계획서' },
    { id: 'evaluation', label: '심사표' },
    { id: 'feedback', label: '심사의견서' },
    { id: 'results', label: '심사결과종합표' },
  ];

  return (
    <nav className="mb-8">
      <ul className="flex flex-wrap justify-center gap-2 md:gap-4">
        {menuItems.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => setActiveSection(item.id)}
              className={cn(
                "py-2 px-4 rounded-md transition-all",
                activeSection === item.id
                  ? "bg-[#C53030] text-white font-medium"
                  : "bg-[#F7F2E9] text-[#1A1F2C] hover:bg-[#E4D7C5]"
              )}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavigationMenu;
