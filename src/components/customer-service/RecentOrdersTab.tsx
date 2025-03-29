
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

type Order = {
  id: string;
  customer?: {
    full_name?: string;
    email?: string;
  };
  created_at: string;
  total_amount: number;
  status: string;
};

type RecentOrdersTabProps = {
  recentOrders: Order[];
};

export const RecentOrdersTab = ({ recentOrders }: RecentOrdersTabProps) => {
  return (
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
                    <StatusBadge status={order.status} />
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
  );
};
