
import { supabase } from "@/integrations/supabase/client";
import { Promotion } from "@/types/supabase";

export const fetchActivePromotions = async (): Promise<Promotion[]> => {
  try {
    const { data, error } = await supabase
      .from('promotions')
      .select('*')
      .eq('is_active', true)
      .gte('end_date', new Date().toISOString())
      .lte('start_date', new Date().toISOString())
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching promotions:', error);
      return [];
    }
    
    return data.map(item => ({
      id: item.id,
      text: item.text,
      is_active: item.is_active || false,
      start_date: item.start_date,
      end_date: item.end_date,
      created_at: item.created_at || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Unexpected error fetching promotions:', error);
    return [];
  }
};
