import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <h1 className="text-6xl font-display font-bold tracking-tighter">
        Write without noise.
      </h1>
      <p className="text-xl text-muted-foreground max-w-[600px] leading-relaxed">
        Bloglet is a minimalist publishing platform for developers. Markdown
        support, distraction-free reading, and owning your data.
      </p>

      <div className="flex items-center gap-4 pt-4">
        <Link href="/write">
          <Button size="lg" className="h-12 px-8 text-base">
            Start Writing
          </Button>
        </Link>
        <Button variant="outline" size="lg" className="h-12 px-8 text-base">
          Read Trending
        </Button>
      </div>
    </div>
  );
}
