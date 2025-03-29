
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/supabase";
import { transformProductData } from "./productMapper";

export const fetchProductById = async (
  id: string | number
): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories:category_id(name),
        subcategories:subcategory_id(name)
      `
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

export const fetchFeaturedProducts = async (
  limit: number = 8
): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories:category_id(name),
        subcategories:subcategory_id(name)
      `
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
  limit: number = 8
): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select(
        `
        *,
        categories:category_id(name),
        subcategories:subcategory_id(name)
      `
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
