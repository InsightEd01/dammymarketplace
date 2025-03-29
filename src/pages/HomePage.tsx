import React, { useState, useEffect } from "react";
import { Product } from "@/types/supabase";
import { fetchFeaturedProducts, fetchNewArrivals } from "@/lib/services/productService";
import { useMockData } from "@/hooks/use-mock-data";
import { mockData } from "@/lib/mockData";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true);
        
        // Fetch featured products from API or use mock data
        let featuredProductsData: Product[] = [];
        
        if (useMockData) {
          featuredProductsData = mockData.featuredProducts;
        } else {
          featuredProductsData = await fetchFeaturedProducts(8);
          // Convert the Supabase product type to mockData product format if needed
          // This is a temporary measure until we can standardize the types
        }
        
        setFeaturedProducts(featuredProductsData as any);
        
        // Fetch new arrivals
        let newArrivalsData: Product[] = [];
        
        if (useMockData) {
          newArrivalsData = mockData.newArrivals;
        } else {
          newArrivalsData = await fetchNewArrivals(8);
        }
        
        setNewArrivals(newArrivalsData as any);
        
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading home page data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, []);

  return (
    <div className="container mx-auto py-10">
      <section className="mb-12">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Featured Products</h2>
          <Link to="/products" className="text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>
                      <Skeleton className="h-5 w-4/5" />
                    </CardTitle>
                    <CardDescription>
                      <Skeleton className="h-3 w-3/5" />
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-40 w-full" />
                    <div className="mt-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              ))
            : featuredProducts.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold">${product.price}</p>
                        {product.oldPrice && (
                          <p className="text-sm line-through text-gray-500">
                            ${product.oldPrice}
                          </p>
                        )}
                      </div>
                      <Button asChild>
                        <Link to={`/products/${product.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </section>

      <section className="mb-12">
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">New Arrivals</h2>
          <Link to="/products" className="text-primary hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <CardTitle>
                      <Skeleton className="h-5 w-4/5" />
                    </CardTitle>
                    <CardDescription>
                      <Skeleton className="h-3 w-3/5" />
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-40 w-full" />
                    <div className="mt-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-16 mt-1" />
                    </div>
                  </CardContent>
                </Card>
              ))
            : newArrivals.map((product) => (
                <Card key={product.id}>
                  <CardHeader>
                    <CardTitle>{product.name}</CardTitle>
                    <CardDescription>{product.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-md mb-4"
                    />
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold">${product.price}</p>
                        {product.oldPrice && (
                          <p className="text-sm line-through text-gray-500">
                            ${product.oldPrice}
                          </p>
                        )}
                      </div>
                      <Button asChild>
                        <Link to={`/products/${product.id}`}>View</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
        </div>
      </section>

      <section>
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Promotions</h2>
          <Link to="/promotions" className="text-primary hover:underline">
            View All
          </Link>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Special Offer</CardTitle>
            <CardDescription>
              Get 20% off on all orders above $100
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Use code <strong>SUMMER20</strong> at checkout.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default HomePage;
