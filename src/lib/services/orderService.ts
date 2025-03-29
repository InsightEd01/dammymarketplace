import { supabase } from "@/integrations/supabase/client";

// Function to get all orders
export const getAllOrders = async () => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        customer:customer_id(full_name, email)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching orders:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching orders:", error);
    return [];
  }
};

// Function to get order details by ID
export const getOrderById = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        customer:customer_id(full_name, email, phone, address),
        order_items:order_items(*, product:product_id(*))
      `,
      )
      .eq("id", orderId)
      .single();

    if (error) {
      console.error(`Error fetching order ${orderId}:`, error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Unexpected error fetching order ${orderId}:`, error);
    return null;
  }
};

// Function to get orders by status
export const getOrdersByStatus = async (status: string) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        customer:customer_id(full_name, email)
      `,
      )
      .eq("status", status)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(`Error fetching orders with status ${status}:`, error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error(
      `Unexpected error fetching orders with status ${status}:`,
      error,
    );
    return [];
  }
};

// Function to update order status
export const updateOrderStatus = async (orderId: string, status: string) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select()
      .single();

    if (error) {
      console.error(`Error updating order ${orderId} status:`, error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Unexpected error updating order ${orderId} status:`, error);
    return null;
  }
};

// Function to get payment records for an order
export const getOrderPayments = async (orderId: string) => {
  try {
    const { data, error } = await supabase
      .from("payment_records")
      .select("*")
      .eq("order_id", orderId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(`Error fetching payments for order ${orderId}:`, error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error(
      `Unexpected error fetching payments for order ${orderId}:`,
      error,
    );
    return [];
  }
};
