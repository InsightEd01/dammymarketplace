
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/supabase";

// Helper function to transform database product data to our Product type
const transformProductData = (item: any): Product => ({
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

export const fetchFeaturedProducts = async (
  limit: number = 8,
): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories:category_id(name),
        subcategories:subcategory_id(name)
      `,
      )
      .eq("is_featured", true)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching featured products:", error);
      return [];
    }

    // Transform the data to match our Product type
    return (data || []).map(transformProductData);
  } catch (error) {
    console.error("Unexpected error fetching featured products:", error);
    return [];
  }
};

export const fetchNewArrivals = async (
  limit: number = 8,
): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories:category_id(name),
        subcategories:subcategory_id(name)
      `,
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error("Error fetching new arrivals:", error);
      return [];
    }

    // Transform the data to match our Product type
    return (data || []).map(transformProductData);
  } catch (error) {
    console.error("Unexpected error fetching new arrivals:", error);
    return [];
  }
};

export const fetchProductById = async (
  id: string | number,
): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories:category_id(name),
        subcategories:subcategory_id(name)
      `,
      )
      .eq("id", id.toString())
      .single();

    if (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }

    // Transform the data to match our Product type
    return transformProductData(data);
  } catch (error) {
    console.error(`Unexpected error fetching product ${id}:`, error);
    return null;
  }
};

export const fetchProductsByCategory = async (
  categoryId: string,
  limit: number = 20,
): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories:category_id(name),
        subcategories:subcategory_id(name)
      `,
      )
      .eq("category_id", categoryId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error(
        `Error fetching products for category ${categoryId}:`,
        error,
      );
      return [];
    }

    // Transform the data to match our Product type
    return (data || []).map(transformProductData);
  } catch (error) {
    console.error(
      `Unexpected error fetching products for category ${categoryId}:`,
      error,
    );
    return [];
  }
};

export const searchProducts = async (
  query: string,
  limit: number = 20,
): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories:category_id(name),
        subcategories:subcategory_id(name)
      `,
      )
      .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error(`Error searching products with query "${query}":`, error);
      return [];
    }

    // Transform the data to match our Product type
    return (data || []).map(transformProductData);
  } catch (error) {
    console.error(
      `Unexpected error searching products with query "${query}":`,
      error,
    );
    return [];
  }
};
