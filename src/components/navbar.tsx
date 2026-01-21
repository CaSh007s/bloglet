import Link from "next/link";
import AuthButton from "./auth-button";
import { ModeToggle } from "./mode-toggle";
import { Button } from "@/components/ui/button";
import { Feather, PenLine } from "lucide-react";

export default function Navbar() {
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
          {/* Write Button */}
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
