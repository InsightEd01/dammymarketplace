import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, MapPin, Shield, LogOut } from "lucide-react";

const UserProfilePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        setLoading(true);
        const { data: userData } = await supabase.auth.getUser();

        if (!userData.user) {
          navigate("/login");
          return;
        }

        setUser(userData.user);

        // Fetch user profile from customer_profiles table
        const { data: profileData, error } = await supabase
          .from("customer_profiles")
          .select("*")
          .eq("id", userData.user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          console.error("Error fetching profile:", error);
          toast({
            title: "Error",
            description: "Failed to load profile data",
            variant: "destructive",
          });
        }

        if (profileData) {
          setProfile(profileData);
          setFormData({
            full_name:
              profileData.full_name ||
              userData.user.user_metadata?.full_name ||
              "",
            email: userData.user.email || "",
            phone: profileData.phone || "",
            address: profileData.address || "",
          });
        } else {
          // If no profile exists, initialize with auth data
          setFormData({
            full_name: userData.user.user_metadata?.full_name || "",
            email: userData.user.email || "",
            phone: "",
            address: "",
          });
        }
      } catch (error) {
        console.error("Error:", error);
        toast({
          title: "Error",
          description: "Something went wrong",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      setUpdating(true);

      if (!user) return;

      // Update auth metadata
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { full_name: formData.full_name },
      });

      if (metadataError) throw metadataError;

      // Update or insert profile in customer_profiles
      const { error: profileError } = await supabase
        .from("customer_profiles")
        .upsert({
          id: user.id,
          full_name: formData.full_name,
          phone: formData.phone,
          address: formData.address,
          updated_at: new Date().toISOString(),
        });

      if (profileError) throw profileError;

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });

      // Refresh profile data
      const { data: updatedProfile } = await supabase
        .from("customer_profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (updatedProfile) {
        setProfile(updatedProfile);
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        toast({
          title: "Error signing out",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully",
        });
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Error signing out:", error);
      toast({
        title: "Error",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
                <AvatarFallback className="text-2xl bg-primary text-white">
                  {formData.full_name
                    ? formData.full_name.charAt(0).toUpperCase()
                    : "U"}
                </AvatarFallback>
              </Avatar>
              <CardTitle>{formData.full_name || "User"}</CardTitle>
              <CardDescription>{formData.email}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{formData.email}</span>
              </div>
              {formData.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formData.phone}</span>
                </div>
              )}
              {formData.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formData.address}</span>
                </div>
              )}
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="md:w-2/3">
          <Tabs defaultValue="profile">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your personal details here.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="full_name">Full Name</Label>
                      <Input
                        id="full_name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        value={formData.email}
                        disabled
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleUpdateProfile}
                    disabled={updating}
                    className="ml-auto"
                  >
                    {updating ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>

            <TabsContent value="security" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>
                    Manage your account security settings.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">Password</h4>
                        <p className="text-sm text-muted-foreground">
                          Change your password
                        </p>
                      </div>
                      <Button variant="outline">Change Password</Button>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <h4 className="font-medium">
                          Two-Factor Authentication
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security
                        </p>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
