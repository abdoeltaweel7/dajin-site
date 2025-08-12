import React, { createContext, useContext, useState, useEffect } from 'react';

export interface WebsiteSettings {
  // Logo & Branding
  logo: string | null;
  siteName: string;
  tagline: string;
  
  // Company Information
  companyDescription: string;
  aboutUs: string;
  companyStory: string;
  foundedYear: string;
  
  // Contact Information
  contactEmail: string;
  phone: string;
  address: string;
  
  // Hero Section
  heroTitle: string;
  heroSubtitle: string;
  heroButtonText: string;
  heroSecondaryButtonText: string;
  
  // Statistics
  projectsCompleted: string;
  happyClients: string;
  averageDelivery: string;
  clientSatisfaction: string;
  
  // Mission, Vision, Values
  mission: string;
  vision: string;
  values: string;
  
  // Social Media
  website: string;
  linkedin: string;
  github: string;
  mail: string;
  twitter: string;
  facebook: string;
  instagram: string;
  showLinkedin?: boolean;
  showGithub?: boolean;
  showMail?: boolean;
  
  // SEO
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}

const defaultSettings: WebsiteSettings = {
  logo: null,
  siteName: "Dajin",
  tagline: "Custom Web Development Company",
  companyDescription: "Custom web development company",
  aboutUs: "We are a passionate team of developers, designers, and digital strategists committed to creating exceptional digital experiences.",
  companyStory: "Founded in 2020, Dajin started as a small team of passionate developers who believed that every business deserves a digital presence that truly represents their vision and values.",
  foundedYear: "2020",
  contactEmail: "hello@dajin.dev",
  phone: "+1 (555) 123-4567",
  address: "123 Tech Street, Digital City, DC 12345",
  heroTitle: "We Build What You Imagine",
  heroSubtitle: "Custom websites, mobile apps, and web applications crafted with precision and passion. Transform your ideas into digital reality.",
  heroButtonText: "Start Your Project",
  heroSecondaryButtonText: "View Our Work",
  projectsCompleted: "100+",
  happyClients: "50+",
  averageDelivery: "2 Week",
  clientSatisfaction: "99%",
  mission: "To empower businesses with cutting-edge digital solutions that drive growth and success.",
  vision: "To be the leading development partner for innovative companies worldwide.",
  values: "Quality, innovation, and client satisfaction are at the heart of everything we do.",
  website: "https://dajin.dev",
  linkedin: "https://linkedin.com/company/dajin",
  github: "https://github.com/dajin",
  mail: "mailto:hello@dajin.dev",
  twitter: "https://twitter.com/dajin",
  facebook: "https://facebook.com/dajin",
  instagram: "https://instagram.com/dajin",
  showLinkedin: true,
  showGithub: true,
  showMail: true,
  metaTitle: "Dajin - Custom Web Development Company",
  metaDescription: "Professional web development, mobile apps, and digital solutions. Transform your ideas into reality with our expert development team.",
  metaKeywords: "web development, mobile apps, custom software, digital solutions"
};

interface WebsiteSettingsContextType {
  settings: WebsiteSettings;
  updateSettings: (newSettings: Partial<WebsiteSettings>) => void;
  resetSettings: () => void;
  reloadSettings: () => void;
}

const WebsiteSettingsContext = createContext<WebsiteSettingsContextType | undefined>(undefined);

export const WebsiteSettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('websiteSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    }
    // Listen for storage changes (sync across tabs)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'websiteSettings') {
        const newSettings = e.newValue ? JSON.parse(e.newValue) : defaultSettings;
        setSettings({ ...defaultSettings, ...newSettings });
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('websiteSettings', JSON.stringify(settings));
  }, [settings]);

  const updateSettings = (newSettings: Partial<WebsiteSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('websiteSettings');
  };

  // Add a reload function to force reload from localStorage
  const reloadSettings = () => {
    const savedSettings = localStorage.getItem('websiteSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        setSettings(defaultSettings);
      }
    } else {
      setSettings(defaultSettings);
    }
  };

  return (
    <WebsiteSettingsContext.Provider value={{ settings, updateSettings, resetSettings, reloadSettings }}>
      {children}
    </WebsiteSettingsContext.Provider>
  );
};

export const useWebsiteSettings = () => {
  const context = useContext(WebsiteSettingsContext);
  if (context === undefined) {
    throw new Error('useWebsiteSettings must be used within a WebsiteSettingsProvider');
  }
  return context;
};