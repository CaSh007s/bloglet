import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookmarkX } from "lucide-react"; // Changed icon

// Define the shape of our data
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
    profiles: {
      username: string;
      full_name: string | null;
      avatar_url: string | null;
    };
  } | null;
}

export default async function BookmarksPage() {
  const supabase = await createClient();

  // 1. Check Auth
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Fetch Bookmarked Posts
  const { data } = await supabase
    .from("bookmarks")
    .select(
      `
      post_id,
      created_at,
      posts (
        id,
        title,
        slug,
        created_at,
        content,
        published,
        profiles (
          username,
          full_name,
          avatar_url
        )
      )
    `,
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  // Cast data safely
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
            if (!post) return null; // Handle if post was deleted

            return (
              <Link
                key={item.post_id}
                href={`/${post.profiles.username}/${post.slug}`}
                className="group block p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src={post.profiles.avatar_url || ""} />
                        <AvatarFallback>
                          {post.profiles.username[0]}
                        </AvatarFallback>
                      </Avatar>
                      <span>
                        {post.profiles.full_name || post.profiles.username}
                      </span>
                      <span>•</span>
                      <span>
                        Saved {formatDistanceToNow(new Date(item.created_at))}{" "}
                        ago
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
                      {post.title}
                    </h2>
                    <p className="text-muted-foreground line-clamp-2 text-sm">
                      {post.content?.slice(0, 150).replace(/[#*`]/g, "")}...
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
