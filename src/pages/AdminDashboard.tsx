
import React, { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Package,
  ShoppingCart,
  Users,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Clock,
  CreditCard,
  CheckCircle,
  Activity,
  Eye,
  ArrowUp,
  ArrowDown,
  Search,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ResponsiveContainer, AreaChart, Area, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useToast } from "@/hooks/use-toast";

// Mock data for charts
const salesData = [
  { name: 'Jan', sales: 4000 },
  { name: 'Feb', sales: 3000 },
  { name: 'Mar', sales: 5000 },
  { name: 'Apr', sales: 2780 },
  { name: 'May', sales: 1890 },
  { name: 'Jun', sales: 2390 },
  { name: 'Jul', sales: 3490 },
];

const visitsData = [
  { name: 'Week 1', visitors: 1200 },
  { name: 'Week 2', visitors: 1500 },
  { name: 'Week 3', visitors: 1000 },
  { name: 'Week 4', visitors: 1800 },
];

const AdminDashboard = () => {
  const { isLoading } = useAdminAuth();
  const { toast } = useToast();
  
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalCustomers: 0,
    lowStockProducts: 0,
    revenue: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [activePromos, setActivePromos] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (isLoading) return;

      setDashboardLoading(true);
      try {
        // Fetch product count
        const { count: productsCount } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true });

        // Fetch low stock products count
        const { count: lowStockCount } = await supabase
          .from("products")
          .select("*", { count: "exact", head: true })
          .lt("stock_quantity", 10);

        // Fetch order count
        const { count: ordersCount } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true });

        // Fetch pending orders count
        const { count: pendingCount } = await supabase
          .from("orders")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending");

        // Fetch customer count
        const { count: customersCount } = await supabase
          .from("customer_profiles")
          .select("*", { count: "exact", head: true });

        // Fetch total revenue
        const { data: ordersData } = await supabase
          .from("orders")
          .select("total_amount");

        const totalRevenue =
          ordersData?.reduce(
            (sum, order) => sum + (order.total_amount || 0),
            0,
          ) || 0;

        // Fetch recent orders
        const { data: recentOrdersData } = await supabase
          .from("orders")
          .select(
            `
            id,
            created_at,
            status,
            total_amount,
            customer_id
          `,
          )
          .order("created_at", { ascending: false })
          .limit(5);

        // Fetch customer names for orders
        if (recentOrdersData && recentOrdersData.length > 0) {
          const orderWithCustomers = await Promise.all(
            recentOrdersData.map(async (order) => {
              const { data: customerData } = await supabase
                .from("customer_profiles")
                .select("full_name")
                .eq("id", order.customer_id)
                .single();
              
              return {
                ...order,
                customer: customerData || { full_name: "Unknown Customer" }
              };
            })
          );
          
          setRecentOrders(orderWithCustomers);
        }

        // Fetch top products
        const { data: productsData } = await supabase
          .from("products")
          .select("id, name, price, stock_quantity, image_url")
          .order("stock_quantity", { ascending: true })
          .limit(5);
          
        setTopProducts(productsData || []);

        // Fetch active promotions
        const { data: promosData } = await supabase
          .from("promotions")
          .select("*")
          .eq("is_active", true)
          .gte("end_date", new Date().toISOString())
          .order("end_date", { ascending: true });
          
        setActivePromos(promosData || []);

        setStats({
          totalProducts: productsCount || 0,
          totalOrders: ordersCount || 0,
          totalCustomers: customersCount || 0,
          lowStockProducts: lowStockCount || 0,
          revenue: totalRevenue,
          pendingOrders: pendingCount || 0,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error fetching data",
          description: "There was a problem loading the dashboard data.",
          variant: "destructive",
        });
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboardData();

    // Set up real-time subscription for new orders
    const channel = supabase
      .channel('admin-dashboard-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          toast({
            title: "New Order",
            description: `Order #${payload.new.id.substring(0, 8)} has been placed!`,
          });
          // Refresh dashboard data
          fetchDashboardData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isLoading, toast]);

  const handleCreatePromotion = async () => {
    toast({
      title: "Promotion Created",
      description: "New promotion has been created and is now active.",
    });
  };

  if (isLoading || dashboardLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back to Dammy Collectibles Admin Panel
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Clock className="mr-2 h-4 w-4" />
            Today
          </Button>
          <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
            <Activity className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Stats Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Products
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProducts}</div>
                <div className="flex items-center pt-1 text-xs text-green-500">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span>12% from last month</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <Link
                    to="/admin/products"
                    className="text-red-600 hover:underline"
                  >
                    Manage products
                  </Link>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Orders
                </CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalOrders}</div>
                <div className="flex items-center pt-1 text-xs text-green-500">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span>8% from last week</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <Link
                    to="/admin/orders"
                    className="text-red-600 hover:underline"
                  >
                    View all orders
                  </Link>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Customers
                </CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalCustomers}</div>
                <div className="flex items-center pt-1 text-xs text-green-500">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span>5% from last month</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <Link
                    to="/admin/customers"
                    className="text-red-600 hover:underline"
                  >
                    View customers
                  </Link>
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${stats.revenue.toFixed(2)}
                </div>
                <div className="flex items-center pt-1 text-xs text-red-500">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  <span>3% from last month</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  <Link
                    to="/admin/analytics"
                    className="text-red-600 hover:underline"
                  >
                    View analytics
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Sales Overview</CardTitle>
                <CardDescription>Monthly sales performance</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={salesData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#fff", 
                        border: "1px solid #ddd",
                        borderRadius: "8px" 
                      }} 
                    />
                    <Area
                      type="monotone"
                      dataKey="sales"
                      stroke="#ef4444"
                      fill="#fecaca"
                      fillOpacity={0.8}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Website Visitors</CardTitle>
                <CardDescription>Weekly visitor statistics</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={visitsData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: "#fff", 
                        border: "1px solid #ddd",
                        borderRadius: "8px" 
                      }} 
                    />
                    <Bar
                      dataKey="visitors"
                      fill="#ef4444"
                      radius={[4, 4, 0, 0]}
                    />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Action Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Low Stock Products
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {stats.lowStockProducts}
                </div>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  {stats.lowStockProducts > 0 ? (
                    <Link
                      to="/admin/products?filter=low-stock"
                      className="hover:underline"
                    >
                      Review low stock items
                    </Link>
                  ) : (
                    "All products are well-stocked"
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Pending Orders
                </CardTitle>
                <Clock className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.pendingOrders}
                </div>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {stats.pendingOrders > 0 ? (
                    <Link
                      to="/admin/orders?status=pending"
                      className="hover:underline"
                    >
                      Process pending orders
                    </Link>
                  ) : (
                    "No pending orders"
                  )}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Quick Actions
                </CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Link to="/admin/products/new">
                    <Package className="mr-2 h-4 w-4" />
                    Add New Product
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Link to="/admin/orders">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Manage Orders
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Link to="/admin/promotions/new">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Create Promotion
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle>Low Stock Products</CardTitle>
              <CardDescription>Products that need restocking soon</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                {topProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <div className="aspect-square relative">
                      <img 
                        src={product.image_url || "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?q=80&w=1170&auto=format&fit=crop"} 
                        alt={product.name}
                        className="object-cover w-full h-full" 
                      />
                      <div className="absolute top-2 right-2">
                        <Badge variant="secondary" className="bg-red-600 text-white hover:bg-red-600">
                          {product.stock_quantity} left
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">${product.price}</p>
                    </CardContent>
                    <CardFooter className="p-3 pt-0">
                      <Button asChild variant="outline" size="sm" className="w-full">
                        <Link to={`/admin/products/${product.id}`}>
                          <Eye className="mr-2 h-3 w-3" />
                          View
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest 5 orders from your store</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <p className="text-sm font-medium">
                          Order #{order.id.substring(0, 8)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(order.created_at).toLocaleDateString()} •{" "}
                          {order.customer?.full_name || "Customer"}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-sm font-medium">
                          ${order.total_amount?.toFixed(2) || "0.00"}
                        </div>
                        <div
                          className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.status)}`}
                        >
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </div>
                        <Button asChild variant="ghost" size="sm">
                          <Link to={`/admin/orders/${order.id}`}>View</Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No recent orders found
                </p>
              )}

              <Separator className="my-4" />

              <div className="flex justify-end">
                <Button asChild variant="outline">
                  <Link to="/admin/orders">View All Orders</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="flex justify-between mb-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">Sales Analytics</h2>
              <p className="text-muted-foreground">Performance metrics and trends</p>
            </div>
            <div className="flex items-center gap-2">
              <Select defaultValue="30d">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select time period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.revenue.toFixed(2)}</div>
                <div className="flex items-center pt-1 text-xs text-green-500">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span>+11.5% from last period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Average Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ${stats.totalOrders ? (stats.revenue / stats.totalOrders).toFixed(2) : "0.00"}
                </div>
                <div className="flex items-center pt-1 text-xs text-red-500">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  <span>-2.3% from last period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2%</div>
                <div className="flex items-center pt-1 text-xs text-green-500">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  <span>+0.5% from last period</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Return Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1.2%</div>
                <div className="flex items-center pt-1 text-xs text-green-500">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  <span>-0.3% from last period</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-full">
            <CardHeader>
              <CardTitle>Revenue Over Time</CardTitle>
              <CardDescription>Monthly revenue for the past year</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={[
                    { month: 'Jan', revenue: 4000 },
                    { month: 'Feb', revenue: 6000 },
                    { month: 'Mar', revenue: 5000 },
                    { month: 'Apr', revenue: 8000 },
                    { month: 'May', revenue: 12000 },
                    { month: 'Jun', revenue: 10000 },
                    { month: 'Jul', revenue: 8500 },
                    { month: 'Aug', revenue: 9000 },
                    { month: 'Sep', revenue: 11000 },
                    { month: 'Oct', revenue: 13000 },
                    { month: 'Nov', revenue: 15000 },
                    { month: 'Dec', revenue: 18000 },
                  ]}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#ef4444" 
                    fillOpacity={1} 
                    fill="url(#colorRevenue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="promotions" className="space-y-4">
          <div className="flex justify-between mb-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">Manage Promotions</h2>
              <p className="text-muted-foreground">Create and track promotional campaigns</p>
            </div>
            <Button className="bg-red-600 hover:bg-red-700">
              <TrendingUp className="mr-2 h-4 w-4" />
              New Promotion
            </Button>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Create Promotion</CardTitle>
              <CardDescription>Set up a new promotional campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Promotion Text</label>
                  <Input placeholder="e.g., 50% OFF all vintage comics this weekend!" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Promotion Type</label>
                  <Select defaultValue="discount">
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="discount">Discount</SelectItem>
                      <SelectItem value="free_shipping">Free Shipping</SelectItem>
                      <SelectItem value="bogo">Buy One Get One</SelectItem>
                      <SelectItem value="gift">Free Gift</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input type="date" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Applicable Products/Categories</label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue placeholder="Select scope" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Products</SelectItem>
                      <SelectItem value="comics">Comics</SelectItem>
                      <SelectItem value="figurines">Figurines</SelectItem>
                      <SelectItem value="vintage">Vintage Items</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button variant="outline" className="mr-2">Cancel</Button>
              <Button className="bg-red-600 hover:bg-red-700" onClick={handleCreatePromotion}>
                Create Promotion
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Promotions</CardTitle>
              <CardDescription>Currently running promotional campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activePromos.length > 0 ? (
                  activePromos.map((promo) => (
                    <div key={promo.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                      <div className="mb-2 md:mb-0">
                        <p className="font-medium">{promo.text}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(promo.start_date).toLocaleDateString()} to {new Date(promo.end_date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Active
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                          Deactivate
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <TrendingUp className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
                    <p>No active promotions found</p>
                    <p className="text-sm mt-1">Create a new promotion to attract more customers</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="text-sm text-muted-foreground">
                Showing {activePromos.length} active promotions
              </div>
              <Button variant="outline">View All Promotions</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="flex justify-between mb-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-bold">Reports</h2>
              <p className="text-muted-foreground">Generate and download business reports</p>
            </div>
            <div className="flex items-center gap-2">
              <Input 
                className="w-[250px]" 
                placeholder="Search reports" 
                startIcon={<Search className="h-4 w-4" />} 
              />
              <Button variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
  
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Sales Report</CardTitle>
                <CardDescription>Complete breakdown of sales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <ShoppingCart className="mx-auto h-10 w-10 text-red-600 mb-4" />
                  <p className="text-muted-foreground">Analyze sales trends and performance</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">Last 30 Days</Button>
                <Button variant="outline" size="sm">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Inventory Report</CardTitle>
                <CardDescription>Current stock levels and values</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Package className="mx-auto h-10 w-10 text-red-600 mb-4" />
                  <p className="text-muted-foreground">Track inventory metrics and restocking needs</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">Current</Button>
                <Button variant="outline" size="sm">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Customer Report</CardTitle>
                <CardDescription>Customer analytics and behavior</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-6">
                  <Users className="mx-auto h-10 w-10 text-red-600 mb-4" />
                  <p className="text-muted-foreground">Understand customer shopping patterns</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">Last Quarter</Button>
                <Button variant="outline" size="sm">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>Automatically generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Weekly Sales Summary</p>
                    <p className="text-sm text-muted-foreground">
                      Generated every Monday • Sent to admin@dammycollectibles.com
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Monthly Financial Report</p>
                    <p className="text-sm text-muted-foreground">
                      Generated on the 1st • Sent to finance@dammycollectibles.com
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-2 md:mt-0">
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Active
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="ml-auto bg-red-600 hover:bg-red-700">
                <TrendingUp className="mr-2 h-4 w-4" />
                Schedule New Report
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to get status color
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-500";
    case "processing":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-500";
    case "shipped":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-500";
    case "delivered":
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-500";
    case "cancelled":
      return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-500";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
  }
};

// Missing component import
const Download = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  );
};

export default AdminDashboard;
