import React from 'react';
import { Menu, Bell } from 'lucide-react';

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
  profileImage: string;
}

export default function TopBar({ title, onMenuClick, profileImage }: TopBarProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl flex justify-between items-center px-6 h-20 border-b border-white/5">
      <button 
        onClick={onMenuClick}
        className="text-primary hover:text-primary-container transition-colors"
      >
        <Menu className="w-6 h-6" />
      </button>

      <h1 className="font-headline italic tracking-tighter text-2xl text-primary absolute left-1/2 -translate-x-1/2">
        {title}
      </h1>

      <div className="flex items-center gap-4">
        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-primary/20">
          <img 
            src={profileImage} 
            alt="Profile" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
}
