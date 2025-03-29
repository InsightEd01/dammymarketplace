
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Eye } from "lucide-react";
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

type OrdersTableProps = {
  orders: Order[];
  sortField: string;
  sortOrder: "asc" | "desc";
  handleSort: (field: string) => void;
};

export const OrdersTable = ({
  orders,
  sortField,
  sortOrder,
  handleSort
}: OrdersTableProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("id")}
            >
              <div className="flex items-center space-x-1">
                <span>Order ID</span>
                {sortField === "id" && (
                  <ArrowUpDown
                    className={`h-4 w-4 ${sortOrder === "asc" ? "rotate-180" : ""}`}
                  />
                )}
              </div>
            </TableHead>
            <TableHead>Customer</TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("created_at")}
            >
              <div className="flex items-center space-x-1">
                <span>Date</span>
                {sortField === "created_at" && (
                  <ArrowUpDown
                    className={`h-4 w-4 ${sortOrder === "asc" ? "rotate-180" : ""}`}
                  />
                )}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("total_amount")}
            >
              <div className="flex items-center space-x-1">
                <span>Amount</span>
                {sortField === "total_amount" && (
                  <ArrowUpDown
                    className={`h-4 w-4 ${sortOrder === "asc" ? "rotate-180" : ""}`}
                  />
                )}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer"
              onClick={() => handleSort("status")}
            >
              <div className="flex items-center space-x-1">
                <span>Status</span>
                {sortField === "status" && (
                  <ArrowUpDown
                    className={`h-4 w-4 ${sortOrder === "asc" ? "rotate-180" : ""}`}
                  />
                )}
              </div>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-medium">
                #{order.id.substring(0, 8)}
              </TableCell>
              <TableCell>
                <div>
                  <p>{order.customer?.full_name || "Unknown"}</p>
                  <p className="text-xs text-muted-foreground">
                    {order.customer?.email}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                {new Date(order.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                ${order.total_amount.toFixed(2)}
              </TableCell>
              <TableCell>
                <StatusBadge status={order.status} />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Link to={`/customer-service/orders/${order.id}`}>
                    <Eye className="h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
