import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Define color variables for the theme
document.documentElement.style.setProperty("--background", "0 0% 98%");
document.documentElement.style.setProperty("--foreground", "222.2 47.4% 11.2%");
document.documentElement.style.setProperty("--primary", "222.2 47.4% 11.2%");
document.documentElement.style.setProperty("--primary-foreground", "210 40% 98%");
document.documentElement.style.setProperty("--card", "0 0% 100%");
document.documentElement.style.setProperty("--card-foreground", "222.2 47.4% 11.2%");
document.documentElement.style.setProperty("--popover", "0 0% 100%");
document.documentElement.style.setProperty("--popover-foreground", "222.2 47.4% 11.2%");
document.documentElement.style.setProperty("--secondary", "214.3 31.8% 91.4%");
document.documentElement.style.setProperty("--secondary-foreground", "222.2 47.4% 11.2%");
document.documentElement.style.setProperty("--muted", "214.3 31.8% 91.4%");
document.documentElement.style.setProperty("--muted-foreground", "215.4 16.3% 46.9%");
document.documentElement.style.setProperty("--accent", "214.3 31.8% 91.4%");
document.documentElement.style.setProperty("--accent-foreground", "222.2 47.4% 11.2%");
document.documentElement.style.setProperty("--destructive", "0 100% 50%");
document.documentElement.style.setProperty("--destructive-foreground", "210 40% 98%");
document.documentElement.style.setProperty("--border", "214.3 31.8% 91.4%");
document.documentElement.style.setProperty("--input", "214.3 31.8% 91.4%");
document.documentElement.style.setProperty("--ring", "222.2 47.4% 11.2%");
document.documentElement.style.setProperty("--radius", "0.5rem");

// App-specific colors
document.documentElement.style.setProperty("--primary-50", "239 246 255");
document.documentElement.style.setProperty("--primary-100", "224 242 254");
document.documentElement.style.setProperty("--primary-500", "99 102 241");
document.documentElement.style.setProperty("--primary-600", "79 70 229");
document.documentElement.style.setProperty("--primary-700", "67 56 202");

document.documentElement.style.setProperty("--secondary-500", "16 185 129");
document.documentElement.style.setProperty("--secondary-600", "5 150 105");

document.documentElement.style.setProperty("--accent-500", "236 72 153");
document.documentElement.style.setProperty("--accent-600", "219 39 119");

createRoot(document.getElementById("root")!).render(<App />);
