import React from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useCashierAuth } from "@/hooks/useAdminAuth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  LogOut,
  CreditCard,
  Search,
} from "lucide-react";

const CashierLayout = () => {
  const { isLoading, isCashier } = useCashierAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

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

  if (!isCashier) {
    return null; // The hook will redirect if not cashier
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-md">
        <div className="p-4">
          <h1 className="text-xl font-bold text-primary">Cashier Interface</h1>
        </div>
        <Separator />
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="p-4 space-y-2">
            <NavLink
              to="/cashier"
              end
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-md ${isActive ? "bg-primary/10 text-primary" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`
              }
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
            <NavLink
              to="/cashier/checkout"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-md ${isActive ? "bg-primary/10 text-primary" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`
              }
            >
              <CreditCard size={18} />
              <span>Checkout</span>
            </NavLink>
            <NavLink
              to="/cashier/orders"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-md ${isActive ? "bg-primary/10 text-primary" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`
              }
            >
              <ShoppingCart size={18} />
              <span>Orders</span>
            </NavLink>
            <NavLink
              to="/cashier/customers"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-md ${isActive ? "bg-primary/10 text-primary" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`
              }
            >
              <Users size={18} />
              <span>Customers</span>
            </NavLink>
            <NavLink
              to="/cashier/search"
              className={({ isActive }) =>
                `flex items-center gap-2 p-2 rounded-md ${isActive ? "bg-primary/10 text-primary" : "hover:bg-gray-100 dark:hover:bg-gray-700"}`
              }
            >
              <Search size={18} />
              <span>Search</span>
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

export default CashierLayout;
