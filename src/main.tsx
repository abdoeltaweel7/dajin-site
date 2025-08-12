import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { WebsiteSettingsProvider } from './contexts/WebsiteSettingsContext'

createRoot(document.getElementById("root")!).render(
  <WebsiteSettingsProvider>
    <App />
  </WebsiteSettingsProvider>
);
