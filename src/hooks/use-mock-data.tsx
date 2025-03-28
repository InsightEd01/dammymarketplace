
import { useState, useEffect } from 'react';
import { Product } from '@/lib/mockData';

export const useMockProducts = (featured: boolean = false, limit: number = 4) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Generate mock products
        const mockProducts = Array(limit).fill(null).map((_, idx) => ({
          id: featured ? idx + 1 : idx + 100,
          name: featured ? `Featured Item ${idx + 1}` : `Product ${idx + 1}`,
          description: 'This is a sample product description.',
          price: featured ? 29.99 + idx * 10 : 19.99 + idx * 5,
          imageUrl: `https://source.unsplash.com/random/300x300/?collectible&sig=${featured ? idx + 1 : idx + 100}`,
          category: ['Action Figures', 'Comics', 'Cards', 'Toys'][idx % 4],
          stockQuantity: 10 + idx,
          isFeatured: featured,
          category_id: `cat-${idx % 4}`,
        }));
        
        setProducts(mockProducts);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products');
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [featured, limit]);
  
  return { products, loading, error };
};

export const useMockPromotions = () => {
  const promotions = [
    "Free shipping on orders over $50!",
    "New collections dropping every month!",
    "Become a member to receive exclusive offers!",
    "Limited edition items available now!",
  ];
  
  return { promotions };
};
