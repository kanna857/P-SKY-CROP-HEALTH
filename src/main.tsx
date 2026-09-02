import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Prevent stale PWA service worker caching from blocking live updates in dev
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    for (const registration of registrations) {
      registration.unregister();
    }
  });
}

createRoot(document.getElementById("root")!).render(<App />);
