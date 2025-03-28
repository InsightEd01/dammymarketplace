
import React, { useEffect, useState } from 'react';
import { Promotion } from '@/types/supabase';
import { fetchActivePromotions } from '@/lib/services/promotionService';

const Marquee = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const getPromotions = async () => {
      setIsLoading(true);
      try {
        const activePromotions = await fetchActivePromotions();
        setPromotions(activePromotions);
      } catch (error) {
        console.error('Error loading promotions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    getPromotions();
  }, []);
  
  if (isLoading) return null;
  if (promotions.length === 0) return null;
  
  return (
    <div className="bg-primary py-2 text-white overflow-hidden">
      <div className="flex whitespace-nowrap animate-marquee">
        {/* Double the promotions to create seamless loop */}
        {[...promotions, ...promotions].map((promotion, index) => (
          <div key={`${promotion.id}-${index}`} className="mx-8 text-sm font-medium">
            {promotion.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
