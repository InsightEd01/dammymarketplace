
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Filter, 
  Search, 
  SlidersHorizontal, 
  X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import ProductCard from '@/components/ProductCard';
import { 
  fetchAllProducts, 
  fetchProductsByCategory,
  searchProducts,
  filterProductsByPrice,
  Product,
  categories
} from '@/lib/mockData';

const ProductsPage = () => {
  const location = useLocation();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [subcategoryFilter, setSubcategoryFilter] = useState<string | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Parse URL params for category and subcategory
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    const subcategory = params.get('subcategory');
    
    if (category) {
      setCategoryFilter(category);
    }
    
    if (subcategory) {
      setSubcategoryFilter(subcategory);
    }
  }, [location.search]);
  
  // Fetch products based on category filter
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      try {
        let loadedProducts;
        
        if (categoryFilter) {
          loadedProducts = await fetchProductsByCategory(categoryFilter);
        } else {
          loadedProducts = await fetchAllProducts();
        }
        
        setProducts(loadedProducts);
        setFilteredProducts(loadedProducts);
      } catch (error) {
        console.error("Error loading products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadProducts();
  }, [categoryFilter]);
  
  // Apply filters (search, price, subcategory)
  useEffect(() => {
    const applyFilters = async () => {
      let filtered = [...products];
      
      // Apply search filter
      if (searchQuery.trim()) {
        filtered = await searchProducts(searchQuery);
      }
      
      // Apply price filter
      filtered = filtered.filter(
        product => product.price >= priceRange[0] && product.price <= priceRange[1]
      );
      
      // Apply subcategory filter
      if (subcategoryFilter) {
        filtered = filtered.filter(product => product.subcategory === subcategoryFilter);
      }
      
      setFilteredProducts(filtered);
    };
    
    applyFilters();
  }, [searchQuery, priceRange, subcategoryFilter, products]);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };
  
  const handleCategoryChange = (category: string | null) => {
    setCategoryFilter(category);
    setSubcategoryFilter(null);
  };
  
  const handleSubcategoryChange = (subcategory: string | null) => {
    setSubcategoryFilter(subcategory);
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setPriceRange([0, 1000]);
    setCategoryFilter(null);
    setSubcategoryFilter(null);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Mobile Filter Toggle */}
        <div className="w-full md:hidden flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-gray-800">Products</h1>
          <Button 
            variant="outline" 
            className="flex items-center" 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Filters
          </Button>
        </div>
        
        {/* Filters Sidebar - Desktop */}
        <div className="hidden md:block w-64 bg-white rounded-lg shadow p-6 sticky top-24">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Filters</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters}
              className="text-gray-500 hover:text-primary"
            >
              Clear All
            </Button>
          </div>
          
          {/* Search */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={handleSearch}
                className="pl-9 w-full"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          
          {/* Price Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <div className="px-2">
              <Slider
                defaultValue={[0, 1000]}
                min={0}
                max={1000}
                step={50}
                value={priceRange}
                onValueChange={handlePriceChange}
                className="mb-4"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>${priceRange[0]}</span>
                <span>${priceRange[1]}</span>
              </div>
            </div>
          </div>
          
          {/* Categories */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
            <div className="space-y-2">
              {categories.map(category => (
                <div key={category.id}>
                  <button 
                    className={`text-left w-full px-2 py-1 rounded text-sm ${categoryFilter === category.name ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                    onClick={() => handleCategoryChange(category.name)}
                  >
                    {category.name}
                  </button>
                  
                  {categoryFilter === category.name && (
                    <div className="pl-4 mt-2 space-y-1">
                      {category.subcategories.map(subcategory => (
                        <button 
                          key={subcategory.id}
                          className={`text-left w-full px-2 py-1 rounded text-sm ${subcategoryFilter === subcategory.name ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`}
                          onClick={() => handleSubcategoryChange(subcategory.name)}
                        >
                          {subcategory.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Filters Sidebar - Mobile */}
        {isFilterOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex md:hidden">
            <div className="bg-white w-80 h-full overflow-auto ml-auto">
              <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsFilterOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="p-4">
                {/* Search */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <Input 
                      type="text" 
                      placeholder="Search products..." 
                      value={searchQuery}
                      onChange={handleSearch}
                      className="pl-9 w-full"
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                {/* Price Range */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 1000]}
                      min={0}
                      max={1000}
                      step={50}
                      value={priceRange}
                      onValueChange={handlePriceChange}
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                
                {/* Categories */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Categories</label>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <div key={category.id}>
                        <button 
                          className={`text-left w-full px-2 py-1 rounded text-sm ${categoryFilter === category.name ? 'bg-primary text-white' : 'hover:bg-gray-100'}`}
                          onClick={() => handleCategoryChange(category.name)}
                        >
                          {category.name}
                        </button>
                        
                        {categoryFilter === category.name && (
                          <div className="pl-4 mt-2 space-y-1">
                            {category.subcategories.map(subcategory => (
                              <button 
                                key={subcategory.id}
                                className={`text-left w-full px-2 py-1 rounded text-sm ${subcategoryFilter === subcategory.name ? 'bg-gray-200 font-medium' : 'hover:bg-gray-100'}`}
                                onClick={() => handleSubcategoryChange(subcategory.name)}
                              >
                                {subcategory.name}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    className="w-full bg-primary text-white"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Apply Filters
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={clearFilters}
                  >
                    Clear All
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Products Grid */}
        <div className="flex-1">
          <div className="hidden md:flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {categoryFilter ? `${categoryFilter} ${subcategoryFilter ? `- ${subcategoryFilter}` : ''}` : 'All Products'}
            </h1>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {filteredProducts.length} products
              </span>
            </div>
          </div>
          
          {/* Active Filters */}
          {(searchQuery || priceRange[0] > 0 || priceRange[1] < 1000 || categoryFilter || subcategoryFilter) && (
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-sm text-gray-500 flex items-center">
                <Filter className="mr-1 h-4 w-4" /> Active Filters:
              </span>
              
              {searchQuery && (
                <span className="bg-gray-200 text-gray-700 text-xs rounded-full px-3 py-1 flex items-center">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery('')} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                <span className="bg-gray-200 text-gray-700 text-xs rounded-full px-3 py-1 flex items-center">
                  Price: ${priceRange[0]} - ${priceRange[1]}
                  <button onClick={() => setPriceRange([0, 1000])} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {categoryFilter && (
                <span className="bg-gray-200 text-gray-700 text-xs rounded-full px-3 py-1 flex items-center">
                  Category: {categoryFilter}
                  <button onClick={() => handleCategoryChange(null)} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              {subcategoryFilter && (
                <span className="bg-gray-200 text-gray-700 text-xs rounded-full px-3 py-1 flex items-center">
                  Subcategory: {subcategoryFilter}
                  <button onClick={() => handleSubcategoryChange(null)} className="ml-1">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              
              <button 
                onClick={clearFilters}
                className="text-primary text-xs hover:underline"
              >
                Clear all
              </button>
            </div>
          )}
          
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
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
          ) : filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No products found</h3>
              <p className="text-gray-500 mb-4">Try adjusting your search or filter criteria.</p>
              <Button onClick={clearFilters}>Clear All Filters</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
