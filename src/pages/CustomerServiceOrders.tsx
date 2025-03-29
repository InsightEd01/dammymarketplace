import React, { useState, useEffect } from "react";
import { useCustomerServiceAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  ShoppingCart,
  Search,
  Filter,
  Loader2,
  Eye,
  ArrowUpDown,
} from "lucide-react";

const CustomerServiceOrders = () => {
  const { isLoading: authLoading } = useCustomerServiceAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Pagination and filtering state
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const pageSize = 10;

  // Initialize from URL params
  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    const query = searchParams.get("query") || "";
    const status = searchParams.get("status") || "";
    const sort = searchParams.get("sort") || "created_at";
    const order = searchParams.get("order") || "desc";

    setCurrentPage(page);
    setSearchQuery(query);
    setSelectedStatus(status);
    setSortField(sort);
    setSortOrder(order as "asc" | "desc");
  }, [searchParams]);

  // Update URL when filters change
  useEffect(() => {
    const params: Record<string, string> = {};

    if (currentPage > 1) params.page = currentPage.toString();
    if (searchQuery) params.query = searchQuery;
    if (selectedStatus) params.status = selectedStatus;
    if (sortField !== "created_at") params.sort = sortField;
    if (sortOrder !== "desc") params.order = sortOrder;

    setSearchParams(params, { replace: true });
  }, [currentPage, searchQuery, selectedStatus, sortField, sortOrder, setSearchParams]);

  // Fetch orders with filters
  useEffect(() => {
    const fetchOrders = async () => {
      if (authLoading) return;

      setIsLoading(true);
      try {
        // Start building the query
        let query = supabase
          .from("orders")
          .select(
            `
            *,
            customer:customer_id(full_name, email)
          `,
            { count: "exact" }
          );

        // Apply filters
        if (searchQuery) {
          // Search by order ID or customer name/email
          query = query.or(
            `id.ilike.%${searchQuery}%,customer_id.eq.(${supabase
              .from("customer_profiles")
              .select("id")
              .or(`full_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
              .limit(100)})`
          );
        }

        if (selectedStatus) {
          query = query.eq("status", selectedStatus);
        }

        // Apply sorting
        query = query.order(sortField, { ascending: sortOrder === "asc" });

        // Apply pagination
        const from = (currentPage - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

        // Execute query
        const { data, error, count } = await query;

        if (error) throw error;

        setOrders(data || []);
        setTotalCount(count || 0);
      } catch (error: any) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: `Failed to load orders: ${error.message}`,
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [
    authLoading,
    currentPage,
    searchQuery,
    selectedStatus,
    sortField,
    sortOrder,
    toast,
  ]);

  const handleSort = (field: string) => {
    if (field === sortField) {
      // Toggle sort order if clicking the same field
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // Set new sort field and default to descending
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page on new search
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1); // Reset to first page on status change
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (authLoading) {
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
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground">
            View and manage customer orders
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders</CardTitle>
          <CardDescription>Manage and track customer orders</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="flex w-full md:w-1/2 space-x-2"
            >
              <Input
                placeholder="Search by order ID or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" size="icon">
                <Search className="h-4 w-4" />
              </Button>
            </form>

            {/* Status Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select
                value={selectedStatus}
                onValueChange={handleStatusChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="mx-auto h-12 w-12 mb-4 text-muted-foreground" />
              <p>No orders found</p>
              {(searchQuery || selectedStatus) && (
                <p className="mt-2">
                  Try adjusting your search or filter criteria
                </p>
              )}
            </div>
          ) : (
            <>
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
                          <Badge
                            variant="outline"
                            className={getStatusBadgeClass(order.status)}
                          >
                            {order.status.charAt(0).toUpperCase() +
                              order.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Link to={`/customer-service/orders/${order.