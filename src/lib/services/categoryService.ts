import { supabase } from "@/integrations/supabase/client";
import { Category, Subcategory } from "@/types/supabase";

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const { data: categoriesData, error: categoriesError } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (categoriesError) {
      console.error("Error fetching categories:", categoriesError);
      return [];
    }

    // Fetch subcategories for each category
    const categoriesWithSubcategories = await Promise.all(
      categoriesData.map(async (category) => {
        const { data: subcategoriesData, error: subcategoriesError } =
          await supabase
            .from("subcategories")
            .select("*")
            .eq("category_id", category.id)
            .order("name");

        if (subcategoriesError) {
          console.error(
            `Error fetching subcategories for category ${category.id}:`,
            subcategoriesError,
          );
          return { ...category, subcategories: [] };
        }

        return { ...category, subcategories: subcategoriesData || [] };
      }),
    );

    return categoriesWithSubcategories;
  } catch (error) {
    console.error("Unexpected error fetching categories:", error);
    return [];
  }
};

export const fetchCategoryById = async (
  id: string,
): Promise<Category | null> => {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(`Error fetching category ${id}:`, error);
      return null;
    }

    return data;
  } catch (error) {
    console.error(`Unexpected error fetching category ${id}:`, error);
    return null;
  }
};

export const fetchSubcategoriesByCategoryId = async (
  categoryId: string,
): Promise<Subcategory[]> => {
  try {
    const { data, error } = await supabase
      .from("subcategories")
      .select("*")
      .eq("category_id", categoryId)
      .order("name");

    if (error) {
      console.error(
        `Error fetching subcategories for category ${categoryId}:`,
        error,
      );
      return [];
    }

    return data || [];
  } catch (error) {
    console.error(
      `Unexpected error fetching subcategories for category ${categoryId}:`,
      error,
    );
    return [];
  }
};
