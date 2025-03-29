
import React, { useState, useEffect } from "react";
import { useCustomerServiceAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { getOpenChats, getRepChats } from "@/lib/services/chatService";
import { getOrdersByStatus } from "@/lib/services/orderService";

// Import our new components
import { DashboardStats } from "@/components/customer-service/DashboardStats";
import { OpenChatsTab } from "@/components/customer-service/OpenChatsTab";
import { MyChatsTab } from "@/components/customer-service/MyChatsTab";
import { RecentOrdersTab } from "@/components/customer-service/RecentOrdersTab";

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

      {/* Dashboard Stats */}
      <DashboardStats stats={stats} />

      {/* Tabs */}
      <Tabs defaultValue="open-chats" className="space-y-4">
        <TabsList>
          <TabsTrigger value="open-chats">Open Chats</TabsTrigger>
          <TabsTrigger value="my-chats">My Chats</TabsTrigger>
          <TabsTrigger value="recent-orders">Recent Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="open-chats" className="space-y-4">
          <OpenChatsTab 
            openChats={openChats} 
            handleAssignChat={handleAssignChat} 
          />
        </TabsContent>

        <TabsContent value="my-chats" className="space-y-4">
          <MyChatsTab 
            myChats={myChats} 
            selectedChat={selectedChat} 
            setSelectedChat={setSelectedChat} 
            userId={userId || ""}
          />
        </TabsContent>

        <TabsContent value="recent-orders" className="space-y-4">
          <RecentOrdersTab recentOrders={recentOrders} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CustomerServiceDashboard;
