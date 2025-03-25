import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeFirebase } from "./lib/firebase";
import { LanguageProvider } from './contexts/LanguageContext'; // Added import for LanguageContext

// Initialize Firebase
initializeFirebase();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LanguageProvider> {/* Wrapped App with LanguageProvider */}
      <App />
    </LanguageProvider>
  </React.StrictMode>
);