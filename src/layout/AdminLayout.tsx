
import React, { useState } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  MessageSquare,
  Settings,
  LogOut,
  BarChart3,
  Bell,
} from "lucide-react";

const AdminLayout = () => {
  const { isLoading, isAdmin } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<number>(5); // Mock notification count

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
    navigate("/login");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // The hook will redirect if not admin
  }

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4">
          <h1 className="text-xl font-bold text-red-600 dark:text-red-400">Dammy Admin</h1>
          <p className="text-xs text-muted-foreground">Collectibles Management</p>
        </div>
        <Separator />
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="p-4 space-y-2">
            <NavLink
              to="/admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-md ${isActive ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`
              }
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
            
            <NavLink
              to="/admin/products"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-md ${isActive ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`
              }
            >
              <Package size={18} />
              <span>Products</span>
            </NavLink>
            
            <NavLink
              to="/admin/orders"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-md ${isActive ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`
              }
            >
              <ShoppingCart size={18} />
              <span>Orders</span>
              <Badge 
                variant="outline" 
                className="ml-auto bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              >
                12
              </Badge>
            </NavLink>
            
            <NavLink
              to="/admin/customers"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-md ${isActive ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`
              }
            >
              <Users size={18} />
              <span>Customers</span>
            </NavLink>
            
            <NavLink
              to="/admin/chats"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-md ${isActive ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`
              }
            >
              <MessageSquare size={18} />
              <span>Chats</span>
              <Badge 
                variant="outline" 
                className="ml-auto bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
              >
                3
              </Badge>
            </NavLink>
            
            <NavLink
              to="/admin/analytics"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-md ${isActive ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`
              }
            >
              <BarChart3 size={18} />
              <span>Analytics</span>
            </NavLink>
            
            <NavLink
              to="/admin/notifications"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-md ${isActive ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`
              }
            >
              <Bell size={18} />
              <span>Notifications</span>
              {notifications > 0 && (
                <Badge 
                  variant="outline" 
                  className="ml-auto bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                >
                  {notifications}
                </Badge>
              )}
            </NavLink>
            
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-md ${isActive ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`
              }
            >
              <Settings size={18} />
              <span>Settings</span>
            </NavLink>

            <Separator className="my-4" />

            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-2" />
              <span>Logout</span>
            </Button>
          </div>
        </ScrollArea>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
