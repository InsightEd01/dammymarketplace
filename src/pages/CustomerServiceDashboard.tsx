import React, { useState, useEffect } from "react";
import { useCustomerServiceAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
  MessageSquare,
  ShoppingCart,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { getOpenChats, getRepChats } from "@/lib/services/chatService";
import { getOrdersByStatus } from "@/lib/services/orderService";
import ChatWidget from "@/components/ChatWidget";

const CustomerServiceDashboard = () => {
  const { isLoading, isCustomerService, userId } = useCustomerServiceAuth();
  const { toast } = useToast();

  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [stats, setStats] = useState({
    openChats: 0,
    assignedChats: 0,
    pendingOrders: 0,
    processingOrders: 0,
  });
  const [openChats, setOpenChats] = useState<any[]>([]);
  const [myChats, setMyChats] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [selectedChat, setSelectedChat] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (isLoading || !userId) return;

      setDashboardLoading(true);
      try {
        // Fetch open chats
        const openChatsData = await getOpenChats();
        setOpenChats(openChatsData);

        // Fetch assigned chats for this rep
        const myChatsData = await getRepChats(userId);
        setMyChats(myChatsData);

        // Fetch pending orders
        const pendingOrdersData = await getOrdersByStatus("pending");

        // Fetch processing orders
        const processingOrdersData = await getOrdersByStatus("processing");

        // Set stats
        setStats({
          openChats: openChatsData.length,
          assignedChats: myChatsData.length,
          pendingOrders: pendingOrdersData.length,
          processingOrders: processingOrdersData.length,
        });

        // Get recent orders (combine pending and processing, take most recent 5)
        const combinedOrders = [...pendingOrdersData, ...processingOrdersData]
          .sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime(),
          )
          .slice(0, 5);

        setRecentOrders(combinedOrders);
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
  }, [isLoading, userId, toast]);

  const handleAssignChat = async (chatId: string) => {
    if (!userId) return;

    try {
      const { data: chatData, error } = await supabase
        .from("chats")
        .update({ rep_id: userId, status: "assigned" })
        .eq("id", chatId)
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Chat Assigned",
        description: "You have been assigned to this chat",
      });

      // Update local state
      setOpenChats((prev) => prev.filter((chat) => chat.id !== chatId));
      setMyChats((prev) => [...prev, chatData]);
      setStats((prev) => ({
        ...prev,
        openChats: prev.openChats - 1,
        assignedChats: prev.assignedChats + 1,
      }));
    } catch (error: any) {
      console.error("Error assigning chat:", error);
      toast({
        title: "Error",
        description: `Failed to assign chat: ${error.message}`,
        variant: "destructive",
      });
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
        <h1 className="text-3xl font-bold tracking-tight">
          Customer Service Dashboard
        </h1>
        <p className="text-muted-foreground">
          Manage customer inquiries and support requests.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.openChats}</div>
            <p className="text-xs text-muted-foreground">
              <Link
                to="/customer-service/chats"
                className="text-primary hover:underline"
              >
                View open chats
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              My Assigned Chats
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assignedChats}</div>
            <p className="text-xs text-muted-foreground">
              <Link
                to="/customer-service/chats"
                className="text-primary hover:underline"
              >
                View my chats
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Orders
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">
              <Link
                to="/customer-service/orders?status=pending"
                className="text-primary hover:underline"
              >
                View pending orders
              </Link>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Processing Orders
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.processingOrders}</div>
            <p className="text-xs text-muted-foreground">
              <Link
                to="/customer-service/orders?status=processing"
                className="text-primary hover:underline"
              >
                View processing orders
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="open-chats" className="space-y-4">
        <TabsList>
          <TabsTrigger value="open-chats">Open Chats</TabsTrigger>
          <TabsTrigger value="my-chats">My Chats</TabsTrigger>
          <TabsTrigger value="recent-orders">Recent Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="open-chats" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Open Support Requests</CardTitle>
              <CardDescription>
                Unassigned customer chats that need attention
              </CardDescription>
            </CardHeader>
            <CardContent>
              {openChats.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {openChats.map((chat) => (
                      <TableRow key={chat.id}>
                        <TableCell className="font-medium">
                          {chat.customer?.full_name || "Unknown"}
                        </TableCell>
                        <TableCell>
                          {new Date(chat.created_at).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-800"
                          >
                            Waiting
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            onClick={() => handleAssignChat(chat.id)}
                          >
                            Assign to me
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-2" />
                  <p>No open chats at the moment</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-chats" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>My Assigned Chats</CardTitle>
                <CardDescription>
                  Chats you are currently handling
                </CardDescription>
              </CardHeader>
              <CardContent>
                {myChats.length > 0 ? (
                  <div className="space-y-4">
                    {myChats.map((chat) => (
                      <div
                        key={chat.id}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${selectedChat === chat.id ? "bg-primary/10 border-primary" : "hover:bg-muted"}`}
                        onClick={() => setSelectedChat(chat.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">
                              {chat.customer?.full_name || "Unknown Customer"}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {chat.customer?.email}
                            </p>
                          </div>
                          <Badge
                            variant="outline"
                            className="bg-blue-100 text-blue-800 hover:bg-blue-100 hover:text-blue-800"
                          >
                            Active
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Started {new Date(chat.created_at).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    <p>You have no assigned chats</p>
                    <p className="text-sm mt-1">
                      Assign yourself to open chats from the Open Chats tab
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="md:col-span-1">
              <CardHeader>
                <CardTitle>Chat Window</CardTitle>
                <CardDescription>Conversation with customer</CardDescription>
              </CardHeader>
              <CardContent>
                {selectedChat ? (
                  <ChatWidget
                    chatId={selectedChat}
                    userId={userId || ""}
                    userType="rep"
                    repName="Support Agent"
                  />
                ) : (
                  <div className="text-center py-6 text-muted-foreground">
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
                    <p>Select a chat to view the conversation</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="recent-orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest orders that may need attention
              </CardDescription>
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
                          {new Date(order.created_at).toLocaleDateString()}
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
                            <Link to={`/customer-service/orders/${order.id}`}>
                              View
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
                  <Link to="/customer-service/orders">View All Orders</Link>
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
      return "bg-green-100 text-green-800 hover:bg-green-100 hover:text-green-800";
    case "cancelled":
      return "bg-red-100 text-red-800 hover:bg-red-100 hover:text-red-800";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-100 hover:text-gray-800";
  }
};

export default CustomerServiceDashboard;
