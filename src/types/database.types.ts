
// This file contains type definitions that can be used with Supabase
// It will be used as a temporary solution until we set up the proper database

export interface DatabaseProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category_id: string;
  subcategory_id?: string;
  stockQuantity: number;
  isFeatured: boolean;
  created_at?: string;
}

export interface DatabasePromotion {
  id: string;
  text: string;
  is_active: boolean;
  start_date: string;
  end_date: string;
  created_at?: string;
}

export interface DatabaseCustomer {
  id: string;
  email: string;
  full_name: string;
  address?: string;
  phone?: string;
  created_at: string;
}

// Add more types as needed for future database tables
