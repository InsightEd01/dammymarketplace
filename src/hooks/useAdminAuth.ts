import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { checkUserRole } from "@/lib/services/userService";

export const useAdminAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        setIsLoading(true);

        // Check if user is logged in
        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData.session) {
          // Not logged in, redirect to login
          toast({
            title: "Authentication required",
            description:
              "You must be logged in as an admin to access this page",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        const currentUserId = sessionData.session.user.id;
        setUserId(currentUserId);

        // Check if user has admin role
        const hasAdminRole = await checkUserRole(currentUserId, "admin");

        if (!hasAdminRole) {
          toast({
            title: "Access denied",
            description:
              "You do not have permission to access the admin dashboard",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        // User is an admin
        setIsAdmin(true);
      } catch (error) {
        console.error("Error checking admin status:", error);
        toast({
          title: "Authentication error",
          description: "There was a problem verifying your admin status",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminStatus();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session) {
          // User logged out
          setIsAdmin(false);
          navigate("/login");
        } else {
          // Re-check admin status when auth state changes
          const hasAdminRole = await checkUserRole(session.user.id, "admin");
          setIsAdmin(hasAdminRole);
          if (!hasAdminRole) {
            navigate("/");
          }
        }
      },
    );

    return () => {
      // Clean up auth listener
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate, toast]);

  return { isLoading, isAdmin, userId };
};

export const useCustomerServiceAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isCustomerService, setIsCustomerService] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkCSStatus = async () => {
      try {
        setIsLoading(true);

        // Check if user is logged in
        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData.session) {
          // Not logged in, redirect to login
          toast({
            title: "Authentication required",
            description:
              "You must be logged in as a customer service representative to access this page",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        const currentUserId = sessionData.session.user.id;
        setUserId(currentUserId);

        // Check if user has customer_service role
        const hasCSRole = await checkUserRole(
          currentUserId,
          "customer_service",
        );

        if (!hasCSRole) {
          toast({
            title: "Access denied",
            description:
              "You do not have permission to access the customer service dashboard",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        // User is a customer service rep
        setIsCustomerService(true);
      } catch (error) {
        console.error("Error checking customer service status:", error);
        toast({
          title: "Authentication error",
          description:
            "There was a problem verifying your customer service status",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkCSStatus();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session) {
          // User logged out
          setIsCustomerService(false);
          navigate("/login");
        } else {
          // Re-check customer service status when auth state changes
          const hasCSRole = await checkUserRole(
            session.user.id,
            "customer_service",
          );
          setIsCustomerService(hasCSRole);
          if (!hasCSRole) {
            navigate("/");
          }
        }
      },
    );

    return () => {
      // Clean up auth listener
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate, toast]);

  return { isLoading, isCustomerService, userId };
};

export const useCashierAuth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isCashier, setIsCashier] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkCashierStatus = async () => {
      try {
        setIsLoading(true);

        // Check if user is logged in
        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData.session) {
          // Not logged in, redirect to login
          toast({
            title: "Authentication required",
            description:
              "You must be logged in as a cashier to access this page",
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        const currentUserId = sessionData.session.user.id;
        setUserId(currentUserId);

        // Check if user has cashier role
        const hasCashierRole = await checkUserRole(currentUserId, "cashier");

        if (!hasCashierRole) {
          toast({
            title: "Access denied",
            description:
              "You do not have permission to access the cashier interface",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        // User is a cashier
        setIsCashier(true);
      } catch (error) {
        console.error("Error checking cashier status:", error);
        toast({
          title: "Authentication error",
          description: "There was a problem verifying your cashier status",
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkCashierStatus();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session) {
          // User logged out
          setIsCashier(false);
          navigate("/login");
        } else {
          // Re-check cashier status when auth state changes
          const hasCashierRole = await checkUserRole(
            session.user.id,
            "cashier",
          );
          setIsCashier(hasCashierRole);
          if (!hasCashierRole) {
            navigate("/");
          }
        }
      },
    );

    return () => {
      // Clean up auth listener
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate, toast]);

  return { isLoading, isCashier, userId };
};
