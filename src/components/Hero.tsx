import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Zap, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useWebsiteSettings } from "@/contexts/WebsiteSettingsContext";
import heroBackground from "@/assets/hero-background.jpg";

const Hero = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { settings } = useWebsiteSettings();

  const handleStartProject = () => {
    navigate('/contact');
    toast({
      title: "Ready to Start?",
      description: "Let's discuss your project requirements and timeline.",
    });
  };

  const handleViewWork = () => {
    navigate('/services');
    toast({
      title: "Our Services",
      description: "Explore our comprehensive range of digital solutions.",
    });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{ backgroundImage: `url(${heroBackground})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-90" />
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
            {settings.heroTitle.split(' ').map((word, index, array) => 
              index === array.length - 1 ? (
                <span key={index} className="text-gradient-primary">{word}</span>
              ) : (
                <span key={index}>{word} </span>
              )
            )}
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            {settings.heroSubtitle}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="xl" className="group" onClick={handleStartProject}>
              {settings.heroButtonText}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button variant="premium" size="xl" onClick={handleViewWork}>
              {settings.heroSecondaryButtonText}
            </Button>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{settings.projectsCompleted}</h3>
            <p className="text-muted-foreground">Projects Delivered</p>
          </div>
          
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{settings.averageDelivery}</h3>
            <p className="text-muted-foreground">Average Delivery</p>
          </div>
          
          <div className="text-center animate-fade-in">
            <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">{settings.happyClients}</h3>
            <p className="text-muted-foreground">Happy Clients</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;