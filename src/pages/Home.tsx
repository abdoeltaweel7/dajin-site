import Hero from "@/components/Hero";
import ServiceCard from "@/components/ServiceCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Code, Smartphone, Palette, Wrench } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [highlightedServices, setHighlightedServices] = useState<any[]>([]);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const response = await axios.get('/api/services');
        setHighlightedServices(response.data.filter((s: any) => s.active && s.highlighted));
      } catch (error) {
        console.error('Error loading services:', error);
      }
    };
    loadServices();
  }, []);

  const handleGetStarted = () => {
    navigate('/contact');
    toast({
      title: "Ready to Build!",
      description: "Let's bring your vision to life. We'll respond within 24 hours.",
    });
  };

  // Map icon name to LucideIcon
  const iconMap: Record<string, any> = {
    Code,
    Smartphone,
    Palette,
    Wrench,
  };

  return (
    <div className="min-h-screen">
      <Hero />
      {/* Services Section */}
      <section className="py-20 bg-gradient-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-gradient-primary">Services</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From concept to deployment, we provide end-to-end solutions for your digital needs.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {highlightedServices.length === 0 ? (
              <div className="col-span-full text-center text-muted-foreground">No highlighted services to display.</div>
            ) : (
              highlightedServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  icon={iconMap[service.icon] || Code}
                  title={service.title}
                  description={service.description}
                  features={service.features}
                  price={service.price}
                />
              ))
            )}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Build Something <span className="text-gradient-primary">Amazing?</span>
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's discuss your project and bring your vision to life. Get a free consultation today.
          </p>
          <Button variant="hero" size="xl" className="group" onClick={handleGetStarted}>
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Home;