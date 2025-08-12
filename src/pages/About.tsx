import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Target, Eye, Heart, Award, Users, Zap } from "lucide-react";
import { useWebsiteSettings } from "@/contexts/WebsiteSettingsContext";

const About = () => {
  const { settings } = useWebsiteSettings();
  
  const values = [
    {
      icon: Target,
      title: "Mission",
      description: settings.mission
    },
    {
      icon: Eye,
      title: "Vision",
      description: settings.vision
    },
    {
      icon: Heart,
      title: "Values",
      description: settings.values
    }
  ];

  const stats = [
    { icon: Users, value: settings.happyClients, label: "Happy Clients" },
    { icon: Award, value: settings.projectsCompleted, label: "Projects Completed" },
    { icon: Zap, value: settings.averageDelivery, label: "Average Delivery" },
    { icon: Target, value: settings.clientSatisfaction, label: "Client Satisfaction" }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About <span className="text-gradient-primary">{settings.siteName}</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            {settings.aboutUs}
          </p>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-gradient-card">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="gradient-card border-border/50 hover-glow transition-bounce">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-gradient-primary">Impact</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Numbers that speak to our commitment to excellence and client success.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-white" />
                </div>
                <div className="text-3xl font-bold mb-2 text-gradient-primary">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-gradient-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-gradient-primary">Story</span>
            </h2>
          </div>
          
          <div className="prose prose-lg max-w-none text-muted-foreground">
            <p className="mb-6">
              {settings.companyStory}
            </p>
            
            <p className="mb-6">
              What began as a local web development service has evolved into a comprehensive digital 
              solutions provider, serving clients across various industries and geographical locations. 
              Our growth has been driven by our commitment to quality, innovation, and exceptional client service.
            </p>
            
            <p className="mb-6">
              Today, we specialize in creating custom websites, mobile applications, and web applications 
              that not only look stunning but also deliver measurable results for our clients' businesses.
            </p>
            
            <p>
              We believe that great digital products are born from the perfect blend of technical expertise, 
              creative vision, and deep understanding of our clients' needs. This philosophy continues to 
              guide us as we help businesses transform their digital presence.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Work with Us?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Let's discuss how we can help bring your digital vision to life.
          </p>
          <Button variant="hero" size="xl">
            Get in Touch
          </Button>
        </div>
      </section>
    </div>
  );
};

export default About;