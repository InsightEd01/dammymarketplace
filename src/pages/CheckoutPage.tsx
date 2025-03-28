
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, User, MapPin, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/context/CartContext';

type CheckoutStep = 'information' | 'shipping' | 'payment';

const CheckoutPage = () => {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('information');
  const { cart, totalItems, totalPrice } = useCart();
  const [formError, setFormError] = useState<string | null>(null);
  
  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep === 'information') {
      setCurrentStep('shipping');
    } else if (currentStep === 'shipping') {
      setCurrentStep('payment');
    } else {
      // Process payment
      alert('Payment processed successfully! (This is a demo)');
    }
  };
  
  const handlePreviousStep = () => {
    if (currentStep === 'shipping') {
      setCurrentStep('information');
    } else if (currentStep === 'payment') {
      setCurrentStep('shipping');
    }
  };
  
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center py-12">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start mb-6 max-w-md mx-auto">
            <AlertCircle className="h-5 w-5 text-yellow-500 mr-3 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-700">Your cart is empty</h3>
              <p className="text-yellow-600 text-sm">Please add items to your cart before proceeding to checkout.</p>
            </div>
          </div>
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
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center mb-8">
        <Link to="/cart" className="text-gray-500 hover:text-primary flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Cart
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Steps Navigation */}
            <div className="border-b">
              <div className="flex">
                <div 
                  className={`flex-1 text-center py-4 ${currentStep === 'information' ? 'bg-gray-50 font-medium' : ''}`}
                >
                  <span className="flex items-center justify-center">
                    <User className="h-4 w-4 mr-2" />
                    Information
                  </span>
                </div>
                <div 
                  className={`flex-1 text-center py-4 ${currentStep === 'shipping' ? 'bg-gray-50 font-medium' : ''}`}
                >
                  <span className="flex items-center justify-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    Shipping
                  </span>
                </div>
                <div 
                  className={`flex-1 text-center py-4 ${currentStep === 'payment' ? 'bg-gray-50 font-medium' : ''}`}
                >
                  <span className="flex items-center justify-center">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment
                  </span>
                </div>
              </div>
            </div>
            
            {/* Form Content */}
            <div className="p-6">
              {formError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start mb-6">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-red-700">There was a problem</h3>
                    <p className="text-red-600 text-sm">{formError}</p>
                  </div>
                </div>
              )}
              
              {/* Information Step */}
              {currentStep === 'information' && (
                <form onSubmit={handleNextStep}>
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Contact Information</h2>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email"
                        type="email" 
                        placeholder="Email" 
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input 
                        id="phone"
                        type="tel" 
                        placeholder="Phone number" 
                      />
                    </div>
                  </div>
                  
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Personal Information</h2>
                  
                  <div className="space-y-4 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName"
                          type="text" 
                          placeholder="First name" 
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName"
                          type="text" 
                          placeholder="Last name" 
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded-md">
                      Continue to Shipping
                    </Button>
                  </div>
                </form>
              )}
              
              {/* Shipping Step */}
              {currentStep === 'shipping' && (
                <form onSubmit={handleNextStep}>
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Shipping Address</h2>
                  
                  <div className="space-y-4 mb-8">
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input 
                        id="address"
                        type="text" 
                        placeholder="Street address" 
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                      <Input 
                        id="apartment"
                        type="text" 
                        placeholder="Apartment, suite, etc." 
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input 
                          id="city"
                          type="text" 
                          placeholder="City" 
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
                        <Input 
                          id="state"
                          type="text" 
                          placeholder="State/Province" 
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="zip">ZIP Code</Label>
                        <Input 
                          id="zip"
                          type="text" 
                          placeholder="ZIP/Postal code" 
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="text-gray-700"
                      onClick={handlePreviousStep}
                    >
                      Return to Information
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded-md">
                      Continue to Payment
                    </Button>
                  </div>
                </form>
              )}
              
              {/* Payment Step */}
              {currentStep === 'payment' && (
                <form onSubmit={handleNextStep}>
                  <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Method</h2>
                  
                  <div className="space-y-4 mb-8">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input 
                        id="cardNumber"
                        type="text" 
                        placeholder="1234 5678 9012 3456" 
                        required
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input 
                          id="expiryDate"
                          type="text" 
                          placeholder="MM / YY" 
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input 
                          id="cvv"
                          type="text" 
                          placeholder="123" 
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="nameOnCard">Name on Card</Label>
                      <Input 
                        id="nameOnCard"
                        type="text" 
                        placeholder="Name on card" 
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      type="button" 
                      variant="ghost" 
                      className="text-gray-700"
                      onClick={handlePreviousStep}
                    >
                      Return to Shipping
                    </Button>
                    <Button type="submit" className="bg-primary hover:bg-red-600 text-white px-6 py-2 rounded-md">
                      Complete Order
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
            
            <div className="mb-6">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                  <div className="flex items-center">
                    <div className="relative">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <span className="absolute -top-2 -right-2 bg-gray-200 text-gray-800 text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {item.quantity}
                      </span>
                    </div>
                    <h3 className="font-medium text-gray-800 text-sm">{item.name}</h3>
                  </div>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({totalItems} items)</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>$5.99</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Tax</span>
                <span>${(totalPrice * 0.08).toFixed(2)}</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${(totalPrice + 5.99 + (totalPrice * 0.08)).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Discount Code</h3>
              <div className="flex">
                <Input 
                  type="text" 
                  placeholder="Enter code" 
                  className="rounded-r-none"
                />
                <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300 rounded-l-none">
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
