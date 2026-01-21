import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { FileQuestion } from "lucide-react";
import SearchBar from "@/components/search-bar";

// Define the shape of a search result
interface SearchPost {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  content: string | null;
  published: boolean;
  tags: string[] | null;
  profiles: {
    username: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  const query = q || "";
  const supabase = await createClient();

  let posts: SearchPost[] = [];

  if (query) {
    const { data } = await supabase
      .from("posts")
      .select(
        `
        id,
        title,
        slug,
        created_at,
        content,
        published,
        tags,
        profiles (
          username,
          full_name,
          avatar_url
        )
      `,
      )
      .eq("published", true)
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
      .order("created_at", { ascending: false })
      .limit(20);

    posts = (data || []) as unknown as SearchPost[];
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 min-h-[80vh]">
      <div className="max-w-2xl mx-auto text-center mb-12 space-y-6">
        <h1 className="text-4xl font-display font-bold">Search Stories</h1>

        {/* The Live Search Bar */}
        <SearchBar />
      </div>

      {/* Results Area */}
      {query ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4 pl-1">
            {posts.length === 0
              ? "No matches found"
              : `Found ${posts.length} result${posts.length === 1 ? "" : "s"}`}
          </h2>

          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/${post.profiles.username}/${post.slug}`}
              className="group block p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={post.profiles.avatar_url || ""} />
                      <AvatarFallback>
                        {post.profiles.username[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-foreground">
                      {post.profiles.full_name || post.profiles.username}
                    </span>
                    <span>•</span>
                    <span>
                      {formatDistanceToNow(new Date(post.created_at))} ago
                    </span>
                  </div>

                  <h2 className="text-xl font-bold group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-muted-foreground line-clamp-2 text-sm leading-relaxed">
                    {post.content?.slice(0, 150).replace(/[#*`]/g, "")}...
                  </p>
                </div>
              </div>
            </Link>
          ))}

          {posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground opacity-50 bg-muted/10 rounded-xl border border-dashed">
              <FileQuestion className="w-12 h-12 mb-4" />
              <p className="text-lg">No matching stories found.</p>
              <p className="text-sm">Try searching for a different keyword.</p>
            </div>
          )}
        </div>
      ) : (
        // Empty State (Before typing)
        <div className="flex flex-col items-center justify-center py-20 opacity-30">
          <div className="text-6xl mb-4">🔍</div>
          <p className="font-display text-xl">Type to discover stories...</p>
        </div>
      )}
    </div>
  );
}
