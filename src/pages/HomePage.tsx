import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/lib/mockData';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Sparkles, ShoppingBag, Tag } from 'lucide-react';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newestProducts, setNewestProducts] = useState<Product[]>([]);
  const [promoText, setPromoText] = useState<string[]>([
    "Free shipping on orders over $50!",
    "New collections dropping every month!",
    "Become a member to receive exclusive offers!",
    "Limited edition items available now!",
  ]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // For now, let's simulate data instead of using Supabase
        // This will be replaced with actual Supabase calls once we set up the database
        setTimeout(() => {
          // Mock featured products
          const mockFeatured = Array(4).fill(null).map((_, idx) => ({
            id: idx + 1,
            name: `Featured Collectible ${idx + 1}`,
            description: 'This is a featured collectible item.',
            price: 29.99 + idx * 10,
            imageUrl: `https://source.unsplash.com/random/300x300/?collectible&sig=${idx + 1}`,
            category: ['Action Figures', 'Comics', 'Cards', 'Toys'][idx % 4],
            stockQuantity: 10 + idx,
            isFeatured: true,
            category_id: `cat-${idx}`,
          }));
          
          // Mock newest products
          const mockNewest = Array(4).fill(null).map((_, idx) => ({
            id: idx + 5,
            name: `New Collectible ${idx + 1}`,
            description: 'This is a new collectible item.',
            price: 19.99 + idx * 5,
            imageUrl: `https://source.unsplash.com/random/300x300/?collectible&sig=${idx + 5}`,
            category: ['Vinyl Toys', 'Memorabilia', 'Posters', 'Trading Cards'][idx % 4],
            stockQuantity: 5 + idx,
            isFeatured: false,
            category_id: `cat-${idx + 4}`,
          }));
          
          setFeaturedProducts(mockFeatured);
          setNewestProducts(mockNewest);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-50 to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-20 md:py-28 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0 md:pr-10">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Discover Unique Collectibles
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Find rare and exclusive items from around the world. Our curated collection features limited edition pieces for true collectors.
              </p>
              <div className="space-x-4">
                <Link to="/products">
                  <Button size="lg" className="bg-primary hover:bg-red-700">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Shop Now
                  </Button>
                </Link>
                <Link to="/categories">
                  <Button variant="outline" size="lg">
                    Browse Categories
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative">
                <div className="rounded-lg overflow-hidden shadow-xl">
                  <img 
                    src="https://source.unsplash.com/random/800x600/?collectibles" 
                    alt="Featured Collectibles" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-5 -left-5 bg-primary text-white p-4 rounded-lg shadow-lg">
                  <p className="text-lg font-bold">New Arrivals</p>
                  <p className="text-sm">Limited Edition</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Promotions Marquee */}
      <div className="bg-primary text-white py-3">
        <div className="marquee-container">
          <div className="marquee-content">
            {promoText.map((text, index) => (
              <span key={index} className="mx-6 font-medium flex items-center">
                <Tag className="mr-2 h-4 w-4" />
                {text}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Featured Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
              <Sparkles className="mr-2 h-6 w-6 text-primary" />
              Featured Collectibles
            </h2>
            <Link to="/products?featured=true" className="text-primary hover:text-red-700 flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="product-card animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No featured products available at the moment.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Collection Categories */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            Shop by Category
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {['Action Figures', 'Comics', 'Trading Cards', 'Vinyl Toys'].map((category, idx) => (
              <Link 
                key={idx} 
                to={`/products?category=${category.toLowerCase().replace(' ', '-')}`}
                className="group"
              >
                <div className="relative overflow-hidden rounded-lg h-60 bg-gradient-to-r from-gray-700 to-gray-900">
                  <img 
                    src={`https://source.unsplash.com/random/300x400/?${category.toLowerCase()}`} 
                    alt={category}
                    className="w-full h-full object-cover opacity-70 group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-xl font-bold text-white">{category}</h3>
                      <span className="inline-block mt-2 px-4 py-1 bg-primary text-white text-sm rounded-full group-hover:bg-white group-hover:text-primary transition-colors duration-300">
                        Shop Now
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Newest Products Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
              New Arrivals
            </h2>
            <Link to="/products?sort=newest" className="text-primary hover:text-red-700 flex items-center">
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="product-card animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
                    <div className="h-10 bg-gray-200 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : newestProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {newestProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">No new products available at the moment.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Testimonial Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-12">
            What Our Customers Say
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                text: "The quality of the collectibles is outstanding. I've been a collector for years and Dammy Collectibles consistently offers the best items."
              },
              {
                name: "Sarah Williams",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                text: "Fast shipping and excellent packaging. My limited edition figure arrived in perfect condition. Will definitely shop here again!"
              },
              {
                name: "Michael Chen",
                avatar: "https://randomuser.me/api/portraits/men/11.jpg",
                text: "Their customer service is exceptional. They helped me track down a rare item I've been searching for years. Truly impressed!"
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-12 h-12 rounded-full mr-4" />
                  <h3 className="font-semibold text-lg">{testimonial.name}</h3>
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
                <div className="mt-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Newsletter Subscription */}
      <section className="py-16 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Join Our Collector's Club
            </h2>
            <p className="text-white opacity-90 max-w-2xl mx-auto mb-8">
              Subscribe to our newsletter to receive updates on new arrivals, exclusive offers, and collector tips.
            </p>
            
            <div className="max-w-md mx-auto">
              <form className="flex flex-col sm:flex-row gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-grow px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
                />
                <Button type="submit" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  Subscribe
                </Button>
              </form>
              <p className="text-sm text-white opacity-75 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
