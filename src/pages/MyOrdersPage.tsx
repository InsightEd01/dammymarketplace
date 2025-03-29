import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Order, OrderItem } from "@/types/supabase";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

type OrderWithItems = Order & {
  order_items: OrderItem[];
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("orders")
          .select(
            `
            *,
            order_items (
              *,
              products (
                image_url,
                name
              )
            )
          `
          )
          .order("created_at", { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        if (data) {
          const ordersWithItems = data.map((order) => {
            const order_items = order.order_items.map((item) => ({
              ...item,
              product_name: item.products?.name || "Unknown Product",
              product_image: item.products?.image_url || null,
            }));

            return {
              id: order.id,
              customer_id: order.customer_id,
              status: order.status,
              total_amount: order.total_amount,
              shipping_address: order.shipping_address || '',
              payment_method: order.payment_method || 'unknown',
              transaction_id: order.transaction_id,
              created_at: order.created_at,
              order_items,
            } as OrderWithItems;
          });
          
          setOrders(ordersWithItems);
        }
      } catch (error: any) {
        console.error("Error fetching orders:", error);
        toast({
          title: "Error",
          description: `Failed to load orders: ${error.message}`,
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, [toast, navigate]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <OrderDetails key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

const OrderDetails = ({ order }: { order: OrderWithItems }) => {
  const orderDate = new Date(order.created_at).toLocaleDateString();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order #{order.id.substring(0, 8)}</CardTitle>
        <CardDescription>
          Order placed on {orderDate} - Total: ${order.total_amount.toFixed(2)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Order Items</h3>
          {order.order_items.map((item) => (
            <div key={item.id} className="flex justify-between py-2 border-b">
              <div className="flex items-center gap-3">
                {item.product_image && (
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    className="w-12 h-12 object-cover rounded"
                  />
                )}
                <div>
                  <p className="font-medium">{item.product_name || `Product ${item.product_id.slice(0, 8)}`}</p>
                  <p className="text-sm text-gray-500">
                    ${item.price.toFixed(2)} x {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <div>
          <p>
            <strong>Shipping Address:</strong> {order.shipping_address}
          </p>
          <p>
            <strong>Order Status:</strong> {order.status}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default MyOrdersPage;
