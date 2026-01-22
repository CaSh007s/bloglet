"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useState, useEffect } from "react";

export default function LandingPage() {
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);

  const phrases = ["Bloglet.", "Just write."];

  useEffect(() => {
    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1),
      );

      setTypingSpeed(isDeleting ? 80 : 150);

      if (!isDeleting && text === fullText) {
        setTimeout(() => setIsDeleting(true), 1500); // Pause at end
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, phrases]);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors duration-500 selection:bg-primary/20">
      {/* 1. HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative">
        <div className="max-w-4xl mx-auto text-center space-y-10 md:space-y-14">
          {/* The Animated Headline */}
          <h1 className="h-24 md:h-40 text-6xl md:text-9xl font-serif font-medium tracking-tight leading-none text-foreground flex items-center justify-center">
            <span>{text}</span>
            <span className="w-1 md:w-3 h-12 md:h-24 bg-primary ml-1 animate-pulse" />
          </h1>

          {/* The Subtext */}
          <p className="text-lg md:text-xl text-muted-foreground font-light max-w-lg mx-auto leading-relaxed">
            The noise stops here. A digital sanctuary for your thoughts,
            stories, and ideas.
          </p>

          {/* The Action */}
          <div className="pt-6 flex flex-col items-center gap-5">
            <Link href="/login">
              <Button
                size="lg"
                className="h-14 px-10 text-lg rounded-full shadow-xl shadow-primary/10 hover:shadow-primary/20 transition-all hover:scale-105"
              >
                Start Writing <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>

            <Link
              href="https://github.com/CaSh007s/bloglet"
              target="_blank"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors border-b border-transparent hover:border-foreground"
            >
              Open Source on GitHub
            </Link>
          </div>
        </div>
      </main>

      {/* 2. MINIMAL FOOTER */}
      <footer className="py-8 text-center text-xs text-muted-foreground/50 space-x-8 select-none">
        <span>&copy; {new Date().getFullYear()} Bloglet</span>
        <Link
          href="/privacy"
          className="hover:text-foreground transition-colors"
        >
          Privacy
        </Link>
        <Link href="/terms" className="hover:text-foreground transition-colors">
          Terms
        </Link>
      </footer>
    </div>
  );
}
