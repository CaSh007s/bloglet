import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Github, Feather, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white overflow-hidden relative selection:bg-amber-500/30">
      {/* BACKGROUND TEXTURE */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <svg className="w-full h-full">
          <filter id="noise">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="3"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center relative z-10 px-6 pt-20 pb-32">
        {/* Abstract Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-amber-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl animate-pulse delay-1000 pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center space-y-12 animate-in fade-in zoom-in duration-1000">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium text-white/70 cursor-default">
            <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
            The new standard for writers
          </div>

          <h1 className="text-6xl md:text-8xl font-display font-bold tracking-tight leading-[1.1] md:leading-[0.9]">
            Unfold your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-600 relative">
              wildest stories.
              <svg
                className="absolute -bottom-4 left-0 w-full h-4 text-amber-500/50"
                viewBox="0 0 100 10"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 5 Q 50 10 100 5"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                />
              </svg>
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            A minimal, distraction-free space where your thoughts turn into
            timeless content. No clutter. Just you and the page.
          </p>

          {/* CTA Buttons - Fixed Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link href="/login">
              <Button
                size="lg"
                className="h-14 px-8 text-lg rounded-full bg-white text-black hover:bg-gray-200 hover:scale-105 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] border-0"
              >
                Start Writing <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="https://github.com/CaSh007s/bloglet" target="_blank">
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-lg rounded-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:border-white transition-all duration-300"
              >
                <Github className="mr-2 w-5 h-5" />
                Star on GitHub
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-white/80">
            <div className="bg-white/10 p-2 rounded-lg">
              <Feather className="w-5 h-5" />
            </div>
            <span className="font-display font-bold text-xl">Bloglet.</span>
          </div>

          <div className="flex gap-8 text-sm text-white/50">
            <Link href="#" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link
              href="https://github.com/CaSh007s"
              target="_blank"
              className="hover:text-white transition-colors"
            >
              Creator
            </Link>
          </div>

          <div className="text-sm text-white/30">
            © 2026 Bloglet Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
