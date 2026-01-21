import Link from "next/link";
import AuthButton from "./auth-button";
import { ModeToggle } from "./mode-toggle";
import { Button } from "@/components/ui/button";
import { Feather, PenLine, Search } from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <nav className="fixed top-0 z-50 w-full transition-all duration-300">
        <div className="flex h-20 items-center justify-between px-8 max-w-7xl mx-auto">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-display text-2xl font-bold tracking-tighter text-white hover:text-white/80 transition-colors"
          >
            <div className="bg-white/10 p-2 rounded-lg backdrop-blur-md border border-white/10">
              <Feather className="h-5 w-5" />
            </div>
            <span>Bloglet.</span>
          </Link>

          {/* Guest Actions */}
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10 hover:text-white"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button className="rounded-full bg-white text-black hover:bg-gray-200">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-16 items-center justify-between px-8 max-w-7xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2 font-display text-2xl font-bold tracking-tighter transition-all duration-300 hover:text-primary hover:tracking-wide"
        >
          <div className="bg-primary/10 p-2 rounded-lg text-primary">
            <Feather className="h-5 w-5" />
          </div>
          <span>
            Bloglet<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link href="/search">
            <Button
              variant="ghost"
              size="icon"
              className="text-muted-foreground hover:text-foreground"
            >
              <Search className="h-5 w-5" />
            </Button>
          </Link>

          <Link href="/write">
            <Button className="hidden md:flex gap-2 font-semibold shadow-sm rounded-full px-6">
              <PenLine className="h-4 w-4" />
              Write
            </Button>
            <Button size="icon" className="md:hidden rounded-full">
              <PenLine className="h-4 w-4" />
            </Button>
          </Link>

          <div className="h-6 w-px bg-border/50 mx-1" />

          <ModeToggle />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
