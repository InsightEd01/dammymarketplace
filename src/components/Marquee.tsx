
import React, { useEffect, useState } from 'react';
import { fetchActivePromotions, Promotion } from '@/lib/mockData';

const Marquee = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  
  useEffect(() => {
    const getPromotions = async () => {
      const activePromotions = await fetchActivePromotions();
      setPromotions(activePromotions);
    };
    
    getPromotions();
  }, []);
  
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
