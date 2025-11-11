"use client";

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthLogin } from "../auth/AuthLogin";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent)]" />
      <Card className="relative z-10 w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <Logo />
          </div>
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your CardStacks CRM account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AuthLogin
            subtitle={
              <div className="mt-4 text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/authentication/register" className="text-primary hover:underline">
                  Create an account
                </Link>
              </div>
            }
          />
        </CardContent>
      </Card>
    </div>
  );
}
