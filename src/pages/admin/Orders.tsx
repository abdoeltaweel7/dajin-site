import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Eye, Edit, Download, FileText, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
// حذف استخدام dataManager
import { ordersAPI, servicesAPI } from "@/lib/supabaseClient";

const AdminOrders = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editOrder, setEditOrder] = useState<any>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);

  // Form state for new order
  const [newOrder, setNewOrder] = useState({
    client: "",
    email: "",
    service: "",
    amount: "",
    deadline: "",
    description: ""
  });

  // Export orders as CSV
  const handleExportOrders = () => {
    if (!orders.length) return;
    const replacer = (key: string, value: any) => value === null ? '' : value;
    const header = Object.keys(orders[0]);
    const csv = [
      header.join(','),
      ...orders.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
    ].join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'orders-history.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  const reloadOrders = async () => {
    try {
      const ordersRes = await ordersAPI.getAll();
      setOrders(ordersRes);
      const servicesRes = await servicesAPI.getAll();
      setServices(servicesRes);
    } catch {
      setOrders([]);
      setServices([]);
    }
  };
  useEffect(() => {
    reloadOrders();
  }, []);

  const handleDeleteOrder = async (orderId: string) => {
    // حذف الطلب عبر API (مثال)
    await ordersAPI.delete(orderId);
    await reloadOrders();
    toast({
      title: "Order Deleted",
      description: "Order has been removed from the system",
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase().replace(" ", "") === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  const handleEditOrder = (order: any) => {
    setEditOrder({ ...order });
    setIsEditDialogOpen(true);
  };

  const handleSaveEditOrder = async () => {
    if (!editOrder) return;
    try {
      // تحديث الطلب عبر API (مثال)
      await ordersAPI.update(editOrder.id, editOrder);
      reloadOrders();
      setIsEditDialogOpen(false);
      setEditOrder(null);
      toast({
        title: "Order Updated",
        description: `Order ${editOrder.id} has been updated.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      });
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      // تحديث حالة الطلب عبر API (مثال)
      await ordersAPI.update(orderId, { status: newStatus });
      reloadOrders();
      toast({
        title: "Order Updated",
        description: `Order ${orderId} status changed to ${newStatus}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleAddOrder = async () => {
    if (!newOrder.client || !newOrder.email || !newOrder.service || !newOrder.amount || !newOrder.deadline) {
      toast({
        title: "Error",
        description: "Please fill all required fields",
        variant: "destructive"
      });
      return;
    }

    const order = {
      ...newOrder,
      status: "New" as const,
      date: new Date().toISOString().split('T')[0],
      progress: 0,
      assignedTo: "Unassigned"
    };

    try {
      // إضافة طلب جديد عبر API
      await ordersAPI.create(order);
      reloadOrders();
      setIsAddDialogOpen(false);
      setNewOrder({
        client: "",
        email: "",
        service: "",
        amount: "",
        deadline: "",
        description: ""
      });
      
      toast({
        title: "Order Created",
        description: "New order has been successfully created",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-500/20 text-blue-400";
      case "In Progress": return "bg-yellow-500/20 text-yellow-400";
      case "Completed": return "bg-green-500/20 text-green-400";
      case "Cancelled": return "bg-red-500/20 text-red-400";
      default: return "bg-gray-500/20 text-gray-400";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Debug: Show raw localStorage orders data
  let rawOrders = null;
  try {
    rawOrders = localStorage.getItem('orders');
  } catch (e) {
    rawOrders = 'Error reading localStorage';
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Orders Management</h2>
        <div className="flex space-x-2">
          <Button variant="outline" onClick={reloadOrders}>
            Reload Orders
          </Button>
          <Button variant="hero" onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Order
          </Button>
          <Button variant="outline" onClick={handleExportOrders}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="gradient-card border-border/50">
        <CardContent className="p-6">
          <div className="flex space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search orders by client, ID, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="inprogress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="gradient-card border-border/50">
        <CardHeader>
          <CardTitle>All Orders ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Order ID</th>
                  <th className="text-left py-3 px-4">Client</th>
                  <th className="text-left py-3 px-4">Service</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Progress</th>
                  <th className="text-left py-3 px-4">Amount</th>
                  <th className="text-left py-3 px-4">Deadline</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 px-4 text-center">
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <FileText className="h-12 w-12 mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
                        <p className="text-sm mb-4">
                          {searchTerm || statusFilter !== "all"
                            ? `No orders match your current filters`
                            : "Your orders will appear here once you start receiving them."}
                        </p>
                        {!searchTerm && statusFilter === "all" && (
                          <Button variant="hero">
                            Create First Order
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border/50">
                      <td className="py-3 px-4 font-mono text-sm">{order.id}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium">{order.client}</p>
                          <p className="text-sm text-muted-foreground">{order.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">{order.service}</td>
                      <td className="py-3 px-4">
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-muted rounded-full">
                            <div 
                              className={`h-2 rounded-full ${getProgressColor(order.progress)}`}
                              style={{ width: `${order.progress}%` }}
                            />
                          </div>
                          <span className="text-sm">{order.progress}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-semibold">{order.amount}</td>
                      <td className="py-3 px-4 text-sm">{order.deadline}</td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditOrder(order)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
      {/* Edit Order Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Order - {editOrder?.id}</DialogTitle>
          </DialogHeader>
          {editOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="edit-client">Client</Label>
                  <Input
                    id="edit-client"
                    value={editOrder.client}
                    onChange={e => setEditOrder({ ...editOrder, client: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-email">Email</Label>
                  <Input
                    id="edit-email"
                    value={editOrder.email}
                    onChange={e => setEditOrder({ ...editOrder, email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-service">Service</Label>
                <Input
                  id="edit-service"
                  value={editOrder.service}
                  onChange={e => setEditOrder({ ...editOrder, service: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="edit-amount">Amount</Label>
                  <Input
                    id="edit-amount"
                    value={editOrder.amount}
                    onChange={e => setEditOrder({ ...editOrder, amount: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="edit-deadline">Deadline</Label>
                  <Input
                    id="edit-deadline"
                    type="date"
                    value={editOrder.deadline}
                    onChange={e => setEditOrder({ ...editOrder, deadline: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  value={editOrder.description}
                  onChange={e => setEditOrder({ ...editOrder, description: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="edit-status">Status</Label>
                  <Select value={editOrder.status} onValueChange={value => setEditOrder({ ...editOrder, status: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="edit-progress">Progress (%)</Label>
                  <Input
                    id="edit-progress"
                    type="number"
                    min={0}
                    max={100}
                    value={editOrder.progress}
                    onChange={e => setEditOrder({ ...editOrder, progress: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="edit-assigned">Assigned To</Label>
                <Input
                  id="edit-assigned"
                  value={editOrder.assignedTo || ''}
                  onChange={e => setEditOrder({ ...editOrder, assignedTo: e.target.value })}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="hero" onClick={handleSaveEditOrder}>
                  Save Changes
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add Order Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Order</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="client">Client Name</Label>
              <Input
                id="client"
                value={newOrder.client}
                onChange={(e) => setNewOrder({ ...newOrder, client: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <Label htmlFor="email">Client Email</Label>
              <Input
                id="email"
                type="email"
                value={newOrder.email}
                onChange={(e) => setNewOrder({ ...newOrder, email: e.target.value })}
                placeholder="john@example.com"
              />
            </div>
            
            <div>
              <Label htmlFor="service">Service</Label>
              <Select 
                value={newOrder.service} 
                onValueChange={(value) => setNewOrder({ ...newOrder, service: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {services.length > 0 ? (
                    services.map((service) => (
                      <SelectItem key={service.id} value={service.title}>
                        {service.title} - {service.price}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="Custom Service">Custom Service</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                value={newOrder.amount}
                onChange={(e) => setNewOrder({ ...newOrder, amount: e.target.value })}
                placeholder="$2,500"
              />
            </div>
            
            <div>
              <Label htmlFor="deadline">Deadline</Label>
              <Input
                id="deadline"
                type="date"
                value={newOrder.deadline}
                onChange={(e) => setNewOrder({ ...newOrder, deadline: e.target.value })}
              />
            </div>
            
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={newOrder.description}
                onChange={(e) => setNewOrder({ ...newOrder, description: e.target.value })}
                placeholder="Project requirements and details"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="hero" onClick={handleAddOrder}>
                Create Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.id}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Client Information</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Name:</span> {selectedOrder.client}</p>
                    <p><span className="font-medium">Email:</span> {selectedOrder.email}</p>
                    <p><span className="font-medium">Service:</span> {selectedOrder.service}</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-3">Order Details</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Amount:</span> {selectedOrder.amount}</p>
                    <p><span className="font-medium">Date:</span> {selectedOrder.date}</p>
                    <p><span className="font-medium">Deadline:</span> {selectedOrder.deadline}</p>
                    <p><span className="font-medium">Assigned To:</span> {selectedOrder.assignedTo || 'Unassigned'}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Project Description</h3>
                <p className="text-muted-foreground">{selectedOrder.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Status & Progress</h3>
                <div className="flex items-center space-x-4">
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 h-2 bg-muted rounded-full">
                      <div 
                        className={`h-2 rounded-full ${getProgressColor(selectedOrder.progress)}`}
                        style={{ width: `${selectedOrder.progress}%` }}
                      />
                    </div>
                    <span className="text-sm">{selectedOrder.progress}%</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between">
                <div className="flex space-x-2">
                  <Select onValueChange={(value) => handleStatusChange(selectedOrder.id, value)}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Change Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="New">New</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex space-x-2">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Close
                  </Button>
                  <Button variant="hero" onClick={() => handleDeleteOrder(selectedOrder.id)}>
                    Delete Order
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;