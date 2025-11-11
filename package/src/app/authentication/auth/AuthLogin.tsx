"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AuthLoginProps {
  title?: string;
  subtitle?: React.ReactNode;
  subtext?: React.ReactNode;
}

export function AuthLogin({ title, subtitle, subtext }: AuthLoginProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast({
          title: "Success",
          description: "Logged in successfully",
        });
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to sign in",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {title && (
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
      )}
      {subtext}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>
        <div className="flex items-center justify-between">
          <label className="flex items-center space-x-2 text-sm">
            <input type="checkbox" className="rounded" />
            <span>Remember this device</span>
          </label>
          <a
            href="/authentication/reset"
            className="text-sm text-primary hover:underline"
          >
            Forgot Password?
          </a>
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </Button>
      {subtitle}
    </form>
  );
}
