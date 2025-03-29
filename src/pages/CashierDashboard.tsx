import React, { useState, useEffect } from "react";
import { useCashierAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const CashierDashboard = () => {
  const { isLoading, isCashier, userId } = useCashierAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [customerDetails, setCustomerDetails] = useState<any>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .limit(100);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (isCashier && !isLoading) {
      fetchProducts();
    }
  }, [isCashier, isLoading]);

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      setCart(
        cart.map((item) =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } else {
      removeFromCart(productId);
    }
  };

  const clearCart = () => {
    setCart([]);
  };

  const handleSelectCustomer = (customer: any) => {
    setSelectedCustomer(customer.id);
    setCustomerDetails(customer);
  };

  const reset = () => {
    clearCart();
    setSelectedCustomer(null);
    setCustomerDetails(null);
  };

  if (isLoading) {
    return <div className="text-center">Loading...</div>;
  }

  if (!isCashier) {
    return <div className="text-center">Not authorized</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Product List */}
      <div className="w-1/2 p-4">
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        <ScrollArea className="h-[calc(100vh-100px)]">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product) => (
              <Card key={product.id} className="cursor-pointer hover:shadow-md transition-shadow duration-300">
                <CardHeader>
                  <CardTitle>{product.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-2">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-md mb-2"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">${product.price.toFixed(2)}</p>
                  <Button className="w-full mt-2" onClick={() => addToCart(product)}>Add to Cart</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Checkout Area */}
      <div className="w-1/2 p-4 border-l dark:border-gray-700">
        <h2 className="text-2xl font-semibold mb-4">Checkout</h2>

        {/* Customer Search */}
        <CustomerSearch onSelectCustomer={handleSelectCustomer} />
        {customerDetails && (
          <div className="mb-4 p-2 rounded-md bg-gray-50 dark:bg-gray-800">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={`https://avatar.vercel.sh/${customerDetails.full_name}.png`} />
                <AvatarFallback>{customerDetails.full_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium leading-none">{customerDetails.full_name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{customerDetails.email}</p>
                <Badge variant="secondary">Customer</Badge>
              </div>
            </div>
          </div>
        )}

        <Separator className="my-2" />

        {/* Cart Items */}
        <ScrollArea className="h-[calc(100vh-350px)] mb-4">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400">Cart is empty</p>
          ) : (
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 rounded-md bg-gray-50 dark:bg-gray-800">
                  <div className="flex items-center space-x-2">
                    <img src={item.imageUrl} alt={item.name} className="w-10 h-10 object-cover rounded-md" />
                    <div>
                      <p className="text-sm font-semibold">{item.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button size="icon" onClick={() => updateQuantity(item.id, item.quantity - 1)}>-</Button>
                    <Input
                      type="number"
                      className="w-16 text-center"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
                    />
                    <Button size="icon" onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <Separator className="my-2" />

        {/* Cart Total */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Total:</h3>
          <span className="text-xl">${cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0).toFixed(2)}</span>
        </div>

        {/* Checkout Button */}
        <Checkout
          cart={cart}
          customerId={selectedCustomer}
          customerDetails={customerDetails}
          reset={reset}
        />
      </div>
    </div>
  );
};

// Customer Search Component
const CustomerSearch = ({ onSelectCustomer }: { onSelectCustomer: (customer: any) => void }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const searchCustomers = async () => {
      if (!searchTerm || searchTerm.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("customer_profiles")
          .select("id, full_name, email, phone, address")
          .or(`full_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%`)
          .limit(5);

        if (error) throw error;
        
        setResults(data || []);
      } catch (error) {
        console.error("Error searching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(searchCustomers, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  return (
    <div className="mb-4">
      <Input
        type="text"
        placeholder="Search for customer..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {loading && <p>Loading customers...</p>}
      {results.length > 0 && (
        <ul className="mt-2 space-y-1">
          {results.map((customer) => (
            <li
              key={customer.id}
              className="p-2 rounded-md bg-gray-50 dark:bg-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => onSelectCustomer(customer)}
            >
              {customer.full_name} ({customer.email})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Update the Checkout process with proper types and decrement_stock function
const Checkout = ({ cart, customerId, customerDetails, reset }: any) => {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  
  const handleCheckout = async () => {
    if (!customerId || cart.length === 0) return;
    
    setIsProcessing(true);
    
    try {
      // Create an order
      const totalAmount = cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
      
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: customerId,
          status: 'pending',
          total_amount: totalAmount,
          shipping_address: customerDetails?.address || '',
          payment_method: 'cash', // Default for cashier interface
        })
        .select()
        .single();
      
      if (orderError) throw orderError;
      
      // Insert order items with correct field naming
      const orderItems = cart.map((item: any) => ({
        order_id: orderData.id,
        product_id: item.id,
        quantity: item.quantity,
        price: item.price, // Use price instead of unit_price
        product_name: item.name,
        product_image: item.imageUrl
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // Update stock quantities
      for (const item of cart) {
        // Use database function to decrement stock safely
        const { error: stockError } = await supabase.rpc(
          'decrement_stock', 
          { 
            product_id: item.id,
            quantity: item.quantity
          }
        );
        
        if (stockError) {
          console.error(`Error updating stock for product ${item.id}:`, stockError);
          // Continue processing other items
        }
      }
      
      setOrderId(orderData.id);
      toast({
        title: "Order completed!",
        description: `Order #${orderData.id.substring(0, 8)} has been created.`,
      });
    } catch (error: any) {
      console.error("Checkout error:", error);
      toast({
        title: "Checkout failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <Button
        className="w-full"
        onClick={handleCheckout}
        disabled={!customerId || cart.length === 0 || isProcessing}
      >
        {isProcessing ? "Processing..." : "Complete Checkout"}
      </Button>
      {orderId && (
        <p className="mt-2 text-green-500">
          Order <span className="font-semibold">#{orderId.substring(0, 8)}</span> completed!
        </p>
      )}
      <Button variant="ghost" className="w-full mt-2" onClick={reset}>
        Start New Order
      </Button>
    </div>
  );
};

export default CashierDashboard;
