import { useEffect } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MobileLayout } from "@/components/MobileLayout";
import { useStore, initializeStoreFromLocalStorage } from "./lib/store";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Feed from "@/pages/Feed";
import Submit from "@/pages/Submit";
import Wall from "@/pages/Wall";
import Rewards from "@/pages/Rewards";

function AppContent() {
  const user = useStore((state) => state.user);
  const currentPage = useStore((state) => state.currentPage);

  useEffect(() => {
    initializeStoreFromLocalStorage();
  }, []);

  const renderPage = () => {
    if (!user && currentPage !== 'landing' && currentPage !== 'login') {
      return <Landing />;
    }
    
    if (user && (currentPage === 'landing' || currentPage === 'login')) {
      return <Feed />;
    }

    switch (currentPage) {
      case 'landing':
        return <Landing />;
      case 'login':
        return <Login />;
      case 'feed':
        return <Feed />;
      case 'submit':
        return <Submit />;
      case 'wall':
        return <Wall />;
      case 'rewards':
        return <Rewards />;
      default:
        return <Landing />;
    }
  };

  return (
    <div>
      <MobileLayout>
        {renderPage()}
      </MobileLayout>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
