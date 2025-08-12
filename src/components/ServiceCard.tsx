import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface ServiceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  features: string[];
  price: string;
}

const ServiceCard = ({ icon: Icon, title, description, features, price }: ServiceCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleOrderNow = () => {
    navigate('/order');
    toast({
      title: `Ordering: ${title}`,
      description: "Fill out the order form and our team will contact you soon.",
    });
  };

  return (
    <Card className="gradient-card border-border/50 hover-glow transition-bounce group">
      <CardHeader className="text-center">
        <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
          <Icon className="h-8 w-8 text-white" />
        </div>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <CardDescription className="text-muted-foreground">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm">
              <div className="w-2 h-2 bg-secondary rounded-full mr-3 flex-shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gradient-primary mb-4">
            Starting at {price}
          </div>
          <Button variant="secondary" className="w-full" onClick={handleOrderNow}>
            Order Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServiceCard;