import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '../lib/store';
import { Home, PlusSquare, Award, LogOut, ArrowUp, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const mainRef = useRef<HTMLElement>(null);
  const user = useStore((state) => state.user);
  const currentPage = useStore((state) => state.currentPage);
  const setCurrentPage = useStore((state) => state.setCurrentPage);
  const resetCache = useStore((state) => state.resetCache);

  const showNav = user && currentPage !== 'login';

  useEffect(() => {
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      setShowScrollToTop(target.scrollTop > 80);
    };

    const mainElement = mainRef.current;
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
      return () => mainElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleLogout = () => {
    resetCache();
  };

  return (
    <div className="min-h-screen bg-background flex justify-center w-full">
      <div className="w-full max-w-md bg-card shadow-2xl min-h-screen relative flex flex-col border-x border-border/50">
        {/* Top Bar (only for logged in) */}
        {showNav && (
          <header className="bg-background border-b border-border p-3 flex justify-center items-center">
            <img 
              src="/logo_layout.png" 
              alt="Old Ellicott City Partnership Logo" 
              className="object-contain max-w-[50%] max-w-[10%]"
            />
            <button 
              onClick={handleLogout} 
              className="absolute right-4 text-muted-foreground hover:text-destructive transition-colors"
              data-testid="button-logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </header>
        )}

        {/* Main Content */}
        <main ref={mainRef} className={cn("flex-1 overflow-y-auto", showNav ? "pb-20" : "")}>
          {children}
        </main>

        {/* Scroll to Top Button */}
        {showScrollToTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-24 bg-primary text-primary-foreground rounded-full p-3 shadow-lg hover:bg-primary/90 transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 z-40"
            style={{
              right: 'calc(50% - 14rem + 1rem)',
              maxWidth: 'calc(28rem - 2rem)',
            }}
            data-testid="button-scroll-to-top"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        {/* Bottom Navigation */}
        {showNav && (
          <nav className="fixed bottom-0 max-w-md w-full bg-background border-t border-border flex justify-around py-3 px-2 z-50 safe-area-bottom">
            <button 
              onClick={() => setCurrentPage('feed')}
              className={cn("flex flex-col items-center gap-1 p-2 rounded-lg transition-colors", currentPage === 'feed' ? "text-primary" : "text-muted-foreground hover:text-foreground")}
            >
              <Home className="w-6 h-6" />
              <span className="text-xs font-medium">Feed</span>
            </button>
            <button 
              onClick={() => setCurrentPage('submit')}
              className={cn("flex flex-col items-center gap-1 p-2 rounded-lg transition-colors", currentPage === 'submit' ? "text-primary" : "text-muted-foreground hover:text-foreground")}
            >
              <PlusSquare className="w-6 h-6" />
              <span className="text-xs font-medium">Submit</span>
            </button>
            <button 
              onClick={() => setCurrentPage('wall')}
              className={cn("flex flex-col items-center gap-1 p-2 rounded-lg transition-colors", currentPage === 'wall' ? "text-primary" : "text-muted-foreground hover:text-foreground")}
            >
              <Award className="w-6 h-6" />
              <span className="text-xs font-medium">The Wall</span>
            </button>
            <button 
              onClick={() => setCurrentPage('rewards')}
              className={cn("flex flex-col items-center gap-1 p-2 rounded-lg transition-colors", currentPage === 'rewards' ? "text-primary" : "text-muted-foreground hover:text-foreground")}
            >
              <Gift className="w-6 h-6" />
              <span className="text-xs font-medium">Rewards</span>
            </button>
          </nav>
        )}
      </div>
    </div>
  );
}
