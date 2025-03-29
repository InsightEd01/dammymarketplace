import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/supabase";

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
    return data.map((item) => ({
      ...item,
      category: item.categories?.name || "",
      subcategory: item.subcategories?.name || "",
      imageUrl: item.image_url || "",
      isFeatured: item.is_featured || false,
      stockQuantity: item.stock_quantity || 0,
      oldPrice: item.old_price || undefined,
    }));
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
    return data.map((item) => ({
      ...item,
      category: item.categories?.name || "",
      subcategory: item.subcategories?.name || "",
      imageUrl: item.image_url || "",
      isFeatured: item.is_featured || false,
      stockQuantity: item.stock_quantity || 0,
      oldPrice: item.old_price || undefined,
    }));
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
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching product ${id}:`, error);
      return null;
    }

    // Transform the data to match our Product type
    return {
      ...data,
      category: data.categories?.name || "",
      subcategory: data.subcategories?.name || "",
      imageUrl: data.image_url || "",
      isFeatured: data.is_featured || false,
      stockQuantity: data.stock_quantity || 0,
      oldPrice: data.old_price || undefined,
    };
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
    return data.map((item) => ({
      ...item,
      category: item.categories?.name || "",
      subcategory: item.subcategories?.name || "",
      imageUrl: item.image_url || "",
      isFeatured: item.is_featured || false,
      stockQuantity: item.stock_quantity || 0,
      oldPrice: item.old_price || undefined,
    }));
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
    return data.map((item) => ({
      ...item,
      category: item.categories?.name || "",
      subcategory: item.subcategories?.name || "",
      imageUrl: item.image_url || "",
      isFeatured: item.is_featured || false,
      stockQuantity: item.stock_quantity || 0,
      oldPrice: item.old_price || undefined,
    }));
  } catch (error) {
    console.error(
      `Unexpected error searching products with query "${query}":`,
      error,
    );
    return [];
  }
};
