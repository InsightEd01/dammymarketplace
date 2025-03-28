
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import Marquee from '@/components/Marquee';
import { fetchFeaturedProducts, Product } from '@/lib/mockData';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadFeaturedProducts = async () => {
      setIsLoading(true);
      try {
        const products = await fetchFeaturedProducts();
        setFeaturedProducts(products);
      } catch (error) {
        console.error("Error loading featured products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFeaturedProducts();
  }, []);
  
  return (
    <div>
      {/* Promotions Marquee */}
      <Marquee />
      
      {/* Hero Section */}
      <section className="relative bg-gray-100 py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
                Discover Rare Collectibles & Memorabilia
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Find unique treasures and build your collection with Dammy Collectibles, your trusted source for authentic items.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/products">
                  <Button className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded-md">
                    Browse Collection
                  </Button>
                </Link>
                <Link to="/about">
                  <Button variant="outline" className="border-gray-300 text-gray-700 px-6 py-2 rounded-md">
                    Our Story
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative h-64 md:h-auto">
              <img 
                src="https://images.unsplash.com/photo-1544083305-9b5f4474e6a2?q=80&w=1170&auto=format&fit=crop" 
                alt="Collection of collectibles" 
                className="rounded-lg shadow-xl h-full w-full object-cover"
              />
              <div className="absolute -bottom-4 -right-4 bg-primary text-white px-6 py-3 rounded-lg shadow-lg">
                <p className="text-lg font-bold">New Arrivals Weekly!</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
            <Link to="/products" className="flex items-center text-primary hover:underline">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="product-card animate-pulse">
                  <div className="h-48 bg-gray-300"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-300 rounded w-1/4 mb-2"></div>
                    <div className="h-5 bg-gray-300 rounded w-3/4 mb-1"></div>
                    <div className="h-6 bg-gray-300 rounded w-1/4 mb-3"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-gray-300 rounded w-1/3"></div>
                      <div className="h-8 bg-gray-300 rounded w-1/4"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
      
      {/* Categories Showcase */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Browse By Category</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Link to="/products?category=Comics" className="category-item bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition-shadow">
              <div className="h-24 flex items-center justify-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1605142859862-978be7eba909?q=80&w=1170&auto=format&fit=crop" 
                  alt="Comics" 
                  className="h-20 w-20 object-contain"
                />
              </div>
              <h3 className="font-semibold text-gray-800">Comics</h3>
            </Link>
            
            <Link to="/products?category=Figurines" className="category-item bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition-shadow">
              <div className="h-24 flex items-center justify-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1566140967404-b8b3932483f5?q=80&w=1170&auto=format&fit=crop" 
                  alt="Figurines" 
                  className="h-20 w-20 object-contain"
                />
              </div>
              <h3 className="font-semibold text-gray-800">Figurines</h3>
            </Link>
            
            <Link to="/products?category=Movie+Memorabilia" className="category-item bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition-shadow">
              <div className="h-24 flex items-center justify-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1626131572431-1c02995a62cc?q=80&w=1176&auto=format&fit=crop" 
                  alt="Movie Memorabilia" 
                  className="h-20 w-20 object-contain"
                />
              </div>
              <h3 className="font-semibold text-gray-800">Movie Memorabilia</h3>
            </Link>
            
            <Link to="/products?category=Gaming" className="category-item bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition-shadow">
              <div className="h-24 flex items-center justify-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1593305841991-05c297ba4575?q=80&w=1057&auto=format&fit=crop" 
                  alt="Gaming" 
                  className="h-20 w-20 object-contain"
                />
              </div>
              <h3 className="font-semibold text-gray-800">Gaming</h3>
            </Link>
            
            <Link to="/products?category=Coins" className="category-item bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition-shadow">
              <div className="h-24 flex items-center justify-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1605792657660-596af9009e82?q=80&w=1102&auto=format&fit=crop" 
                  alt="Coins" 
                  className="h-20 w-20 object-contain"
                />
              </div>
              <h3 className="font-semibold text-gray-800">Coins</h3>
            </Link>
            
            <Link to="/products?category=Trading+Cards" className="category-item bg-white rounded-lg shadow p-4 text-center hover:shadow-md transition-shadow">
              <div className="h-24 flex items-center justify-center mb-4">
                <img 
                  src="https://images.unsplash.com/photo-1607435097405-db48f377bff6?q=80&w=1172&auto=format&fit=crop" 
                  alt="Trading Cards" 
                  className="h-20 w-20 object-contain"
                />
              </div>
              <h3 className="font-semibold text-gray-800">Trading Cards</h3>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">What Our Collectors Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                  <img 
                    src="https://randomuser.me/api/portraits/men/32.jpg" 
                    alt="Customer" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">Michael Thompson</h4>
                  <p className="text-gray-500 text-sm">Comic Collector</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I've been collecting comics for over 20 years, and Dammy Collectibles is by far the best source I've found. Their authentication process is top-notch, and the selection is incredible."
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                  <img 
                    src="https://randomuser.me/api/portraits/women/44.jpg" 
                    alt="Customer" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">Sarah Johnson</h4>
                  <p className="text-gray-500 text-sm">Movie Memorabilia Enthusiast</p>
                </div>
              </div>
              <p className="text-gray-600">
                "The signed movie poster I purchased came with detailed authentication and was perfectly packaged. Customer service was extremely helpful when I had questions."
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="h-12 w-12 rounded-full bg-gray-200 overflow-hidden">
                  <img 
                    src="https://randomuser.me/api/portraits/men/67.jpg" 
                    alt="Customer" 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="ml-4">
                  <h4 className="font-semibold text-gray-800">David Chen</h4>
                  <p className="text-gray-500 text-sm">Vintage Game Collector</p>
                </div>
              </div>
              <p className="text-gray-600">
                "I was skeptical about buying sealed vintage games online, but Dammy Collectibles exceeded my expectations. The condition was exactly as described, and shipping was fast."
              </p>
              <div className="flex mt-4">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Newsletter */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Join Our Collector Community</h2>
            <p className="text-white opacity-90 mb-8">
              Subscribe to receive notifications about new arrivals, restocks, and exclusive offers.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="flex-grow px-4 py-3 rounded-md focus:outline-none"
                required
              />
              <Button className="bg-white text-primary hover:bg-gray-100 px-6 py-3 rounded-md font-medium">
                Subscribe
              </Button>
            </form>
            
            <p className="text-white opacity-75 text-sm mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
