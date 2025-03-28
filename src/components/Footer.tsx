
import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-12 md:py-16 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">About</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Dammy Collectibles offers exclusive collectibles for enthusiasts. We curate the finest pieces from around the world.
            </p>
            <div className="flex space-x-4 mt-4">
              <a href="#" className="text-gray-400 hover:text-primary">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-primary text-sm">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-600 hover:text-primary text-sm">
                  Products
                </Link>
              </li>
              <li>
                <Link to="/cart" className="text-gray-600 hover:text-primary text-sm">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-primary text-sm">
                  Login / Register
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Categories</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link to="/products?category=action-figures" className="text-gray-600 hover:text-primary text-sm">
                  Action Figures
                </Link>
              </li>
              <li>
                <Link to="/products?category=comics" className="text-gray-600 hover:text-primary text-sm">
                  Comics
                </Link>
              </li>
              <li>
                <Link to="/products?category=trading-cards" className="text-gray-600 hover:text-primary text-sm">
                  Trading Cards
                </Link>
              </li>
              <li>
                <Link to="/products?category=vinyl-toys" className="text-gray-600 hover:text-primary text-sm">
                  Vinyl Toys
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Contact Us</h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <MapPin className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <span className="text-gray-600 text-sm">123 Collectible St., Lagos, Nigeria</span>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <span className="text-gray-600 text-sm">+234 123-456-7890</span>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 text-primary mr-2 flex-shrink-0" />
                <span className="text-gray-600 text-sm">info@dammycollectibles.com</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-200 py-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Dammy Collectibles. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link to="#" className="text-sm text-gray-500 hover:text-primary">
              Privacy Policy
            </Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-primary">
              Terms of Service
            </Link>
            <Link to="#" className="text-sm text-gray-500 hover:text-primary">
              Shipping Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
