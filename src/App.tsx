import React from "react"; // Explicit React import
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useRoutes,
} from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import MainLayout from "@/layout/MainLayout";
import AdminLayout from "@/layout/AdminLayout";
import CustomerServiceLayout from "@/layout/CustomerServiceLayout";
import CashierLayout from "@/layout/CashierLayout";
import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import ProductDetailPage from "@/pages/ProductDetailPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import AuthPage from "@/pages/AuthPage";
import UserProfilePage from "@/pages/UserProfilePage";
import MyOrdersPage from "@/pages/MyOrdersPage";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminProducts from "@/pages/AdminProducts";
import CustomerServiceDashboard from "@/pages/CustomerServiceDashboard";
import CashierDashboard from "@/pages/CashierDashboard";
import NotFound from "@/pages/NotFound";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Import Tempo routes
// @ts-ignore - This will be available at runtime when VITE_TEMPO is true
import routes from "tempo-routes";

// Create a new QueryClient instance outside of the component
const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    // Check current auth status
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setIsAuthenticated(!!data.session);
    };

    checkAuth();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
      },
    );

    return () => {
      // Clean up auth listener
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, []);

  // Create a protected route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (isAuthenticated === null) {
      // Still loading auth state
      return (
        <div className="min-h-screen flex items-center justify-center">
          <svg
            className="animate-spin h-8 w-8 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      );
    }

    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="dammy-theme">
        <CartProvider>
          <TooltipProvider>
            <BrowserRouter>
              <Routes>
                {/* Tempo routes - only included in development with VITE_TEMPO=true */}
                {import.meta.env.VITE_TEMPO &&
                  routes.map((route, index) => (
                    <Route
                      key={`tempo-route-${index}`}
                      path={route.path}
                      element={route.element}
                    />
                  ))}
                <Route path="/login" element={<AuthPage />} />

                <Route element={<MainLayout />}>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route
                    path="/checkout"
                    element={
                      <ProtectedRoute>
                        <CheckoutPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <UserProfilePage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/orders"
                    element={
                      <ProtectedRoute>
                        <MyOrdersPage />
                      </ProtectedRoute>
                    }
                  />
                </Route>

                {/* Add this before the catchall route to allow Tempo to capture its routes */}
                {import.meta.env.VITE_TEMPO && <Route path="/tempobook/*" />}

                {/* Admin Routes */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute>
                      <AdminLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<AdminDashboard />} />
                  <Route path="products" element={<AdminProducts />} />
                  <Route path="products/:id" element={<AdminProducts />} />
                  <Route path="products/new" element={<AdminProducts />} />
                  <Route path="orders" element={<div>Orders Management</div>} />
                  <Route path="orders/:id" element={<div>Order Details</div>} />
                  <Route
                    path="customers"
                    element={<div>Customers Management</div>}
                  />
                  <Route path="chats" element={<div>Admin Chats</div>} />
                  <Route
                    path="analytics"
                    element={<div>Analytics Dashboard</div>}
                  />
                  <Route path="settings" element={<div>Admin Settings</div>} />
                </Route>

                {/* Customer Service Routes */}
                <Route
                  path="/customer-service"
                  element={
                    <ProtectedRoute>
                      <CustomerServiceLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<CustomerServiceDashboard />} />
                  <Route
                    path="chats"
                    element={<div>Customer Service Chats</div>}
                  />
                  <Route path="orders" element={<div>Order Support</div>} />
                  <Route path="orders/:id" element={<div>Order Details</div>} />
                  <Route
                    path="customers"
                    element={<div>Customer Management</div>}
                  />
                  <Route path="support" element={<div>Support Tools</div>} />
                </Route>

                {/* Cashier Routes */}
                <Route
                  path="/cashier"
                  element={
                    <ProtectedRoute>
                      <CashierLayout />
                    </ProtectedRoute>
                  }
                >
                  <Route index element={<CashierDashboard />} />
                  <Route
                    path="checkout"
                    element={<div>Checkout Interface</div>}
                  />
                  <Route path="orders" element={<div>Cashier Orders</div>} />
                  <Route path="orders/:id" element={<div>Order Receipt</div>} />
                  <Route
                    path="customers"
                    element={<div>Customer Lookup</div>}
                  />
                  <Route path="search" element={<div>Product Search</div>} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
