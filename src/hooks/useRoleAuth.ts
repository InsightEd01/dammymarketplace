
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { checkUserRole } from "@/lib/services/userService";

type RoleAuthProps = {
  role: string;
  redirectPath: string;
  roleName: string;
};

export const useRoleAuth = ({ role, redirectPath, roleName }: RoleAuthProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [hasRole, setHasRole] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkRoleStatus = async () => {
      try {
        setIsLoading(true);

        // Check if user is logged in
        const { data: sessionData } = await supabase.auth.getSession();

        if (!sessionData.session) {
          // Not logged in, redirect to login
          toast({
            title: "Authentication required",
            description: `You must be logged in as ${roleName} to access this page`,
            variant: "destructive",
          });
          navigate("/login");
          return;
        }

        const currentUserId = sessionData.session.user.id;
        setUserId(currentUserId);

        // Check if user has required role
        const hasRequiredRole = await checkUserRole(currentUserId, role);

        if (!hasRequiredRole) {
          toast({
            title: "Access denied",
            description: `You do not have permission to access the ${roleName} dashboard`,
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        // User has the required role
        setHasRole(true);
      } catch (error) {
        console.error(`Error checking ${roleName} status:`, error);
        toast({
          title: "Authentication error",
          description: `There was a problem verifying your ${roleName} status`,
          variant: "destructive",
        });
        navigate("/");
      } finally {
        setIsLoading(false);
      }
    };

    checkRoleStatus();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!session) {
          // User logged out
          setHasRole(false);
          navigate("/login");
        } else {
          // Re-check role status when auth state changes
          const hasRequiredRole = await checkUserRole(session.user.id, role);
          setHasRole(hasRequiredRole);
          if (!hasRequiredRole) {
            navigate(redirectPath);
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
  }, [navigate, toast, role, redirectPath, roleName]);

  return { isLoading, hasRole, userId };
};
