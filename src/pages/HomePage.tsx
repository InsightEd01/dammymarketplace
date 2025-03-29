import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/types/supabase";
import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import HeroCarousel from "@/components/HeroCarousel";
import CategoryCard from "@/components/CategoryCard";
import NewsletterForm from "@/components/NewsletterForm";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Sparkles,
  ShoppingBag,
  Tag,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  fetchFeaturedProducts,
  fetchNewArrivals,
} from "@/lib/services/productService";
import { fetchCategories } from "@/lib/services/categoryService";
import { fetchActivePromotions } from "@/lib/services/promotionService";

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newestProducts, setNewestProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [promoText, setPromoText] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroSlides, setHeroSlides] = useState([
    {
      id: 1,
      imageUrl:
        "https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2070&auto=format&fit=crop",
      title: "Exclusive Collectibles",
      description:
        "Discover our new limited edition collectibles from around the world",
      buttonText: "Shop Now",
      buttonLink: "/products?featured=true",
      buttonVariant: "primary" as const,
    },
    {
      id: 2,
      imageUrl:
        "https://images.unsplash.com/photo-1608278047522-58806a6ac85b?q=80&w=2070&auto=format&fit=crop",
      title: "Vintage Collection",
      description:
        "Explore our curated selection of vintage items and rare finds",
      buttonText: "Explore",
      buttonLink: "/products?category=vintage",
      buttonVariant: "outline" as const,
    },
    {
      id: 3,
      imageUrl:
        "https://images.unsplash.com/photo-1594909122845-11baa439b7bf?q=80&w=2070&auto=format&fit=crop",
      title: "Special Discount",
      description: "Up to 30% off on selected items. Limited time offer!",
      buttonText: "View Deals",
      buttonLink: "/products?discount=true",
      buttonVariant: "secondary" as const,
    },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch data from Supabase
        const [featuredData, newArrivalsData, categoriesData, promotionsData] =
          await Promise.all([
            fetchFeaturedProducts(8),
            fetchNewArrivals(8),
            fetchCategories(),
            fetchActivePromotions(),
          ]);

        setFeaturedProducts(featuredData);
        setNewestProducts(newArrivalsData);

        // Process categories with images
        const processedCategories = categoriesData.map((category, index) => ({
          ...category,
          imageUrl: `https://source.unsplash.com/random/300x300/?${category.name.toLowerCase()}&sig=${index}`,
        }));
        setCategories(processedCategories);

        // Process promotions for marquee
        const promoMessages = promotionsData.map((promo) => promo.text);
        if (promoMessages.length === 0) {
          // Fallback promotions if none in database
          setPromoText([
            "Free shipping on orders over $50!",
            "New collections dropping every month!",
            "Become a member to receive exclusive offers!",
            "Limited edition items available now!",
          ]);
        } else {
          setPromoText(promoMessages);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        // Set fallback data if fetch fails
        if (featuredProducts.length === 0) {
          const mockFeatured = Array(4)
            .fill(null)
            .map(
              (_, idx) =>
                ({
                  id: idx + 1,
                  name: `Featured Collectible ${idx + 1}`,
                  description: "This is a featured collectible item.",
                  price: 29.99 + idx * 10,
                  imageUrl: `https://source.unsplash.com/random/300x300/?collectible&sig=${idx + 1}`,
                  category: ["Action Figures", "Comics", "Cards", "Toys"][
                    idx % 4
                  ],
                  stockQuantity: 10 + idx,
                  isFeatured: true,
                  category_id: `cat-${idx}`,
                  subcategory: ["Limited Edition", "Vintage", "Modern", "Rare"][
                    idx % 4
                  ],
                  created_at: new Date().toISOString(),
                }) as unknown as Product,
            );
          setFeaturedProducts(mockFeatured);
        }

        if (newestProducts.length === 0) {
          const mockNewest = Array(4)
            .fill(null)
            .map(
              (_, idx) =>
                ({
                  id: idx + 5,
                  name: `New Collectible ${idx + 1}`,
                  description: "This is a new collectible item.",
                  price: 19.99 + idx * 5,
                  imageUrl: `https://source.unsplash.com/random/300x300/?collectible&sig=${idx + 5}`,
                  category: [
                    "Vinyl Toys",
                    "Memorabilia",
                    "Posters",
                    "Trading Cards",
                  ][idx % 4],
                  stockQuantity: 5 + idx,
                  isFeatured: false,
                  category_id: `cat-${idx + 4}`,
                  subcategory: [
                    "Limited Edition",
                    "New Release",
                    "Special Edition",
                    "Exclusive",
                  ][idx % 4],
                  created_at: new Date().toISOString(),
                }) as unknown as Product,
            );
          setNewestProducts(mockNewest);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-background text-foreground">
      {/* Hero Section with Carousel and Search */}
      <div className="bg-gradient-to-r from-red-50 to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6 md:py-8">
            {/* Search Bar */}
            <div className="mb-6 max-w-2xl mx-auto">
              <SearchBar
                placeholder="Search for collectibles, vintage items, and more..."
                className="shadow-md"
              />
            </div>

            {/* Hero Carousel */}
            <HeroCarousel slides={heroSlides} />

            {/* Quick Category Access */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                "Action Figures",
                "Comics",
                "Trading Cards",
                "Vinyl Toys",
                "Memorabilia",
                "Collectibles",
              ].map((category, idx) => (
                <Link
                  key={idx}
                  to={`/products?category=${category.toLowerCase().replace(" ", "-")}`}
                  className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col items-center"
                >
                  <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-gray-700 flex items-center justify-center mb-2">
                    <img
                      src={`https://source.unsplash.com/random/50x50/?${category.toLowerCase()}`}
                      alt={category}
                      className="w-8 h-8 object-cover rounded-full"
                    />
                  </div>
                  <span className="text-sm font-medium">{category}</span>
                </Link>
              ))}
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

      {/* Featured Categories Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Zap className="mr-2 h-6 w-6 text-primary" />
              Shop by Category
            </h2>
            <Link
              to="/products"
              className="text-primary hover:text-red-700 flex items-center"
            >
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mt-2"></div>
                </div>
              ))}
            </div>
          ) : categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((category) => (
                <CategoryCard
                  key={category.id}
                  id={category.id}
                  name={category.name}
                  imageUrl={category.imageUrl}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500 dark:text-gray-400">
                No categories available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Sparkles className="mr-2 h-6 w-6 text-primary" />
              Featured Collectibles
            </h2>
            <Link
              to="/products?featured=true"
              className="text-primary hover:text-red-700 flex items-center"
            >
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="product-card animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
              <p className="text-gray-500 dark:text-gray-400">
                No featured products available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Deal of the Day Section */}
      <section className="py-12 bg-red-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="inline-block bg-red-100 dark:bg-red-900 text-primary dark:text-red-300 px-3 py-1 rounded-full text-sm font-medium mb-4">
                  Deal of the Day
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Special Edition Collectible
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Limited time offer! Get this exclusive collectible at 30% off.
                  Only a few items left in stock.
                </p>
                <div className="flex items-center mb-6">
                  <span className="text-3xl font-bold text-primary">
                    $99.99
                  </span>
                  <span className="ml-2 text-lg text-gray-500 dark:text-gray-400 line-through">
                    $149.99
                  </span>
                  <span className="ml-2 bg-primary text-white px-2 py-1 rounded text-sm">
                    Save 30%
                  </span>
                </div>
                <div className="flex space-x-4">
                  <Link to="/product/special-edition">
                    <Button className="bg-primary hover:bg-red-700 text-white">
                      View Deal
                    </Button>
                  </Link>
                  <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                    <span className="font-medium">Ends in:</span>
                    <span className="ml-2 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                      23:59:59
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <img
                src="https://images.unsplash.com/photo-1608278047522-58806a6ac85b?q=80&w=1170&auto=format&fit=crop"
                alt="Special Edition Collectible"
                className="rounded-lg shadow-lg w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Newest Products Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="mr-2 h-6 w-6 text-primary" />
              New Arrivals
            </h2>
            <Link
              to="/products?sort=newest"
              className="text-primary hover:text-red-700 flex items-center"
            >
              View all <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="product-card animate-pulse">
                  <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-lg"></div>
                  <div className="p-4">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-3"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
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
              <p className="text-gray-500 dark:text-gray-400">
                No new products available at the moment.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
            What Our Customers Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                avatar: "https://randomuser.me/api/portraits/men/32.jpg",
                text: "The quality of the collectibles is outstanding. I've been a collector for years and Dammy Collectibles consistently offers the best items.",
              },
              {
                name: "Sarah Williams",
                avatar: "https://randomuser.me/api/portraits/women/44.jpg",
                text: "Fast shipping and excellent packaging. My limited edition figure arrived in perfect condition. Will definitely shop here again!",
              },
              {
                name: "Michael Chen",
                avatar: "https://randomuser.me/api/portraits/men/11.jpg",
                text: "Their customer service is exceptional. They helped me track down a rare item I've been searching for years. Truly impressed!",
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg shadow-md"
              >
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <h3 className="font-semibold text-lg dark:text-white">
                    {testimonial.name}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 italic">
                  "{testimonial.text}"
                </p>
                <div className="mt-4 flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="h-5 w-5 fill-current"
                      viewBox="0 0 24 24"
                    >
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
              Subscribe to our newsletter to receive updates on new arrivals,
              exclusive offers, and collector tips.
            </p>

            <div className="max-w-md mx-auto">
              <NewsletterForm className="mb-4" />
              <p className="text-sm text-white opacity-75 mt-4">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* App Download Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-4">
                Download Our Mobile App
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Get exclusive mobile-only deals, easy tracking of your orders,
                and instant notifications when rare items are back in stock.
              </p>
              <div className="flex flex-wrap gap-4">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/Google_Play_Store_badge_EN.svg/2560px-Google_Play_Store_badge_EN.svg.png"
                  alt="Get it on Google Play"
                  className="h-12"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png"
                  alt="Download on App Store"
                  className="h-12"
                />
              </div>
            </div>
            <div className="md:w-1/2 md:pl-8">
              <img
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1170&auto=format&fit=crop"
                alt="Mobile App"
                className="rounded-lg shadow-lg max-w-xs mx-auto"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
