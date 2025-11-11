'use client';

import { Menu, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Profile from './Profile';

interface HeaderProps {
  toggleMobileSidebar: () => void;
}

export default function Header({ toggleMobileSidebar }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={toggleMobileSidebar}
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="flex flex-1 items-center justify-end gap-4 px-4">
        <Button variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </Button>
        <Profile />
      </div>
    </header>
  );
}
