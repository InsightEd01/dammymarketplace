import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MessageSquare,
  ShoppingCart,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data: featured, error: featuredError } = await supabase
          .from("products")
          .select("*")
          .eq("is_featured", true)
          .limit(4);

        if (featuredError) throw featuredError;

        const { data: allProducts, error: allProductsError } = await supabase
          .from("products")
          .select("*")
          .limit(8);

        if (allProductsError) throw allProductsError;

        setFeaturedProducts(featured || []);
        setProducts(allProducts || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Welcome to Our Store
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Discover our latest and greatest products.
        </p>
      </header>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
          Featured Products
        </h2>
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="flex flex-wrap -mx-4">
            {featuredProducts.map((product) => (
              <div key={product.id} className="w-full md:w-1/3 lg:w-1/4 px-4 mb-8">
                <ProductCard 
                  product={{
                    ...product,
                    createdAt: product.created_at || new Date().toISOString(),
                    id: typeof product.id === 'string' ? parseInt(product.id.replace(/-/g, '').substring(0, 8), 16) : Number(product.id)
                  }} 
                />
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
          All Products
        </h2>
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
          </div>
        ) : (
          <div className="flex flex-wrap -mx-4">
            {products.map((product) => (
              <div key={product.id} className="w-full md:w-1/3 lg:w-1/4 px-4 mb-8">
                <ProductCard 
                  product={{
                    ...product,
                    createdAt: product.created_at || new Date().toISOString(),
                    id: typeof product.id === 'string' ? parseInt(product.id.replace(/-/g, '').substring(0, 8), 16) : Number(product.id)
                  }} 
                />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
