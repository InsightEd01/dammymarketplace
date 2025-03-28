
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import SocialLoginButton from '@/components/auth/SocialLoginButton';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  
  // Use the auth redirect hook to handle navigation and OAuth
  useAuthRedirect();

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-bold text-3xl text-primary mb-2">Dammy Collectibles</h1>
          <p className="text-gray-600">Exclusive collectibles for enthusiasts</p>
        </div>
        
        <Card className="border-0 shadow-lg rounded-xl">
          <Tabs defaultValue="login" className="w-full">
            <CardHeader>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Register</TabsTrigger>
              </TabsList>
            </CardHeader>
            
            <CardContent>
              <TabsContent value="login">
                <LoginForm 
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                />
              </TabsContent>
              
              <TabsContent value="register">
                <RegisterForm 
                  email={email}
                  setEmail={setEmail}
                  password={password}
                  setPassword={setPassword}
                  fullName={fullName}
                  setFullName={setFullName}
                />
              </TabsContent>
            </CardContent>
            
            <CardFooter className="flex flex-col space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <SocialLoginButton provider="google" label="Google" />
            </CardFooter>
          </Tabs>
        </Card>
        
        <p className="mt-8 text-center text-sm text-gray-500">
          By signing up, you agree to our{" "}
          <a href="#" className="font-medium text-primary hover:underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="font-medium text-primary hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
