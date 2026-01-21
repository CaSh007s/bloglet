import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { BookmarkX, Calendar } from "lucide-react";

interface BookmarkItem {
  post_id: string;
  created_at: string;
  posts: {
    id: string;
    title: string;
    slug: string;
    created_at: string;
    content: string | null;
    published: boolean;
    cover_image: string | null;
    profiles: {
      username: string;
      full_name: string | null;
      avatar_url: string | null;
    };
  } | null;
}

export default async function BookmarksPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data } = await supabase
    .from("bookmarks")
    .select(
      `
      post_id, created_at,
      posts (
        id, title, slug, created_at, content, published, cover_image,
        profiles ( username, full_name, avatar_url )
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const bookmarks = (data || []) as unknown as BookmarkItem[];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 min-h-[80vh]">
      <h1 className="text-3xl font-display font-bold mb-8">Your Library</h1>

      {!bookmarks || bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground border border-dashed rounded-xl bg-muted/30">
          <BookmarkX className="w-12 h-12 mb-4 opacity-20" />
          <p className="text-lg font-medium">No bookmarks yet</p>
          <p className="text-sm">Save stories you want to read later.</p>
          <Link href="/" className="mt-6 text-primary hover:underline">
            Explore stories &rarr;
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {bookmarks.map((item) => {
            const post = item.posts;
            if (!post) return null;

            return (
              <Link
                key={item.post_id}
                href={`/${post.profiles.username}/${post.slug}`}
                className="group flex flex-col md:flex-row gap-6 p-6 rounded-xl border border-border/40 bg-card hover:border-primary/50 transition-all duration-300 hover:bg-muted/5"
              >
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <span className="font-medium text-primary/80">
                      @{post.profiles.username}
                    </span>
                    <span>•</span>
                    <span>
                      Saved {formatDistanceToNow(new Date(item.created_at))} ago
                    </span>
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                  </h2>
                  <p className="text-muted-foreground text-sm line-clamp-2 md:line-clamp-3 leading-relaxed">
                    {post.content?.slice(0, 150).replace(/[#*`]/g, "")}...
                  </p>
                </div>

                {post.cover_image && (
                  <div className="w-full md:w-48 h-48 md:h-32 shrink-0 rounded-lg overflow-hidden border border-border/50 order-first md:order-last">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={post.cover_image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
