import React from 'react';
import { Menu, Bell } from 'lucide-react';

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
  profileImage: string | undefined;
}

export default function TopBar({ title, onMenuClick, profileImage }: TopBarProps) {
  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-xl flex justify-between items-center px-6 h-16 border-b border-white/5">
      <button 
        onClick={onMenuClick}
        aria-label="Open menu"
        className="text-primary hover:text-primary-container transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-lg"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="font-headline italic tracking-tight text-xl text-primary absolute left-1/2 -translate-x-1/2 truncate max-w-[50%]">
        {title}
      </h1>

      <div className="flex items-center gap-3">
        <button
          aria-label="Open notifications"
          className="text-on-surface-variant hover:text-primary transition-colors focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-lg"
        >
          <Bell className="w-4 h-4" />
        </button>
        <div className="w-7 h-7 rounded-full overflow-hidden border border-primary/20 bg-surface-container-highest flex items-center justify-center relative">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : null}
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-full h-full bg-primary/10 flex items-center justify-center">
               <span className="text-[10px] text-primary font-bold">O</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
