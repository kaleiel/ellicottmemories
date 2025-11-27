import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Check localStorage and redirect before mounting app
const checkAndRedirect = () => {
  const currentPath = window.location.pathname;
  const validPaths = ["/", "/login", "/feed", "/submit", "/wall"];
  const isValidPath = validPaths.includes(currentPath);
  const storedUser = localStorage.getItem('voting-app-user');
  const hasUser = storedUser !== null;

  // If invalid path, redirect based on login status
  if (!isValidPath) {
    window.location.pathname = hasUser ? "/feed" : "/";
    return;
  }

  // If logged in but on landing/login page, redirect to feed
  if (hasUser && (currentPath === "/" || currentPath === "/login")) {
    window.location.pathname = "/feed";
    return;
  }

  // If not logged in but on protected pages, redirect to landing
  if (!hasUser && (currentPath === "/feed" || currentPath === "/submit" || currentPath === "/wall")) {
    window.location.pathname = "/";
    return;
  }
};

checkAndRedirect();

createRoot(document.getElementById("root")!).render(<App />);
