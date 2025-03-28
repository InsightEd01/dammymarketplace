
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/lib/mockData';
import { Badge } from '@/components/ui/badge';

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stockQuantity <= 0) {
      toast({
        title: "Out of stock",
        description: "This item is currently out of stock",
        variant: "destructive",
      });
      return;
    }
    
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl,
      quantity: 1
    });
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart`,
    });
  };
  
  return (
    <div className="product-card group">
      <div className="relative overflow-hidden">
        <Link to={`/product/${product.id}`} className="block">
          <img 
            src={product.imageUrl || "https://source.unsplash.com/random/300x300/?collectible"} 
            alt={product.name} 
            className="product-image transition-transform duration-500 group-hover:scale-110"
          />
          
          {/* Out of stock overlay */}
          {product.stockQuantity <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-semibold px-4 py-2 bg-gray-900 bg-opacity-75 rounded-lg">
                Out of Stock
              </span>
            </div>
          )}
          
          {/* Quick action buttons */}
          <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
            <Button 
              size="icon" 
              variant="secondary" 
              className="h-8 w-8 rounded-full shadow-md bg-white text-gray-700 hover:text-primary"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toast({
                  title: "Wishlist",
                  description: "Feature coming soon!",
                });
              }}
            >
              <Heart className="h-4 w-4" />
              <span className="sr-only">Add to wishlist</span>
            </Button>
            
            <Link to={`/product/${product.id}`} className="inline-block">
              <Button 
                size="icon" 
                variant="secondary" 
                className="h-8 w-8 rounded-full shadow-md bg-white text-gray-700 hover:text-primary"
              >
                <Eye className="h-4 w-4" />
                <span className="sr-only">Quick view</span>
              </Button>
            </Link>
          </div>
          
          {/* Category badge */}
          {product.category && (
            <div className="absolute top-2 left-2">
              <Badge variant="secondary" className="bg-white/90 text-gray-800 font-medium shadow-sm">
                {product.category}
              </Badge>
            </div>
          )}
        </Link>
      </div>
      
      <div className="p-4">
        <Link to={`/product/${product.id}`} className="block">
          <h3 className="font-medium text-gray-800 text-base mb-1 line-clamp-1 hover:text-primary transition-colors">
            {product.name}
          </h3>
          
          <div className="flex justify-between items-center mb-3">
            <p className="price-tag">${product.price.toFixed(2)}</p>
            
            {product.oldPrice !== undefined && typeof product.oldPrice === 'number' && product.oldPrice > product.price && (
              <p className="text-sm text-gray-500 line-through">${product.oldPrice.toFixed(2)}</p>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">
              {product.stockQuantity > 0 
                ? `${product.stockQuantity} in stock` 
                : 'Out of stock'}
            </span>
            
            <div className="flex items-center text-yellow-400 text-xs">
              {[...Array(5)].map((_, i) => (
                <svg key={i} fill="currentColor" className="h-3 w-3" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
              <span className="ml-1 text-gray-500">(5.0)</span>
            </div>
          </div>
        </Link>
        
        <Button 
          className="w-full mt-3 bg-primary hover:bg-red-700 text-white flex items-center justify-center gap-2"
          onClick={handleAddToCart}
          disabled={product.stockQuantity <= 0}
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
