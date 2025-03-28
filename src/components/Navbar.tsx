
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X, User, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCart } from '@/context/CartContext';
import { categories, Category } from '@/lib/mockData';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const { totalItems } = useCart();
  
  useEffect(() => {
    // Simulate fetching categories from API
    setAllCategories(categories);
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-primary">Dammy</span>
            <span className="text-xl font-medium">Collectibles</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary">Home</Link>
            
            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="text-gray-700 hover:text-primary flex items-center">
                Categories
              </button>
              <div className="absolute z-50 left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                {allCategories.map(category => (
                  <DropdownMenu key={category.id}>
                    <DropdownMenuTrigger asChild>
                      <button className="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        {category.name}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="min-w-[200px]">
                      <DropdownMenuLabel>{category.name}</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {category.subcategories.map(subcategory => (
                        <DropdownMenuItem key={subcategory.id} asChild>
                          <Link to={`/products?category=${category.name}&subcategory=${subcategory.name}`}>
                            {subcategory.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ))}
              </div>
            </div>
            
            <Link to="/products" className="text-gray-700 hover:text-primary">All Products</Link>
            <Link to="/about" className="text-gray-700 hover:text-primary">About</Link>
            <Link to="/contact" className="text-gray-700 hover:text-primary">Contact</Link>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Search..." 
                className="w-48 pl-8"
              />
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <Link to="/login">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link to="/cart" className="relative">
              <Button variant="ghost" size="icon">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>
            
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="container mx-auto px-4 py-3">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="text-gray-700 hover:text-primary py-2" onClick={() => setIsMenuOpen(false)}>Home</Link>
              <Link to="/products" className="text-gray-700 hover:text-primary py-2" onClick={() => setIsMenuOpen(false)}>All Products</Link>
              <Link to="/about" className="text-gray-700 hover:text-primary py-2" onClick={() => setIsMenuOpen(false)}>About</Link>
              <Link to="/contact" className="text-gray-700 hover:text-primary py-2" onClick={() => setIsMenuOpen(false)}>Contact</Link>
              <Link to="/login" className="text-gray-700 hover:text-primary py-2" onClick={() => setIsMenuOpen(false)}>Login</Link>
              
              <div className="pt-2">
                <Input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
