import { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import { MobileLayout } from "@/components/MobileLayout";
import { useStore, initializeStoreFromLocalStorage } from "./lib/store";

import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import Feed from "@/pages/Feed";
import Submit from "@/pages/Submit";
import Wall from "@/pages/Wall";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/feed" component={Feed} />
      <Route path="/submit" component={Submit} />
      <Route path="/wall" component={Wall} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  const [, setLocation] = useLocation();
  const user = useStore((state) => state.user);

  useEffect(() => {
    initializeStoreFromLocalStorage();
  }, []);

  useEffect(() => {
    const currentPath = window.location.pathname;
    const validPaths = ["/", "/login", "/feed", "/submit", "/wall"];
    const isValidPath = validPaths.includes(currentPath);

    const storedUser = localStorage.getItem('voting-app-user');
    const hasUser = storedUser !== null;

    if (!isValidPath) {
      setLocation(hasUser ? "/feed" : "/");
      return;
    }

    if (hasUser && (currentPath === "/" || currentPath === "/login")) {
      setLocation("/feed");
    } else if (!hasUser && (currentPath === "/feed" || currentPath === "/submit" || currentPath === "/wall")) {
      setLocation("/");
    }
  }, [user, setLocation]);

  return <Router />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <MobileLayout>
          <AppContent />
        </MobileLayout>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
