import Link from "next/link";
import AuthButton from "./auth-button";
import { ModeToggle } from "./mode-toggle";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full">
      <div className="flex h-16 items-center justify-between px-8 max-w-6xl mx-auto">
        {/* Brand Logo */}
        <Link
          href="/"
          className="font-display text-2xl font-bold tracking-tighter hover:text-primary transition-colors duration-300 hover:tracking-wide"
        >
          Bloglet<span className="text-primary">.</span>
        </Link>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          <Link href="/write">
            <Button variant="ghost">Write</Button>
          </Link>
          <ModeToggle />
          <AuthButton />
        </div>
      </div>
    </nav>
  );
}
