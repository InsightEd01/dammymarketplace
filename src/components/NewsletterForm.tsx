import React, { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface NewsletterFormProps {
  className?: string;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ className = "" }) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Check if email already exists
      const { data: existingSubscribers, error: checkError } = await supabase
        .from("newsletter_subscribers")
        .select("id")
        .eq("email", email.toLowerCase())
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingSubscribers) {
        toast({
          title: "Already subscribed",
          description: "This email is already subscribed to our newsletter",
        });
        setLoading(false);
        return;
      }

      // Add new subscriber
      const { error: insertError } = await supabase
        .from("newsletter_subscribers")
        .insert([
          {
            email: email.toLowerCase(),
            subscribed_at: new Date().toISOString(),
          },
        ]);

      if (insertError) throw insertError;

      toast({
        title: "Subscription successful",
        description: "Thank you for subscribing to our newsletter!",
      });

      setEmail("");
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      toast({
        title: "Subscription failed",
        description:
          "There was an error subscribing to the newsletter. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`flex flex-col sm:flex-row gap-2 ${className}`}
    >
      <Input
        type="email"
        placeholder="Your email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-grow px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-800 dark:border-gray-700"
        disabled={loading}
      />
      <Button
        type="submit"
        className="bg-primary hover:bg-red-700 text-white dark:bg-primary dark:hover:bg-red-700"
        disabled={loading}
      >
        {loading ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  );
};

export default NewsletterForm;
