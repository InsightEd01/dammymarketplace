import { supabase } from "@/integrations/supabase/client";

// Function to check if a user has a specific role
export const checkUserRole = async (
  userId: string,
  role: string,
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("*")
      .eq("user_id", userId)
      .eq("role", role)
      .single();

    if (error) {
      console.error("Error checking user role:", error);
      return false;
    }

    return !!data;
  } catch (error) {
    console.error("Unexpected error checking user role:", error);
    return false;
  }
};

// Function to get all users with a specific role
export const getUsersByRole = async (role: string) => {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select(
        `
        id,
        user_id,
        role,
        created_at
      `,
      )
      .eq("role", role);

    if (error) {
      console.error(`Error fetching users with role ${role}:`, error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error(`Unexpected error fetching users with role ${role}:`, error);
    return [];
  }
};

// Function to get customer details by ID
export const getCustomerById = async (customerId: string) => {
  try {
    const { data, error } = await supabase
      .from("customer_profiles")
      .select("*")
      .eq("id", customerId)
      .single();

    if (error) {
      console.error(`Error fetching customer ${customerId}:`, error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Unexpected error fetching customer ${customerId}:`, error);
    return null;
  }
};

// Function to get all customer profiles
export const getAllCustomers = async () => {
  try {
    const { data, error } = await supabase
      .from("customer_profiles")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching customers:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching customers:", error);
    return [];
  }
};

// Function to get all orders for a specific customer
export const getCustomerOrders = async (customerId: string) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items:order_items(*)
      `,
      )
      .eq("customer_id", customerId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(`Error fetching orders for customer ${customerId}:`, error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error(
      `Unexpected error fetching orders for customer ${customerId}:`,
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
