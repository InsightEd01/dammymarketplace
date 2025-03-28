
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/');
      }
    };
    
    checkUser();
    
    // Check for OAuth redirect
    const handleAuthRedirect = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        toast({
          title: "Authentication error",
          description: error.message || "There was a problem with the login",
          variant: "destructive",
        });
        return;
      }
      
      if (data.session) {
        toast({
          title: "Success",
          description: "You have been logged in successfully!",
        });
        navigate('/');
      }
    };
    
    // If URL has hash params, it might be an OAuth redirect
    if (window.location.hash) {
      handleAuthRedirect();
    }
    
    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/');
        toast({
          title: "Logged in",
          description: "You have been logged in successfully!",
        });
      }
    });
    
    return () => {
      // Clean up auth listener
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [navigate, toast]);
};
