import { useEffect } from 'react';
import { useWebsiteSettings } from '@/contexts/WebsiteSettingsContext';

const SEOHead = () => {
  const { settings } = useWebsiteSettings();

  useEffect(() => {
    // Update document title
    document.title = settings.metaTitle || `${settings.siteName} - ${settings.tagline}`;
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', settings.metaDescription || settings.companyDescription);
    }
    
    // Update meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]');
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta');
      metaKeywords.setAttribute('name', 'keywords');
      document.head.appendChild(metaKeywords);
    }
    metaKeywords.setAttribute('content', settings.metaKeywords);
    
    // Update Open Graph title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', settings.metaTitle || `${settings.siteName} - ${settings.tagline}`);
    }
    
    // Update Open Graph description
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', settings.metaDescription || settings.companyDescription);
    }
  }, [settings]);

  return null; // This component doesn't render anything
};

export default SEOHead;