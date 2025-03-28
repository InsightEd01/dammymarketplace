
import React from 'react';
import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingCart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';

const CartPage = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, totalItems, totalPrice } = useCart();
  
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-gray-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-10 w-10 text-gray-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
          <Link to="/products">
            <Button className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded-md">
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Table Header - Desktop */}
            <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b bg-gray-50">
              <div className="col-span-6 font-medium text-gray-700">Product</div>
              <div className="col-span-2 font-medium text-gray-700 text-center">Price</div>
              <div className="col-span-2 font-medium text-gray-700 text-center">Quantity</div>
              <div className="col-span-2 font-medium text-gray-700 text-center">Total</div>
            </div>
            
            {/* Cart Items */}
            {cart.map(item => (
              <div key={item.id} className="border-b last:border-b-0">
                {/* Desktop Version */}
                <div className="hidden md:grid grid-cols-12 gap-4 p-4 items-center">
                  <div className="col-span-6">
                    <div className="flex items-center">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <div>
                        <h3 className="font-medium text-gray-800">{item.name}</h3>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-sm text-red-500 flex items-center mt-1 hover:underline"
                        >
                          <Trash2 className="h-3 w-3 mr-1" /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 text-center">${item.price.toFixed(2)}</div>
                  <div className="col-span-2">
                    <div className="flex items-center justify-center border border-gray-300 rounded-md w-28 mx-auto">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="text-gray-500 h-8 w-8"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-gray-500 h-8 w-8"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <div className="col-span-2 text-center font-medium">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                </div>
                
                {/* Mobile Version */}
                <div className="md:hidden p-4">
                  <div className="flex mb-3">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-20 h-20 object-cover rounded mr-4"
                    />
                    <div>
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-primary font-medium">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center border border-gray-300 rounded-md">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="text-gray-500 h-8 w-8"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-gray-500 h-8 w-8"
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Cart Actions */}
            <div className="p-4 bg-gray-50 flex justify-between items-center">
              <Button 
                variant="outline"
                className="text-gray-700 border-gray-300"
                onClick={clearCart}
              >
                Clear Cart
              </Button>
              <Link to="/products">
                <Button variant="ghost" className="text-gray-700">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <Link to="/checkout">
              <Button className="w-full bg-primary hover:bg-red-600 text-white py-2 rounded-md">
                Proceed to Checkout <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">We Accept</h3>
              <div className="flex space-x-2">
                <div className="bg-gray-200 rounded p-1 h-8 w-12"></div>
                <div className="bg-gray-200 rounded p-1 h-8 w-12"></div>
                <div className="bg-gray-200 rounded p-1 h-8 w-12"></div>
                <div className="bg-gray-200 rounded p-1 h-8 w-12"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
