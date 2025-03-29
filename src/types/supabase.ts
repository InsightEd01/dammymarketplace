
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
  createdAt?: string; // Added for compatibility with mockData
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

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export type Order = {
  id: string;
  customer_id: string;
  status: OrderStatus;
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
  price: number; // Changed from unit_price to price to match DB
  product_name: string;
  product_image?: string;
};

export type ChatStatus = 'open' | 'assigned' | 'closed';
export type SenderType = 'customer' | 'rep' | 'system';

export type Chat = {
  id: string;
  customer_id: string;
  rep_id?: string;
  status: ChatStatus;
  created_at: string;
  customer?: {
    full_name?: string;
    email?: string;
  };
};

export type ChatMessage = {
  id: string;
  chat_id: string;
  sender_id: string;
  sender_type: SenderType;
  content: string;
  created_at: string;
};
