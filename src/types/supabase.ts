// Define types for our Supabase database tables
export type Category = {
  id: string;
  name: string;
  created_at?: string;
  subcategories?: Subcategory[];
};

export type Subcategory = {
  id: string;
  name: string;
  category_id: string;
  created_at?: string;
};

export type Product = {
  id: string | number;
  name: string;
  description: string;
  price: number;
  oldPrice?: number; // Added oldPrice property
  imageUrl: string;
  category_id: string;
  subcategory_id?: string;
  stockQuantity: number;
  isFeatured: boolean;
  category?: string; // Category name for display
  subcategory?: string; // Added subcategory name for display
  created_at?: string;
};

export type Customer = {
  id: string;
  email: string;
  full_name: string;
  address?: string;
  phone?: string;
  created_at: string;
};

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

export type Promotion = {
  id: string;
  text: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  created_at?: string;
};

export type Order = {
  id: string;
  customer_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: number;
  shipping_address: string;
  payment_method: string;
  transaction_id?: string;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product_name: string;
  product_image?: string;
};

export type Chat = {
  id: string;
  customer_id: string;
  rep_id?: string;
  status: 'open' | 'assigned' | 'closed';
  created_at: string;
};

export type ChatMessage = {
  id: string;
  chat_id: string;
  sender_id: string;
  sender_type: 'customer' | 'rep' | 'system';
  content: string;
  created_at: string;
};
