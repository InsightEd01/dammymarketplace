import React, { useState, useEffect } from "react";
import { useCashierAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ShoppingCart,
  CreditCard,
  DollarSign,
  Package,
  Search,
  Plus,
  Minus,
  Trash2,
  Loader2,
  CheckCircle,
  ReceiptText,
} from "lucide-react";
import { Link } from "react-router-dom";

const CashierDashboard = () => {
  const { isLoading, isCashier, userId } = useCashierAuth();
  const { toast } = useToast();

  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [stats, setStats] = useState({
    todaySales: 0,
    todayOrders: 0,
    averageOrderValue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (isLoading) return;

      setDashboardLoading(true);
      try {
        // Get today's date in ISO format (YYYY-MM-DD)
        const today = new Date().toISOString().split("T")[0];

        // Fetch today's orders
        const { data: todayOrders, error: ordersError } = await supabase
          .from("orders")
          .select("*")
          .gte("created_at", `${today}T00:00:00`)
          .lte("created_at", `${today}T23:59:59`);

        if (ordersError) throw ordersError;

        // Calculate today's sales and average order value
        const totalSales =
          todayOrders?.reduce(
            (sum, order) => sum + (order.total_amount || 0),
            0,
          ) || 0;
        const avgOrderValue =
          todayOrders?.length > 0 ? totalSales / todayOrders.length : 0;

        setStats({
          todaySales: totalSales,
          todayOrders: todayOrders?.length || 0,
          averageOrderValue: avgOrderValue,
        });

        // Fetch recent orders (last 5)
        const { data: recentOrdersData, error: recentOrdersError } =
          await supabase
            .from("orders")
            .select(
              `
            id,
            created_at,
            status,
            total_amount,
            customer_id,
            customer:customer_id(full_name, email)
            `,
            )
            .order("created_at", { ascending: false })
            .limit(5);

        if (recentOrdersError) throw recentOrdersError;

        setRecentOrders(recentOrdersData || []);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive",
        });
      } finally {
        setDashboardLoading(false);
      }
    };

    fetchDashboardData();
  }, [isLoading, toast]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      // Search products by name or description
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`)
        .limit(10);

      if (error) throw error;

      setSearchResults(data || []);
    } catch (error) {
      console.error("Error searching products:", error);
      toast({
        title: "Search Error",
        description: "Failed to search products",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };

  const addToCart = (product: any) => {
    // Check if product is already in cart
    const existingItem = cart.find((item) => item.id === product.id);

    if (existingItem) {
      // Update quantity
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        ),
      );
    } else {
      // Add new item
      setCart([
        ...cart,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image_url: product.image_url,
          quantity: 1,
        },
      ]);
    }

    toast({
      title: "Added to Cart",
      description: `${product.name} added to cart`,
    });
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      // Remove item if quantity is 0 or less
      setCart(cart.filter((item) => item.id !== productId));
    } else {
      // Update quantity
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item,
        ),
      );
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId));
    toast({
      title: "Removed from Cart",
      description: "Item removed from cart",
    });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to the cart before checkout",
        variant: "destructive",
      });
      return;
    }

    if (!customerInfo.name || !customerInfo.email) {
      toast({
        title: "Missing Information",
        description: "Please enter customer name and email",
        variant: "destructive",
      });
      return;
    }

    setDashboardLoading(true);
    try {
      // First, check if customer exists or create a new one
      let customerId;
      const { data: existingCustomer, error: customerError } = await supabase
        .from("customer_profiles")
        .select("id")
        .eq("email", customerInfo.email)
        .single();

      if (customerError && customerError.code !== "PGRST116") {
        // PGRST116 is the error code for "no rows returned"
        throw customerError;
      }

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        // Create new customer
        const { data: newCustomer, error: createError } = await supabase
          .from("customer_profiles")
          .insert({
            full_name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone || null,
          })
          .select()
          .single();

        if (createError) throw createError;
        customerId = newCustomer.id;
      }

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_id: customerId,
          status: "completed", // For in-store purchases, mark as completed
          total_amount: calculateTotal(),
          payment_method: "in-store",
          shipping_address: "In-store purchase",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cart.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        product_name: item.name,
        product_image: item.image_url,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update product stock quantities
      for (const item of cart) {
        const { error: updateError } = await supabase
          .from("products")
          .update({
            stock_quantity: supabase.rpc("decrement_stock", {
              p_id: item.id,
              amount: item.quantity,
            }),
          })
          .eq("id", item.id);

        if (updateError) {
          console.error(
            `Error updating stock for product ${item.id}:`,
            updateError,
          );
          // Continue with other products even if one fails
        }
      }

      // Success! Clear cart and customer info
      toast({
        title: "Order Completed",
        description: `Order #${order.id.substring(0, 8)} has been processed successfully`,
        variant: "default",
      });

      setCart([]);
      setCustomerInfo({
        name: "",
        email: "",
        phone: "",
      });

      // Refresh dashboard data
      const today = new Date().toISOString().split("T")[0];
      const { data: todayOrders } = await supabase
        .from("orders")
        .select("*")
        .gte("created_at", `${today}T00:00:00`)
        .lte("created_at", `${today}T23:59:59`);

      const totalSales =
        todayOrders?.reduce(
          (sum, order) => sum + (order.total_amount || 0),
          0,
        ) || 0;
      const avgOrderValue =
        todayOrders?.length > 0 ? totalSales / todayOrders.length : 0;

      setStats({
        todaySales: totalSales,
        todayOrders: todayOrders?.length || 0,
        averageOrderValue: avgOrderValue,
      });

      // Refresh recent orders
      const { data: recentOrdersData } = await supabase
        .from("orders")
        .select(
          `
          id,
          created_at,
          status,
          total_amount,
          customer_id,
          customer:customer_id(full_name, email)
          `,
        )
        .order("created_at", { ascending: false })
        .limit(5);

      setRecentOrders(recentOrdersData || []);
    } catch (error: any) {
      console.error("Error processing checkout:", error);
      toast({
        title: "Checkout Error",
        description: `Failed to process order: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setDashboardLoading(false);
    }
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
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cashier Dashboard</h1>
        <p className="text-muted-foreground">
          Process in-store sales and manage orders.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.todaySales.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              From {stats.todayOrders} orders today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Today's Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.todayOrders}</div>
            <p className="text-xs text-muted-foreground">
              <Link
                to="/cashier/orders"
                className="text-primary hover:underline"
              >
                View all orders
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Average Order Value
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${stats.averageOrderValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              Per transaction today
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="checkout" className="space-y-4">
        <TabsList>
          <TabsTrigger value="checkout">Checkout</TabsTrigger>
          <TabsTrigger value="search">Product Search</TabsTrigger>
          <TabsTrigger value="recent">Recent Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="checkout" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Customer Information</CardTitle>
                <CardDescription>
                  Enter customer details for the order
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-name">Customer Name</Label>
                  <Input
                    id="customer-name"
                    placeholder="Enter customer name"
                    value={customerInfo.name}
                    onChange={(e) =>
                      setCustomerInfo({ ...customerInfo, name: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Email Address</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    placeholder="Enter email address"
                    value={customerInfo.email}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        email: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customer-phone">
                    Phone Number (Optional)
                  </Label>
                  <Input
                    id="customer-phone"
                    placeholder="Enter phone number"
                    value={customerInfo.phone}
                    onChange={(e) =>
                      setCustomerInfo({
                        ...customerInfo,
                        phone: e.target.value,
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shopping Cart</CardTitle>
                <CardDescription>Items in current transaction</CardDescription>
              </CardHeader>
              <CardContent>
                {cart.length > 0 ? (
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between border-b pb-3"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-md overflow-hidden">
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    <p>Cart is empty</p>
                    <p className="text-sm mt-1">
                      Search for products to add to the cart
                    </p>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="w-full flex justify-between items-center py-2 border-t">
                  <span className="font-medium">Total:</span>
                  <span className="text-xl font-bold">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
                <Button
                  className="w-full"
                  size="lg"
                  disabled={cart.length === 0}
                  onClick={handleCheckout}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Complete Sale
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="search" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Search</CardTitle>
              <CardDescription>
                Find products to add to the cart
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Search products by name or description"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  <span className="ml-2">Search</span>
                </Button>
              </div>

              {searchResults.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {searchResults.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-md overflow-hidden">
                              {product.image_url && (
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{product.name}</p>
                              <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                {product.description}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>${product.price.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              product.stock_quantity > 10
                                ? "bg-green-100 text-green-800"
                                : product.stock_quantity > 0
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                            }
                          >
                            {product.stock_quantity > 0
                              ? product.stock_quantity
                              : "Out of stock"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            disabled={product.stock_quantity <= 0}
                            onClick={() => addToCart(product)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Add
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : searchQuery && !isSearching ? (
                <div className="text-center py-6 text-muted-foreground">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                  <p>No products found matching "{searchQuery}"</p>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest transactions processed</CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Order ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          #{order.id.substring(0, 8)}
                        </TableCell>
                        <TableCell>
                          {order.customer?.full_name || "Unknown"}
                        </TableCell>
                        <TableCell>
                          {new Date(order.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={getStatusBadgeClass(order.status)}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild variant="outline" size="sm">
                            <Link to={`/cashier/orders/${order.id}`}>
                              <ReceiptText className="h-4 w-4 mr-1" />
                              Receipt
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
                  <p>No recent orders to display</p>
                </div>
              )}

              <Separator className="my-4" />

              <div className="flex justify-end">
                <Button asChild variant="outline">
                  <Link to="/cashier/orders">View All Orders</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to get status badge class
const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800";
    case "processing":
      return "bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800";
    case "shipped":
      return "bg-purple-100 text-purple-800 hover:bg-purple-100 hover:text-purple-800";
    case "delivered":
    case "completed":
      return "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800";
  }
};

export default CashierDashboard;
