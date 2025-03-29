import React from "react";
import { Link } from "react-router-dom";

interface CategoryCardProps {
  id: string;
  name: string;
  imageUrl: string;
  productCount?: number;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  id,
  name,
  imageUrl,
  productCount,
}) => {
  return (
    <Link
      to={`/products?category=${id}`}
      className="group block relative overflow-hidden rounded-lg transition-all duration-300 hover:shadow-lg"
    >
      <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-800">
        <img
          src={
            imageUrl ||
            `https://source.unsplash.com/random/300x300/?${name.toLowerCase()}`
          }
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex flex-col justify-end p-4">
          <h3 className="text-white font-medium text-lg">{name}</h3>
          {productCount !== undefined && (
            <p className="text-white/80 text-sm">{productCount} products</p>
          )}
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
