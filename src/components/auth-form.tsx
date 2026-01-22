"use client";

import { useState } from "react";
import { login, signup } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Github, AlertCircle } from "lucide-react";
import AuthMascot from "./auth-mascot";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";

interface AuthFormProps {
  mode: "login" | "signup";
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(
    null,
  );
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // New Error State

  // 1. Handle Form Submission
  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setError(null); // Clear previous errors

    // Choose the right action
    const action = mode === "login" ? login : signup;

    // Call server action and wait for result
    const errorMessage = await action(formData);

    if (errorMessage) {
      setError(errorMessage);
      setIsLoading(false);
    } else {
    }
  };

  const handleGithubLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col items-center">
        <AuthMascot focusedField={focusedField} showPassword={showPassword} />
        <h2 className="mt-6 text-3xl font-serif font-medium tracking-tight text-center">
          {mode === "login" ? "Welcome back." : "Join Bloglet."}
        </h2>
        <p className="text-muted-foreground text-center mt-2 text-sm">
          {mode === "login"
            ? "Enter your credentials to access your workspace."
            : "Start your minimalist writing journey today."}
        </p>
      </div>

      {/* Pass the wrapper function to the form action */}
      <form action={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="writer@example.com"
            required
            className="h-12 bg-background/50 border-border/50 focus:border-primary/50 transition-all"
            onFocus={() => setFocusedField("email")}
            onBlur={() => setFocusedField(null)}
          />
        </div>

        <div className="space-y-2 relative">
          <div className="flex justify-between items-center">
            <Label htmlFor="password">Password</Label>
            {mode === "login" && (
              <Link
                href="#"
                className="text-xs text-muted-foreground hover:text-primary"
              >
                Forgot?
              </Link>
            )}
          </div>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="h-12 pr-10 bg-background/50 border-border/50 focus:border-primary/50 transition-all"
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* ERROR DISPLAY */}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-500 bg-red-500/10 p-3 rounded-lg border border-red-500/20 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button
          className="w-full h-12 text-base rounded-full font-medium"
          type="submit"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "login" ? "Sign In" : "Create Account"}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/40"></span>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          type="button"
          className="w-full h-12 rounded-full border-border/50 hover:bg-muted/50"
          onClick={handleGithubLogin}
        >
          <Github className="mr-2 h-5 w-5" />
          GitHub
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        {mode === "login" ? (
          <>
            Don&apos;t have an account?{" "}
            <Link
              href="/signup"
              className="text-primary hover:underline font-medium"
            >
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-primary hover:underline font-medium"
            >
              Log in
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
