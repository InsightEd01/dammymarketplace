
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/supabase";
import { transformProductData } from "./productMapper";

export const searchProducts = async (
  query: string,
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
      error
    );
    return [];
  }
};
