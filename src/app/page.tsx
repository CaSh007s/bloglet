import Link from "next/link";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

// 1. Define the shape of our data
interface PostWithAuthor {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  profiles: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: posts } = await supabase
    .from("posts")
    .select(
      `
      *,
      profiles (
        username,
        full_name,
        avatar_url
      )
    `,
    )
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(6);

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center py-24 text-center space-y-6 bg-background">
        <h1 className="text-6xl font-display font-bold tracking-tighter">
          Write without noise.
        </h1>
        <p className="text-xl text-muted-foreground max-w-[600px] leading-relaxed">
          Bloglet is a minimalist publishing platform for developers. Markdown
          support, distraction-free reading, and owning your data.
        </p>

        <div className="flex items-center gap-4 pt-4">
          <Link href={user ? "/write" : "/login"}>
            <Button size="lg" className="h-12 px-8 text-base">
              {user ? "Start Writing" : "Get Started"}
            </Button>
          </Link>
        </div>
      </section>

      {/* Global Feed Section */}
      <section className="max-w-5xl mx-auto w-full px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-display font-bold">Freshly Published</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!posts || posts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground border-2 border-dashed rounded-lg">
              No stories have been published yet. Be the first!
            </div>
          ) : (
            posts.map((post: PostWithAuthor) => (
              <Link
                key={post.id}
                href={`/${post.profiles.username}/${post.slug}`}
              >
                <Card className="h-full hover:bg-muted/50 transition-colors border-none shadow-none ring-1 ring-border flex flex-col">
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={post.profiles.avatar_url || ""} />
                        <AvatarFallback>
                          {post.profiles.username[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground font-medium">
                        {post.profiles.full_name || post.profiles.username}
                      </span>
                    </div>
                    <CardTitle className="font-display text-xl leading-tight">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col justify-end">
                    <div className="flex items-center justify-between text-xs text-muted-foreground mt-4">
                      <span>
                        {formatDistanceToNow(new Date(post.created_at), {
                          addSuffix: true,
                        })}
                      </span>
                      <span>Read article →</span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
