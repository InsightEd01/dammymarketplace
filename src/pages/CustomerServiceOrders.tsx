
import React, { useState, useEffect } from "react";
import { useCustomerServiceAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSearchParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2 } from "lucide-react";

// Import our refactored components
import { OrderFilters } from "@/components/customer-service/OrderFilters";
import { OrdersTable } from "@/components/customer-service/OrdersTable";
import { OrderPagination } from "@/components/customer-service/OrderPagination";
import { EmptyOrdersState } from "@/components/customer-service/EmptyOrdersState";

const CustomerServiceOrders = () => {
  const { isLoading: authLoading } = useCustomerServiceAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const { toast } = useToast();

  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [sortField, setSortField] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const pageSize = 10;

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

  useEffect(() => {
    const params: Record<string, string> = {};

    if (currentPage > 1) params.page = currentPage.toString();
    if (searchQuery) params.query = searchQuery;
    if (selectedStatus) params.status = selectedStatus;
    if (sortField !== "created_at") params.sort = sortField;
    if (sortOrder !== "desc") params.order = sortOrder;

    setSearchParams(params, { replace: true });
  }, [currentPage, searchQuery, selectedStatus, sortField, sortOrder, setSearchParams]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (authLoading) return;

      setIsLoading(true);
      try {
        let query = supabase
          .from("orders")
          .select(
            `
            *,
            customer:customer_id(full_name, email)
          `,
            { count: "exact" }
          );

        if (searchQuery) {
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

        query = query.order(sortField, { ascending: sortOrder === "asc" });

        const from = (currentPage - 1) * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

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
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
    setCurrentPage(1);
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
          <OrderFilters 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedStatus={selectedStatus}
            setSelectedStatus={handleStatusChange}
            handleSearch={handleSearch}
          />

          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <EmptyOrdersState 
              searchQuery={searchQuery} 
              selectedStatus={selectedStatus} 
            />
          ) : (
            <>
              <OrdersTable 
                orders={orders} 
                sortField={sortField} 
                sortOrder={sortOrder} 
                handleSort={handleSort} 
              />

              <OrderPagination 
                currentPage={currentPage}
                totalCount={totalCount}
                pageSize={pageSize}
                handlePageChange={handlePageChange}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerServiceOrders;
