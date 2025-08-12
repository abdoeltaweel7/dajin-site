import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Code, FileText, DollarSign, TrendingUp, Clock } from "lucide-react";
import axios from "axios";

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    completedOrders: 0
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const ordersResponse = await axios.get('/api/orders');
        const orders = ordersResponse.data;
        
        // Calculate analytics from orders data
        const totalOrders = orders.length;
        const completedOrders = orders.filter((order: any) => order.status === 'Completed').length;
        const totalRevenue = orders.reduce((sum: number, order: any) => sum + parseFloat(order.amount || 0), 0);
        
        setAnalytics({
          totalOrders,
          totalUsers: 0, // This would come from a users API
          totalRevenue,
          completedOrders
        });
        
        setRecentOrders(orders.slice(0, 5));
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      }
    };
    
    loadData();
  }, []);

  const stats = [
    {
      title: "Total Orders",
      value: String(analytics.totalOrders),
      change: "+12%",
      icon: FileText,
      trend: "up"
    },
    {
      title: "Active Users",
      value: String(analytics.totalUsers),
      change: "+8%",
      icon: Users,
      trend: "up"
    },
    {
      title: "Revenue",
      value: `$${analytics.totalRevenue.toLocaleString()}`,
      change: "+15%",
      icon: DollarSign,
      trend: "up"
    },
    {
      title: "Completed Projects",
      value: String(analytics.completedOrders),
      change: "+20%",
      icon: Code,
      trend: "up"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-500/20 text-blue-400";
      case "In Progress": return "bg-yellow-500/20 text-yellow-400";
      case "Completed": return "bg-green-500/20 text-green-400";
      case "Active": return "bg-purple-500/20 text-purple-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="gradient-card border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
              <p className={`text-xs flex items-center mt-1 ${
                stat.trend === 'up' ? 'text-green-400' : 
                stat.trend === 'down' ? 'text-red-400' : 
                'text-muted-foreground'
              }`}>
                {stat.trend === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                {stat.trend === 'down' && <TrendingUp className="h-3 w-3 mr-1 rotate-180" />}
                {stat.change} from last month
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

      {/* Recent Orders */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2" />
            Recent Orders
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            {recentOrders.length === 0 ? (
              <div className="py-12 px-4 text-center">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <FileText className="h-12 w-12 mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Recent Orders</h3>
                  <p className="text-sm">
                    Your recent orders will appear here once you start receiving them.
                  </p>
                </div>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4">Order ID</th>
                    <th className="text-left py-3 px-4">Client</th>
                    <th className="text-left py-3 px-4">Service</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border/50">
                      <td className="py-3 px-4 font-mono text-sm">{order.id}</td>
                      <td className="py-3 px-4">{order.client}</td>
                      <td className="py-3 px-4">{order.service}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-semibold">{order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="gradient-card border-border/50 hover-glow transition-bounce cursor-pointer">
          <CardContent className="p-6 text-center">
            <Users className="h-8 w-8 mx-auto mb-4 text-secondary" />
            <h3 className="font-semibold mb-2">Manage Users</h3>
            <p className="text-sm text-muted-foreground">Add, edit, or remove users</p>
          </CardContent>
        </Card>

        <Card className="gradient-card border-border/50 hover-glow transition-bounce cursor-pointer">
          <CardContent className="p-6 text-center">
            <Code className="h-8 w-8 mx-auto mb-4 text-secondary" />
            <h3 className="font-semibold mb-2">Update Services</h3>
            <p className="text-sm text-muted-foreground">Modify service offerings</p>
          </CardContent>
        </Card>

        <Card className="gradient-card border-border/50 hover-glow transition-bounce cursor-pointer">
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 mx-auto mb-4 text-secondary" />
            <h3 className="font-semibold mb-2">View Orders</h3>
            <p className="text-sm text-muted-foreground">Track all customer orders</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;