import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize app state from localStorage
const storedUser = localStorage.getItem('voting-app-user');
if (storedUser) {
  try {
    const userData = JSON.parse(storedUser);
    console.log('User found in localStorage, will auto-login on app start');
  } catch (error) {
    localStorage.removeItem('voting-app-user');
  }
}

createRoot(document.getElementById("root")!).render(<App />);
