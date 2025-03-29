
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, MessageSquare, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";

type DashboardStatsProps = {
  stats: {
    openChats: number;
    assignedChats: number;
    pendingOrders: number;
    processingOrders: number;
  };
};

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
  return (
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
  );
};
