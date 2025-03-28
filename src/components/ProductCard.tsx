
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/mockData';

type ProductCardProps = {
  product: Product;
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrl
    });
  };
  
  return (
    <div className="product-card group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="product-image transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white font-semibold text-sm bg-primary bg-opacity-90 rounded-full px-3 py-1">
              View Details
            </span>
          </div>
        </div>
        
        <div className="p-4">
          <div className="category-badge mb-2">{product.category}</div>
          <h3 className="font-semibold text-gray-800 mb-1 line-clamp-1">{product.name}</h3>
          <p className="price-tag mb-3">${product.price.toFixed(2)}</p>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-500">
              {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}
            </span>
            
            <Button 
              size="sm" 
              className="bg-primary hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1" 
              onClick={handleAddToCart}
              disabled={product.stockQuantity <= 0}
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="sr-only md:not-sr-only md:inline-block">Add to Cart</span>
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
