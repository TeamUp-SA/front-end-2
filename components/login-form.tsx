"use client";

import type React from "react";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Users } from "lucide-react";
import { getGoogleAuthUrl, login } from "@/api/auth";
import { getMembers } from "@/api/member";
import type { Member } from "@/types/member";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam) {
      setError(
        errorParam === "oauth"
          ? "Google sign-in was cancelled or failed. Please try again."
          : errorParam
      );
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const normalizedEmail = email.trim().toLowerCase();
      await login({ email: normalizedEmail, password });
      if (typeof window !== "undefined") {
        localStorage.setItem("currentUserEmail", normalizedEmail);
        localStorage.removeItem("currentMemberID");

        try {
          const response = await getMembers();
          const members =
            response?.data ??
            response?.data?.data ??
            (Array.isArray(response) ? response : []);

          if (Array.isArray(members)) {
            const match = (members as Member[]).find(
              (member) =>
                member?.email?.toLowerCase() === normalizedEmail.toLowerCase()
            );
            if (match?.memberID) {
              localStorage.setItem("currentMemberID", match.memberID);
            }
          } else if (Array.isArray((members as { data?: Member[] })?.data)) {
            const match = (members.data as Member[]).find(
              (member) =>
                member?.email?.toLowerCase() === normalizedEmail.toLowerCase()
            );
            if (match?.memberID) {
              localStorage.setItem("currentMemberID", match.memberID);
            }
          }
        } catch (fetchErr) {
          console.error("Failed to prefetch member profile", fetchErr);
        }
      }
      router.push("/");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? "Unable to sign in. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = () => {
    setError(null);
    const url = getGoogleAuthUrl();
    window.location.assign(url);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-4">
        <div className="flex items-center justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
            <Users className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
        <div className="space-y-2 text-center">
          <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full">
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>
        <div className="my-4">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>
          <Button
            type="button"
            variant="outline"
            className="mt-4 w-full"
            onClick={handleGoogleLogin}
            disabled={isSubmitting}
          >
            Continue with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="text-primary hover:underline font-medium"
          >
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
