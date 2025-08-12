import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstSetup, setIsFirstSetup] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Check if this is the first setup
    const adminConfigured = localStorage.getItem("adminConfigured");
    if (!adminConfigured) {
      setIsFirstSetup(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const storedAdmin = localStorage.getItem("adminCredentials");
      
      if (isFirstSetup) {
        // First time setup - create admin account
        if (password.length < 6) {
          toast({
            title: "Setup Failed",
            description: "Password must be at least 6 characters long.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const adminData = {
          email: email.toLowerCase().trim(),
          password: password, // In production, this should be hashed
          createdAt: new Date().toISOString()
        };
        
        localStorage.setItem("adminCredentials", JSON.stringify(adminData));
        localStorage.setItem("adminConfigured", "true");
        localStorage.setItem("isAdminLoggedIn", "true");
        localStorage.setItem("adminEmail", email);
        
        toast({
          title: "Admin Account Created",
          description: "Welcome! Your admin account has been successfully set up.",
        });
        navigate("/admin/dashboard");
      } else {
        // Regular login
        if (!storedAdmin) {
          toast({
            title: "Login Failed",
            description: "No admin account found. Please contact support.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }

        const adminData = JSON.parse(storedAdmin);
        
        if (email.toLowerCase().trim() === adminData.email && password === adminData.password) {
          localStorage.setItem("isAdminLoggedIn", "true");
          localStorage.setItem("adminEmail", email);
          toast({
            title: "Login Successful",
            description: "Welcome back to the admin dashboard!",
          });
          navigate("/admin/dashboard");
        } else {
          toast({
            title: "Login Failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during authentication. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-hero">
      <Card className="w-full max-w-md mx-4 gradient-card border-border/50 shadow-secondary">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {isFirstSetup ? "Admin Setup" : "Admin Login"}
          </CardTitle>
          <CardDescription>
            {isFirstSetup 
              ? "Create your admin account to access the dashboard" 
              : "Access the Dajin admin dashboard"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@yourcompany.com"
                required
                className="bg-muted/50 border-border focus:border-secondary"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isFirstSetup ? "Create a strong password" : "Enter your password"}
                  required
                  minLength={6}
                  className="bg-muted/50 border-border focus:border-secondary pr-10"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              {isFirstSetup && (
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long
                </p>
              )}
            </div>
            
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading || !email || !password}
            >
              {isLoading 
                ? "Processing..." 
                : isFirstSetup 
                  ? "Create Admin Account" 
                  : "Sign In"}
            </Button>
          </form>
          
          {!isFirstSetup && (
            <div className="mt-4 text-center">
              <p className="text-sm text-muted-foreground">
                Forgot your credentials? You'll need to reset the admin account.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminLogin;
