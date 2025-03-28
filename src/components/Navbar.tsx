import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Menu, ShoppingCart, User, LogOut, Home, Package, Search } from 'lucide-react';

type Category = {
  id: string;
  name: string;
  subcategories?: Subcategory[];
};

type Subcategory = {
  id: string;
  name: string;
  category_id: string;
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [user, setUser] = useState<any>(null);
  const { cart } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const cartItems = cart || [];
  
  useEffect(() => {
    const getUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        setUser(data.user);
      } catch (error) {
        console.error("Error getting user:", error);
      }
    };
    
    getUser();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    
    const fetchCategories = async () => {
      try {
        setCategories([
          {
            id: '1',
            name: 'Collectibles',
            subcategories: [
              { id: '1-1', name: 'Trading Cards', category_id: '1' },
              { id: '1-2', name: 'Figurines', category_id: '1' }
            ]
          },
          {
            id: '2',
            name: 'Vintage',
            subcategories: [
              { id: '2-1', name: 'Records', category_id: '2' },
              { id: '2-2', name: 'Comics', category_id: '2' }
            ]
          }
        ]);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };
    
    fetchCategories();
    
    return () => {
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);
  
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully"
        });
        navigate('/login');
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="shrink-0 flex items-center">
              <Link to="/" className="text-primary font-bold text-xl">
                Dammy Collectibles
              </Link>
            </div>
            
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link 
                to="/" 
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                <Home className="mr-1 h-4 w-4" />
                Home
              </Link>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                    <Package className="mr-1 h-4 w-4" />
                    Categories
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                  {categories.length > 0 ? (
                    categories.map((category) => (
                      <React.Fragment key={category.id}>
                        <DropdownMenuLabel>
                          <Link to={`/products?category=${category.id}`} className="w-full block">
                            {category.name}
                          </Link>
                        </DropdownMenuLabel>
                        
                        {category.subcategories && category.subcategories.length > 0 && (
                          <>
                            {category.subcategories.map((subcategory) => (
                              <DropdownMenuItem key={subcategory.id} asChild>
                                <Link to={`/products?subcategory=${subcategory.id}`}>
                                  {subcategory.name}
                                </Link>
                              </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                          </>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <DropdownMenuItem>No categories available</DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <Link 
                to="/products" 
                className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
              >
                <Search className="mr-1 h-4 w-4" />
                All Products
              </Link>
            </div>
          </div>
          
          <div className="flex items-center">
            <Link to="/cart" className="p-2 text-gray-400 hover:text-gray-500 relative">
              <ShoppingCart className="h-6 w-6" />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-primary text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </Link>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="ml-3 relative">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url || ''} />
                      <AvatarFallback>
                        {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    {user.user_metadata?.full_name || user.email}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">My Orders</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost" className="ml-3">
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
            
            <div className="flex items-center sm:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={`${isOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          
          {categories.map((category) => (
            <div key={category.id}>
              <Link
                to={`/products?category=${category.id}`}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={() => setIsOpen(false)}
              >
                {category.name}
              </Link>
              
              {category.subcategories && category.subcategories.length > 0 && (
                <div className="pl-6">
                  {category.subcategories.map((subcategory) => (
                    <Link
                      key={subcategory.id}
                      to={`/products?subcategory=${subcategory.id}`}
                      className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-sm font-medium text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                      onClick={() => setIsOpen(false)}
                    >
                      {subcategory.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          
          <Link
            to="/products"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={() => setIsOpen(false)}
          >
            All Products
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
