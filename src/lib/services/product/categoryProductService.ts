
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/supabase";
import { transformProductData } from "./productMapper";

export const fetchProductsByCategory = async (
  categoryId: string,
  limit: number = 20
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
      .eq("category_id", categoryId)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      console.error(
        `Error fetching products for category ${categoryId}:`,
        error
      );
      return [];
    }

    // Transform the data to match our Product type
    return (data || []).map(transformProductData);
  } catch (error) {
    console.error(
      `Unexpected error fetching products for category ${categoryId}:`,
      error
    );
    return [];
  }
};
