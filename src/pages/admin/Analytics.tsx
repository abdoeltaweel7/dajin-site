import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TrendingUp, TrendingDown, Users, DollarSign, ShoppingCart, Clock, BarChart3 } from "lucide-react";
import { useState, useEffect } from "react";

const AdminAnalytics = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  // Calculate real analytics from actual data
  const totalRevenue = orders.reduce((sum, order) => {
    const amount = parseFloat(order.amount?.replace(/[$,]/g, '') || '0');
    return order.status === 'Completed' ? sum + amount : sum;
  }, 0);

  const totalOrders = orders.length;
  const activeUsers = users.filter(user => user.status === 'active').length;
  const avgResponseTime = "N/A"; // Will be calculated when we have response time data

  const stats = [
    {
      title: "Total Revenue",
      value: totalRevenue > 0 ? `$${totalRevenue.toLocaleString()}` : "$0",
      change: "0%",
      trend: "up",
      icon: DollarSign
    },
    {
      title: "Total Orders",
      value: totalOrders.toString(),
      change: "0%",
      trend: "up",
      icon: ShoppingCart
    },
    {
      title: "Active Users",
      value: activeUsers.toString(),
      change: "0%",
      trend: "up",
      icon: Users
    },
    {
      title: "Avg. Response Time",
      value: avgResponseTime,
      change: "0%",
      trend: "up",
      icon: Clock
    }
  ];

  // Get top services by actual orders
  const topServices = services.map(service => {
    const serviceOrders = orders.filter(order => order.service === service.title).length;
    const serviceRevenue = orders
      .filter(order => order.service === service.title && order.status === 'Completed')
      .reduce((sum, order) => sum + parseFloat(order.amount?.replace(/[$,]/g, '') || '0'), 0);
    
    return {
      name: service.title,
      orders: serviceOrders,
      revenue: serviceRevenue > 0 ? `$${serviceRevenue.toLocaleString()}` : "$0"
    };
  }).filter(service => service.orders > 0);

  // Order status distribution
  const orderStatusDistribution = [
    { status: "Completed", count: orders.filter(o => o.status === "Completed").length, color: "bg-green-500" },
    { status: "In Progress", count: orders.filter(o => o.status === "In Progress").length, color: "bg-yellow-500" },
    { status: "New", count: orders.filter(o => o.status === "New").length, color: "bg-blue-500" },
    { status: "Cancelled", count: orders.filter(o => o.status === "Cancelled").length, color: "bg-red-500" }
  ];

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      const savedOrders = localStorage.getItem('orders');
      const savedServices = localStorage.getItem('services');
      const savedUsers = localStorage.getItem('users');
      
      if (savedOrders) setOrders(JSON.parse(savedOrders));
      if (savedServices) setServices(JSON.parse(savedServices));
      if (savedUsers) setUsers(JSON.parse(savedUsers));
    };

    loadData();
    
    // Listen for storage changes
    window.addEventListener('storage', loadData);
    return () => window.removeEventListener('storage', loadData);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <Select defaultValue="30days">
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7days">Last 7 days</SelectItem>
            <SelectItem value="30days">Last 30 days</SelectItem>
            <SelectItem value="90days">Last 90 days</SelectItem>
            <SelectItem value="1year">Last year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {totalOrders === 0 && totalRevenue === 0 && activeUsers === 0 ? (
        <Card className="gradient-card border-border/50">
          <CardContent className="py-12 text-center">
            <div className="flex flex-col items-center justify-center text-muted-foreground">
              <BarChart3 className="h-12 w-12 mb-4 opacity-50" />
              <h3 className="text-lg font-semibold mb-2">No Analytics Data</h3>
              <p className="text-sm mb-4">
                Analytics will appear here once you start receiving orders and users.
              </p>
              <p className="text-xs text-muted-foreground">
                Add services, receive orders, and onboard users to see real analytics.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="gradient-card border-border/50">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className={`text-xs flex items-center mt-1 text-muted-foreground`}>
                        Real-time data
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-secondary rounded-full flex items-center justify-center">
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Top Services */}
          {topServices.length > 0 && (
            <Card className="gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Top Services Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topServices.map((service, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{service.orders} orders</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{service.revenue}</p>
                        <div className="w-24 h-2 bg-muted rounded-full mt-1">
                          <div
                            className="h-2 bg-gradient-secondary rounded-full"
                            style={{ width: `${Math.max(10, Math.min(100, (service.orders / Math.max(...topServices.map(s => s.orders))) * 100))}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Status Distribution */}
          {totalOrders > 0 && (
            <Card className="gradient-card border-border/50">
              <CardHeader>
                <CardTitle>Order Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {orderStatusDistribution.filter(item => item.count > 0).map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-4 h-4 rounded-full ${item.color}`} />
                        <span>{item.status}</span>
                      </div>
                      <span className="font-semibold">{item.count}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default AdminAnalytics;
