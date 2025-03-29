
import { Product } from "@/types/supabase";

// Helper function to transform database product data to our Product type
export const transformProductData = (item: any): Product => ({
  id: item.id.toString(), // Ensure id is always string
  name: item.name,
  description: item.description || "",
  price: item.price,
  oldPrice: item.old_price || undefined,
  imageUrl: item.image_url || "",
  category_id: item.category_id || "",
  subcategory_id: item.subcategory_id || undefined,
  stockQuantity: item.stock_quantity || 0,
  isFeatured: item.is_featured || false,
  category: item.categories?.name || "",
  subcategory: item.subcategories?.name || "",
  created_at: item.created_at || "",
  createdAt: item.created_at || "",
});
