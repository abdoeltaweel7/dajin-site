import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2, Code, Smartphone, Palette, Wrench, Wifi, WifiOff, Cloud, HardDrive } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { hybridServicesAPI, localStorageAPI } from "@/lib/hybridAPI";

const AdminServices = () => {
  const { toast } = useToast();
  const [services, setServices] = useState<any[]>([]);
  const [syncStatus, setSyncStatus] = useState<any>(null);

  const [editingService, setEditingService] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // دالة تحديث حالة المزامنة
  const updateSyncStatus = () => {
    const status = hybridServicesAPI.getStatus();
    setSyncStatus(status);
    console.log('📊 Sync status:', status);
  };

  // دالة تحميل الخدمات من الـ API
  const loadServices = async () => {
    try {
      console.log('Loading services...');
      const data = await hybridServicesAPI.getAll();
      console.log('Services loaded:', data);
      setServices(data);
      updateSyncStatus();
    } catch (error) {
      console.error('Error loading services:', error);
      toast({
        title: "Error",
        description: `Failed to load services: ${error.message || error}`,
        variant: "destructive",
      });
    }
  };

  // اختبار مباشر لإنشاء خدمة
  const testCreateService = async () => {
    try {
      const testService = {
        title: "خدمة تجريبية",
        description: "وصف تجريبي للخدمة", 
        price: 100,
        category: "Development",
        duration: "1 week",
        features: ["ميزة 1", "ميزة 2"],
        icon: "Code",
        active: true,
        highlighted: false
      };
      
      console.log('Testing service creation with:', testService);
      const result = await hybridServicesAPI.create(testService);
      console.log('Test service created:', result);
      
      toast({
        title: "Success",
        description: "Test service created successfully!",
      });
      
      loadServices();
    } catch (error) {
      console.error('Test creation failed:', error);
      toast({
        title: "Test Failed",
        description: `Test creation failed: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  // اختبار الاتصال بالشبكة
  const checkNetworkConnection = async () => {
    try {
      console.log('Checking network connection...');
      const response = await fetch('https://www.google.com/favicon.ico', {
        method: 'HEAD',
        mode: 'no-cors'
      });
      console.log('Network check successful');
      return true;
    } catch (error) {
      console.error('Network check failed:', error);
      return false;
    }
  };

  // اختبار الاتصال بـ Supabase
  const testConnection = async () => {
    try {
      console.log('Testing connection...');
      const services = await hybridServicesAPI.getAll();
      console.log('Connection test successful, services count:', services.length);
    } catch (error) {
      console.error('Connection test failed:', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      const networkOk = await checkNetworkConnection();
      if (!networkOk) {
        toast({
          title: "Network Warning",
          description: "Network connection seems unstable. Please check your internet.",
          variant: "destructive",
        });
      }
      
      await testConnection();
      await loadServices();
      updateSyncStatus();
    };
    
    initialize();
    
    // تحديث حالة المزامنة كل 30 ثانية
    const interval = setInterval(updateSyncStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "Code": return Code;
      case "Smartphone": return Smartphone;
      case "Palette": return Palette;
      case "Wrench": return Wrench;
      default: return Code;
    }
  };

  const handleAddService = () => {
    setEditingService({
      // id will be assigned by database
      title: "",
      description: "",
      price: 0,
      features: [],
      icon: "Code",
      active: true,
      highlighted: false,
      category: "Development",
      duration: "1-2 weeks"
    });
    setIsDialogOpen(true);
  };

  const handleEditService = (service: any) => {
    setEditingService(service);
    setIsDialogOpen(true);
  };

  const handleSaveService = async () => {
    if (editingService) {
      // تحقق من الحقول المطلوبة
      if (!editingService.title || !editingService.description) {
        toast({
          title: "Error",
          description: "Title and description are required fields.",
          variant: "destructive",
        });
        return;
      }

      try {
        // تحضير البيانات للإرسال
        const serviceData = {
          ...editingService,
          price: Number(editingService.price) || 0,
          features: editingService.features || []
        };

        if (editingService.id) {
          await hybridServicesAPI.update(editingService.id, serviceData);
          toast({
            title: "Service Updated",
            description: "Service has been successfully updated.",
          });
        } else {
          const result = await hybridServicesAPI.create(serviceData);
          console.log('Service creation result:', result);
          toast({
            title: "Service Added",
            description: "Service has been successfully added.",
          });
        }
        loadServices();
        updateSyncStatus();
        setIsDialogOpen(false);
        setEditingService(null);
      } catch (error) {
        console.error("Error saving service:", error);
        
        // حتى لو حدث خطأ، نتحقق من localStorage لرؤية إذا تم الحفظ
        const currentServices = localStorageAPI?.getAll() || [];
        const beforeCount = services.length;
        
        if (currentServices.length > beforeCount) {
          // تم الحفظ في localStorage
          toast({
            title: "Saved Locally",
            description: "Service saved locally. Will sync when connection is restored.",
            variant: "default",
          });
          loadServices();
          updateSyncStatus();
          setIsDialogOpen(false);
          setEditingService(null);
        } else {
          // فشل حقيقي في الحفظ
          const errorMsg = error.message || error;
          toast({
            title: "Save Failed",
            description: `Failed to save service: ${errorMsg}`,
            variant: "destructive",
          });
        }
      }
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await hybridServicesAPI.delete(serviceId);
      loadServices();
      updateSyncStatus();
      toast({
        title: "Service Deleted",
        description: "Service has been removed.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service",
        variant: "destructive",
      });
    }
  };

  const toggleServiceStatus = async (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      try {
        await hybridServicesAPI.update(serviceId, { ...service, active: !service.active });
        loadServices();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update service status",
          variant: "destructive",
        });
      }
    }
  };

  const toggleHighlight = async (serviceId: string) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      try {
        await hybridServicesAPI.update(serviceId, { ...service, highlighted: !service.highlighted });
        loadServices();
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update service highlight",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Services Management</h2>
        <div className="space-x-2">
          <Button variant="outline" onClick={testCreateService}>
            Test Create
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              hybridServicesAPI.clearLocalData();
              loadServices();
              updateSyncStatus();
              toast({
                title: "Data Cleared",
                description: "Local data has been cleared",
              });
            }}
          >
            Clear Local
          </Button>
          <Button variant="hero" onClick={handleAddService}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </div>
      </div>

      {/* مؤشر حالة المزامنة */}
      {syncStatus && (
        <Card className="gradient-card border-border/50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {syncStatus.source === 'supabase' ? (
                  <Cloud className="h-5 w-5 text-green-500" />
                ) : (
                  <HardDrive className="h-5 w-5 text-orange-500" />
                )}
                <div>
                  <h4 className="font-semibold">
                    {syncStatus.source === 'supabase' ? 'متصل بقاعدة البيانات' : 'وضع محلي'}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {syncStatus.totalServices} خدمة • 
                    {syncStatus.pendingChanges > 0 ? 
                      ` ${syncStatus.pendingChanges} تغييرات معلقة` : 
                      ' جميع البيانات محدثة'
                    }
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {syncStatus.isOnline ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-red-500" />
                )}
                {syncStatus.pendingChanges > 0 && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={async () => {
                      await hybridServicesAPI.forceSync();
                      updateSyncStatus();
                      loadServices();
                    }}
                  >
                    مزامنة
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {services.length === 0 ? (
        <Card className="gradient-card border-border/50">
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <Code className="h-12 w-12 mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Services Found</h3>
              <p className="text-sm mb-4">
                Get started by adding your first service offering.
              </p>
              <Button variant="hero" onClick={handleAddService}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Service
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => {
            const IconComponent = getIcon(service.icon);
            return (
              <Card key={service.id} className="gradient-card border-border/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-secondary rounded-full flex items-center justify-center">
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{service.title}</CardTitle>
                        <Badge variant={service.active ? "default" : "secondary"}>
                          {service.active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditService(service)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteService(service.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                  <p className="text-lg font-bold text-gradient-primary mb-3">{service.price}</p>
                  <div className="space-y-1">
                    {service.features.map((feature, index) => (
                      <div key={index} className="flex items-center text-xs">
                        <div className="w-1.5 h-1.5 bg-secondary rounded-full mr-2" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleServiceStatus(service.id)}
                    >
                      {service.active ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant={service.highlighted ? "default" : "secondary"}
                      size="sm"
                      onClick={() => toggleHighlight(service.id)}
                    >
                      {service.highlighted ? "Unhighlight" : "Highlight"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Edit/Add Service Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingService?.id ? "Edit Service" : "Add New Service"}
            </DialogTitle>
          </DialogHeader>
          {editingService && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Service Title</Label>
                <Input
                  id="title"
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  placeholder="e.g., Website Development"
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={editingService.description}
                  onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  placeholder="Brief description of the service"
                />
              </div>
              
              <div>
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  value={editingService.price}
                  onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                  placeholder="e.g., 2500"
                />
              </div>
              
              <div>
                <Label htmlFor="features">Features (comma-separated)</Label>
                <Textarea
                  id="features"
                  value={editingService.features.join(", ")}
                  onChange={(e) => setEditingService({ 
                    ...editingService, 
                    features: e.target.value.split(",").map(f => f.trim()) 
                  })}
                  placeholder="Responsive Design, SEO Optimized, Fast Performance"
                />
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={editingService.category} 
                  onValueChange={(value) => setEditingService({ ...editingService, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Mobile">Mobile</SelectItem>
                    <SelectItem value="Support">Support</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  value={editingService.duration}
                  onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                  placeholder="e.g., 1-2 weeks"
                />
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="hero" onClick={handleSaveService}>
                  Save Service
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminServices;