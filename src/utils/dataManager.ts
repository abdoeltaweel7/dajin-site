// Unified data management system for admin and client
export interface Order {
  id: string;
  client: string;
  email: string;
  service: string;
  status: 'New' | 'In Progress' | 'Completed' | 'Cancelled';
  amount: string;
  date: string;
  deadline: string;
  assignedTo?: string;
  description: string;
  progress: number;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  price: string;
  features: string[];
  icon: string;
  active: boolean;
  highlighted?: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: 'client' | 'admin';
  status: 'active' | 'inactive';
  joinDate: string;
  totalOrders: number;
  totalSpent: string;
}

class DataManager {
  private static instance: DataManager;
  
  static getInstance(): DataManager {
    if (!DataManager.instance) {
      DataManager.instance = new DataManager();
    }
    return DataManager.instance;
  }

  // Orders
  getOrders(): Order[] {
    const data = localStorage.getItem('orders');
    return data ? JSON.parse(data) : [];
  }

  setOrders(orders: Order[]): void {
    localStorage.setItem('orders', JSON.stringify(orders));
    window.dispatchEvent(new Event('storage'));
  }

  addOrder(order: Omit<Order, 'id'>): Order {
    const orders = this.getOrders();
    // Use timestamp and random string for unique ID
    const uniqueId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const newOrder: Order = {
      ...order,
      id: uniqueId
    };
    orders.push(newOrder);
    this.setOrders(orders);
    return newOrder;
  }

  updateOrder(id: string, updates: Partial<Order>): void {
    const orders = this.getOrders();
    const index = orders.findIndex(order => order.id === id);
    if (index !== -1) {
      orders[index] = { ...orders[index], ...updates };
      this.setOrders(orders);
    }
  }

  deleteOrder(id: string): void {
    const orders = this.getOrders();
    const filteredOrders = orders.filter(order => order.id !== id);
    this.setOrders(filteredOrders);
  }

  // Services
  getServices(): Service[] {
    const data = localStorage.getItem('services');
    return data ? JSON.parse(data) : [];
  }

  setServices(services: Service[]): void {
    localStorage.setItem('services', JSON.stringify(services));
    window.dispatchEvent(new Event('storage'));
  }

  addService(service: Omit<Service, 'id'>): Service {
    const services = this.getServices();
    const newService: Service = {
      ...service,
      id: services.length > 0 ? Math.max(...services.map(s => s.id)) + 1 : 1,
      highlighted: service.highlighted ?? false
    };
    services.push(newService);
    this.setServices(services);
    return newService;
  }

  updateService(id: number, updates: Partial<Service>): void {
    const services = this.getServices();
    const index = services.findIndex(service => service.id === id);
    if (index !== -1) {
      services[index] = { ...services[index], ...updates };
      // Ensure highlighted is always boolean
      if (typeof services[index].highlighted !== 'boolean') {
        services[index].highlighted = false;
      }
      this.setServices(services);
    }
  }

  deleteService(id: number): void {
    const services = this.getServices();
    const filteredServices = services.filter(service => service.id !== id);
    this.setServices(filteredServices);
  }

  // Users
  getUsers(): User[] {
    const data = localStorage.getItem('users');
    return data ? JSON.parse(data) : [];
  }

  setUsers(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
    window.dispatchEvent(new Event('storage'));
  }

  addUser(user: Omit<User, 'id'>): User {
    const users = this.getUsers();
    const newUser: User = {
      ...user,
      id: users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1
    };
    users.push(newUser);
    this.setUsers(users);
    return newUser;
  }

  updateUser(id: number, updates: Partial<User>): void {
    const users = this.getUsers();
    const index = users.findIndex(user => user.id === id);
    if (index !== -1) {
      users[index] = { ...users[index], ...updates };
      this.setUsers(users);
    }
  }

  deleteUser(id: number): void {
    const users = this.getUsers();
    const filteredUsers = users.filter(user => user.id !== id);
    this.setUsers(filteredUsers);
  }

  // Analytics
  getAnalytics() {
    const orders = this.getOrders();
    const services = this.getServices();
    const users = this.getUsers();

    const totalRevenue = orders.reduce((sum, order) => {
      const amount = parseFloat(order.amount?.replace(/[$,]/g, '') || '0');
      return order.status === 'Completed' ? sum + amount : sum;
    }, 0);

    return {
      totalRevenue,
      totalOrders: orders.length,
      totalUsers: users.length,
      activeUsers: users.filter(user => user.status === 'active').length,
      completedOrders: orders.filter(order => order.status === 'Completed').length,
      pendingOrders: orders.filter(order => order.status === 'New' || order.status === 'In Progress').length,
      topServices: services.map(service => ({
        ...service,
        orderCount: orders.filter(order => order.service === service.title).length,
        revenue: orders
          .filter(order => order.service === service.title && order.status === 'Completed')
          .reduce((sum, order) => sum + parseFloat(order.amount?.replace(/[$,]/g, '') || '0'), 0)
      })).filter(service => service.orderCount > 0)
    };
  }

  // Reset all data
  resetAllData(): void {
    localStorage.removeItem('orders');
    localStorage.removeItem('services');
    localStorage.removeItem('users');
    window.dispatchEvent(new Event('storage'));
  }

  // Initialize with sample data if empty
  initializeSampleData(): void {
    if (this.getServices().length === 0) {
      const sampleServices = [
        {
          id: 1,
          title: "Website Development",
          description: "Custom responsive websites built with modern technologies",
          price: "$2,500",
          features: ["Responsive Design", "SEO Optimized", "Fast Performance", "CMS Integration"],
          icon: "Code",
          active: true,
          highlighted: true
        },
        {
          id: 2,
          title: "Mobile App Development",
          description: "Native and cross-platform mobile applications",
          price: "$5,000",
          features: ["iOS & Android", "User-Friendly UI", "Push Notifications", "App Store Ready"],
          icon: "Smartphone",
          active: true,
          highlighted: true
        },
        {
          id: 3,
          title: "UI/UX Design",
          description: "Beautiful and intuitive user interface design",
          price: "$1,500",
          features: ["User Research", "Wireframing", "Prototyping", "Design System"],
          icon: "Palette",
          active: true,
          highlighted: false
        }
      ];
      this.setServices(sampleServices);
    }

    if (this.getUsers().length === 0) {
      const sampleUsers = [
        {
          id: 1,
          name: "John Doe",
          email: "john@example.com",
          phone: "+1 (555) 123-4567",
          role: "client" as const,
          status: "active" as const,
          joinDate: "2024-01-15",
          totalOrders: 3,
          totalSpent: "$7,500"
        },
        {
          id: 2,
          name: "Jane Smith",
          email: "jane@example.com",
          phone: "+1 (555) 987-6543",
          role: "client" as const,
          status: "active" as const,
          joinDate: "2024-02-20",
          totalOrders: 1,
          totalSpent: "$2,500"
        }
      ];
      this.setUsers(sampleUsers);
    }

    if (this.getOrders().length === 0) {
      const sampleOrders = [
        {
          id: "ORD-001",
          client: "John Doe",
          email: "john@example.com",
          service: "Website Development",
          status: "Completed" as const,
          amount: "$2,500",
          date: "2024-03-01",
          deadline: "2024-03-15",
          assignedTo: "Admin",
          description: "Complete website redesign with modern UI/UX",
          progress: 100
        },
        {
          id: "ORD-002",
          client: "Jane Smith",
          email: "jane@example.com",
          service: "Mobile App Development",
          status: "In Progress" as const,
          amount: "$5,000",
          date: "2024-03-10",
          deadline: "2024-04-10",
          assignedTo: "Development Team",
          description: "Cross-platform mobile application for iOS and Android",
          progress: 65
        }
      ];
      this.setOrders(sampleOrders);
    }
  }
}

export const dataManager = DataManager.getInstance();
export default dataManager;
