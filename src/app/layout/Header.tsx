// Header.tsx
'use client';

import { CreditCard, User, Moon, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { type Route } from 'next';
import { useTheme } from '../context/ThemeContext';
import { useState, useEffect, useRef } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

const categories = [
  { name: 'Content', path: '/content' as Route },
  { name: 'AI Engine', path: '/ai' as Route },
  { name: 'Store', path: '/store' as Route },
] as const;

interface CreditBalance {
  total: number;
  subscription_credits: number;
  additional_credits: number;
}

export default function Header() {
  const pathname = usePathname();
  const currentCategory = categories.find(cat => pathname?.startsWith(cat.path));
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [credits, setCredits] = useState<CreditBalance>({ total: 0, subscription_credits: 0, additional_credits: 0 });
  const [showCreditsDropdown, setShowCreditsDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowCreditsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch credits on mount
  useEffect(() => {
    setMounted(true);
    const fetchCredits = async () => {
      try {
        const supabase = createClientComponentClient();
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data, error } = await supabase
            .rpc('get_total_credits', {
              user_id: session.user.id
            });
          
          if (!error && data) {
            setCredits(data);
          }
        }
      } catch (err) {
        console.error('Unexpected error:', err);
      }
    };

    fetchCredits();
  }, []);

  const headerClassName = cn(
    "sticky top-0 z-50",
    "border-b border-[var(--border-color)]",
    "bg-[#fafafa] dark:bg-[var(--background)]",
    "transition-colors duration-300"
  );

  const logoClassName = cn(
    "text-lg font-semibold transition-colors",
    "text-[var(--foreground)] hover:text-[var(--foreground)]"
  );

  const navLinkClassName = (isActive: boolean) => cn(
    "px-3 h-14 flex items-center text-base font-medium transition-colors relative",
    isActive && "after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-[3px] after:bg-[var(--accent)]",
    isActive
      ? "text-[var(--foreground)] font-semibold"
      : "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
  );

  const iconClassName = cn(
    "transition-colors",
    "text-[var(--text-secondary)] hover:text-[var(--foreground)]"
  );

  const dropdownClassName = cn(
    "absolute right-0 top-full mt-2 w-64 rounded-md shadow-lg",
    "bg-[var(--card-bg)] border border-[var(--border-color)]",
    "py-2 px-3",
    "z-50"
  );

  return (
    <header className={headerClassName}>
      <div className="flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section - Logo and Navigation */}
        <div className="flex items-center h-full">
          <Link
            href={'/' as Route}
            className={logoClassName}
          >
            The Persuasion Academy
          </Link>

          {/* Navigation Categories */}
          <nav className="hidden sm:block h-full ml-8">
            <ul className="flex space-x-8 h-full">
              {categories.map((category) => (
                <li key={category.path} className="h-full">
                  <Link
                    href={category.path}
                    className={navLinkClassName(pathname?.startsWith(category.path))}
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center space-x-4">
          <div className="relative" ref={dropdownRef}>
            <button 
              className={`flex items-center ${iconClassName}`}
              onClick={() => setShowCreditsDropdown(!showCreditsDropdown)}
            >
              <CreditCard className="h-5 w-5 mr-1" />
              <span className="text-sm">{credits.total.toLocaleString()}</span>
            </button>
            
            {showCreditsDropdown && (
              <div className={dropdownClassName}>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">Subscription Credits</span>
                    <span>{credits.subscription_credits.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">Additional Credits</span>
                    <span>{credits.additional_credits.toLocaleString()}</span>
                  </div>
                  <div className="my-2 border-t border-[var(--border-color)]" />
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-[var(--text-secondary)]">Total Credits</span>
                    <span>{credits.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          {mounted && (
            <button 
              onClick={toggleTheme}
              className={iconClassName}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
          )}
          <button className={iconClassName}>
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}