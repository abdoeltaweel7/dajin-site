import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Upload, Globe, User, MessageSquare, BarChart3, Palette, Shield } from "lucide-react";
import { useWebsiteSettings } from "@/contexts/WebsiteSettingsContext";
import { useToast } from "@/hooks/use-toast";

const AdminSettings = () => {
  const { settings, updateSettings, reloadSettings } = useWebsiteSettings();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Convert image to base64 for persistence
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Logo = reader.result as string;
        updateSettings({ logo: base64Logo });
        toast({
          title: "Logo Updated",
          description: "Your website logo has been updated successfully.",
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload logo. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = (section: string) => {
    toast({
      title: "Settings Saved",
      description: `${section} settings have been updated successfully.`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Website Settings</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={reloadSettings}>
            Reload Settings
          </Button>
          <Button variant="hero" onClick={() => window.open('/', '_blank')}>
            <Globe className="h-4 w-4 mr-2" />
            Preview Website
          </Button>
        </div>
      </div>

      <Tabs defaultValue="branding" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="branding">
            <Palette className="h-4 w-4 mr-2" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="content">
            <MessageSquare className="h-4 w-4 mr-2" />
            Content
          </TabsTrigger>
          <TabsTrigger value="company">
            <User className="h-4 w-4 mr-2" />
            Company
          </TabsTrigger>
          <TabsTrigger value="stats">
            <BarChart3 className="h-4 w-4 mr-2" />
            Statistics
          </TabsTrigger>
          <TabsTrigger value="seo">
            <Globe className="h-4 w-4 mr-2" />
            SEO
          </TabsTrigger>
          <TabsTrigger value="admin">
            <Shield className="h-4 w-4 mr-2" />
            Admin
          </TabsTrigger>
        </TabsList>

        <TabsContent value="branding" className="space-y-6">
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Logo & Branding</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Current Logo</Label>
                <div className="flex items-center space-x-4 mt-2">
                  {settings.logo ? (
                    <img src={settings.logo} alt="Logo" className="w-16 h-16 object-contain rounded border" />
                  ) : (
                    <div className="w-16 h-16 bg-gradient-secondary rounded flex items-center justify-center">
                      <span className="text-white font-bold text-lg">{settings.siteName.charAt(0)}</span>
                    </div>
                  )}
                  <Button 
                    variant="outline" 
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {isUploading ? "Uploading..." : "Upload Logo"}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="site-name">Site Name</Label>
                <Input 
                  id="site-name" 
                  value={settings.siteName}
                  onChange={(e) => updateSettings({ siteName: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input 
                  id="tagline" 
                  value={settings.tagline}
                  onChange={(e) => updateSettings({ tagline: e.target.value })}
                />
              </div>
              
              <Button variant="hero" onClick={() => handleSave("Branding")}>
                <Save className="h-4 w-4 mr-2" />
                Save Branding
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="hero-title">Hero Title</Label>
                  <Textarea 
                    id="hero-title" 
                    value={settings.heroTitle}
                    onChange={(e) => updateSettings({ heroTitle: e.target.value })}
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                  <Textarea 
                    id="hero-subtitle" 
                    value={settings.heroSubtitle}
                    onChange={(e) => updateSettings({ heroSubtitle: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="hero-button">Primary Button Text</Label>
                  <Input 
                    id="hero-button" 
                    value={settings.heroButtonText}
                    onChange={(e) => updateSettings({ heroButtonText: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="hero-secondary-button">Secondary Button Text</Label>
                  <Input 
                    id="hero-secondary-button" 
                    value={settings.heroSecondaryButtonText}
                    onChange={(e) => updateSettings({ heroSecondaryButtonText: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-card border-border/50">
              <CardHeader>
                <CardTitle>About Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="about-us">About Us</Label>
                  <Textarea 
                    id="about-us" 
                    value={settings.aboutUs}
                    onChange={(e) => updateSettings({ aboutUs: e.target.value })}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="company-story">Company Story</Label>
                  <Textarea 
                    id="company-story" 
                    value={settings.companyStory}
                    onChange={(e) => updateSettings({ companyStory: e.target.value })}
                    rows={4}
                  />
                </div>
                
                <div>
                  <Label htmlFor="founded-year">Founded Year</Label>
                  <Input 
                    id="founded-year" 
                    value={settings.foundedYear}
                    onChange={(e) => updateSettings({ foundedYear: e.target.value })}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Button variant="hero" onClick={() => handleSave("Content")}>
            <Save className="h-4 w-4 mr-2" />
            Save Content
          </Button>
        </TabsContent>

        <TabsContent value="company" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contact-email">Contact Email</Label>
                  <Input 
                    id="contact-email" 
                    type="email"
                    value={settings.contactEmail}
                    onChange={(e) => updateSettings({ contactEmail: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input 
                    id="phone" 
                    value={settings.phone}
                    onChange={(e) => updateSettings({ phone: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="address">Address</Label>
                  <Textarea 
                    id="address" 
                    value={settings.address}
                    onChange={(e) => updateSettings({ address: e.target.value })}
                    rows={2}
                  />
                </div>
                <div className="mt-6">
                  <h4 className="font-semibold mb-2">Footer Social Links</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="showLinkedin" checked={settings.showLinkedin ?? true} onChange={e => updateSettings({ showLinkedin: e.target.checked })} />
                      <Label htmlFor="showLinkedin">Show LinkedIn</Label>
                      <Input className="ml-2" value={settings.linkedin} onChange={e => updateSettings({ linkedin: e.target.value })} placeholder="LinkedIn URL" />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="showGithub" checked={settings.showGithub ?? true} onChange={e => updateSettings({ showGithub: e.target.checked })} />
                      <Label htmlFor="showGithub">Show GitHub</Label>
                      <Input className="ml-2" value={settings.github} onChange={e => updateSettings({ github: e.target.value })} placeholder="GitHub URL" />
                    </div>
                    <div className="flex items-center gap-2">
                      <input type="checkbox" id="showMail" checked={settings.showMail ?? true} onChange={e => updateSettings({ showMail: e.target.checked })} />
                      <Label htmlFor="showMail">Show Mail</Label>
                      <Input className="ml-2" value={settings.mail} onChange={e => updateSettings({ mail: e.target.value })} placeholder="Mailto or Email" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Mission, Vision & Values</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="mission">Mission</Label>
                  <Textarea 
                    id="mission" 
                    value={settings.mission}
                    onChange={(e) => updateSettings({ mission: e.target.value })}
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="vision">Vision</Label>
                  <Textarea 
                    id="vision" 
                    value={settings.vision}
                    onChange={(e) => updateSettings({ vision: e.target.value })}
                    rows={2}
                  />
                </div>
                
                <div>
                  <Label htmlFor="values">Values</Label>
                  <Textarea 
                    id="values" 
                    value={settings.values}
                    onChange={(e) => updateSettings({ values: e.target.value })}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Button variant="hero" onClick={() => handleSave("Company")}>
            <Save className="h-4 w-4 mr-2" />
            Save Company Info
          </Button>
        </TabsContent>

        <TabsContent value="stats" className="space-y-6">
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Website Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="projects-completed">Projects Completed</Label>
                  <Input 
                    id="projects-completed" 
                    value={settings.projectsCompleted}
                    onChange={(e) => updateSettings({ projectsCompleted: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="happy-clients">Happy Clients</Label>
                  <Input 
                    id="happy-clients" 
                    value={settings.happyClients}
                    onChange={(e) => updateSettings({ happyClients: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="average-delivery">Average Delivery</Label>
                  <Input 
                    id="average-delivery" 
                    value={settings.averageDelivery}
                    onChange={(e) => updateSettings({ averageDelivery: e.target.value })}
                  />
                </div>
                
                <div>
                  <Label htmlFor="client-satisfaction">Client Satisfaction</Label>
                  <Input 
                    id="client-satisfaction" 
                    value={settings.clientSatisfaction}
                    onChange={(e) => updateSettings({ clientSatisfaction: e.target.value })}
                  />
                </div>
              </div>
              
              <Button variant="hero" onClick={() => handleSave("Statistics")}>
                <Save className="h-4 w-4 mr-2" />
                Save Statistics
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seo" className="space-y-6">
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle>SEO Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="meta-title">Meta Title</Label>
                <Input 
                  id="meta-title" 
                  value={settings.metaTitle}
                  onChange={(e) => updateSettings({ metaTitle: e.target.value })}
                />
              </div>
              
              <div>
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea 
                  id="meta-description" 
                  value={settings.metaDescription}
                  onChange={(e) => updateSettings({ metaDescription: e.target.value })}
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="meta-keywords">Meta Keywords</Label>
                <Input 
                  id="meta-keywords" 
                  value={settings.metaKeywords}
                  onChange={(e) => updateSettings({ metaKeywords: e.target.value })}
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
              
              <Button variant="hero" onClick={() => handleSave("SEO")}>
                <Save className="h-4 w-4 mr-2" />
                Save SEO Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin" className="space-y-6">
          <Card className="gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Admin Account Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Change Admin Credentials</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Update your admin email and password. Make sure to use a strong password.
                </p>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-email">Current Admin Email</Label>
                    <Input 
                      id="current-email" 
                      type="email"
                      value={localStorage.getItem("adminEmail") || ""}
                      disabled
                      className="bg-muted/50"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="new-email">New Admin Email</Label>
                    <Input 
                      id="new-email" 
                      type="email"
                      placeholder="new-admin@yourcompany.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input 
                      id="current-password" 
                      type="password"
                      placeholder="Enter current password"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="new-password">New Password</Label>
                    <Input 
                      id="new-password" 
                      type="password"
                      placeholder="Enter new password (min 6 characters)"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input 
                      id="confirm-password" 
                      type="password"
                      placeholder="Confirm new password"
                    />
                  </div>
                  
                  <Button 
                    variant="hero"
                    onClick={() => {
                      const newEmail = (document.getElementById('new-email') as HTMLInputElement)?.value;
                      const currentPassword = (document.getElementById('current-password') as HTMLInputElement)?.value;
                      const newPassword = (document.getElementById('new-password') as HTMLInputElement)?.value;
                      const confirmPassword = (document.getElementById('confirm-password') as HTMLInputElement)?.value;
                      
                      if (!currentPassword || !newPassword || !confirmPassword) {
                        alert('Please fill in all password fields');
                        return;
                      }
                      
                      if (newPassword !== confirmPassword) {
                        alert('New passwords do not match');
                        return;
                      }
                      
                      if (newPassword.length < 6) {
                        alert('Password must be at least 6 characters long');
                        return;
                      }
                      
                      try {
                        const storedAdmin = localStorage.getItem("adminCredentials");
                        if (!storedAdmin) {
                          alert('No admin account found');
                          return;
                        }
                        
                        const adminData = JSON.parse(storedAdmin);
                        
                        if (currentPassword !== adminData.password) {
                          alert('Current password is incorrect');
                          return;
                        }
                        
                        const updatedAdmin = {
                          ...adminData,
                          email: newEmail || adminData.email,
                          password: newPassword,
                          updatedAt: new Date().toISOString()
                        };
                        
                        localStorage.setItem("adminCredentials", JSON.stringify(updatedAdmin));
                        if (newEmail) {
                          localStorage.setItem("adminEmail", newEmail);
                        }
                        
                        // Clear form
                        (document.getElementById('new-email') as HTMLInputElement).value = '';
                        (document.getElementById('current-password') as HTMLInputElement).value = '';
                        (document.getElementById('new-password') as HTMLInputElement).value = '';
                        (document.getElementById('confirm-password') as HTMLInputElement).value = '';
                        
                        alert('Admin credentials updated successfully!');
                      } catch (error) {
                        alert('Error updating credentials. Please try again.');
                      }
                    }}
                  >
                    Update Credentials
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4 text-red-400">Danger Zone</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Resetting the admin account will log you out and require you to set up a new admin account.
                </p>
                
                <Button 
                  variant="destructive"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to reset the admin account? This will log you out and require you to set up a new admin account.')) {
                      localStorage.removeItem("adminConfigured");
                      localStorage.removeItem("adminCredentials");
                      localStorage.removeItem("isAdminLoggedIn");
                      localStorage.removeItem("adminEmail");
                      window.location.href = "/admin/login";
                    }
                  }}
                >
                  Reset Admin Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
