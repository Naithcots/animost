"use client";
import LoginForm from "@/components/sign-in/login-form";
import RegisterForm from "@/components/sign-in/register-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { signIn } from "next-auth/react";

const SignInPage = () => {
  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>
          Account authorize you to save your library, rate and review entries.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="login">
          <TabsList className="mb-1">
            <TabsTrigger value="login" className="min-w-[5rem]">
              Log In
            </TabsTrigger>
            <TabsTrigger value="register" className="min-w-[5rem]">
              Register
            </TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <LoginForm />
          </TabsContent>
          <TabsContent value="register">
            <RegisterForm />
          </TabsContent>
        </Tabs>
        <div className="my-4 text-center text-lg font-semibold">
          <span>OR</span>
        </div>
        <div className="grid justify-center">
          <div className="relative rounded-md overflow-hidden group">
            <Button onClick={() => signIn("google", { callbackUrl: "/" })}>
              Sign in with Google
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default SignInPage;
