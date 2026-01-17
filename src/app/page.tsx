import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
        {user ? (
          // OPTION A: User is Logged In -> Show "Start Writing"
          <Link href="/write">
            <Button size="lg" className="h-12 px-8 text-base">
              Start Writing
            </Button>
          </Link>
        ) : (
          <Link href="/login">
            <Button
              variant="secondary"
              size="lg"
              className="h-12 px-8 text-base"
            >
              Get Started
            </Button>
          </Link>
        )}

        <Button variant="outline" size="lg" className="h-12 px-8 text-base">
          Read Trending
        </Button>
      </div>
    </div>
  );
}
