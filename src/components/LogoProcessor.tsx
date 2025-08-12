import { useState, useEffect } from 'react';
import { removeBackground, loadImage } from '@/utils/backgroundRemoval';
const rawLogoUrl = '/lovable-uploads/04d09453-855f-4d02-aacd-b643c729e447.png';

const LogoProcessor = () => {
  const [processedLogo, setProcessedLogo] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const processLogo = async () => {
      try {
        setIsProcessing(true);
        
        // Load the raw logo
        const response = await fetch(rawLogoUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch logo: ${response.status} ${response.statusText}`);
        }
        const blob = await response.blob();
        const img = await loadImage(blob);
        
        // Remove background
        const processedBlob = await removeBackground(img);
        const processedUrl = URL.createObjectURL(processedBlob);
        
        setProcessedLogo(processedUrl);
      } catch (error) {
        console.error('Error processing logo:', error);
        // Fallback to original image
        setProcessedLogo(null);
      } finally {
        setIsProcessing(false);
      }
    };

    processLogo();
  }, []);

  if (isProcessing) {
    return (
      <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center animate-pulse">
        <span className="text-white font-bold text-lg">D</span>
      </div>
    );
  }

  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden">
      {processedLogo ? (
        <img 
          src={processedLogo} 
          alt="Dajin Logo" 
          className="w-full h-full object-contain"
        />
      ) : (
        <div className="w-8 h-8 bg-gradient-secondary rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">D</span>
        </div>
      )}
    </div>
  );
};

export default LogoProcessor;