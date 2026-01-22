import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FileQuestion } from "lucide-react";
import SearchBar from "@/components/search-bar";
import { getExcerpt } from "@/utils/format-content";

interface SearchPost {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  content: string | null;
  published: boolean;
  tags: string[] | null;
  cover_image: string | null;
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
        id, title, slug, created_at, content, published, tags, cover_image,
        profiles ( username, full_name, avatar_url )
      `,
      )
      .eq("published", true)
      // FIX: Only search the Title to prevent noisy matches from the body content
      .ilike("title", `%${query}%`)
      .order("created_at", { ascending: false })
      .limit(20);

    posts = (data || []) as unknown as SearchPost[];
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 min-h-[80vh]">
      <div className="max-w-2xl mx-auto text-center mb-12 space-y-6">
        <h1 className="text-4xl font-display font-bold">Search Stories</h1>
        <SearchBar />
      </div>

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
              className="group flex flex-col md:flex-row gap-6 p-6 rounded-xl border border-border/40 bg-card hover:border-primary/50 transition-all duration-300 hover:bg-muted/5"
            >
              {/* Text Side */}
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <span className="font-medium text-primary/80">
                    @{post.profiles.username}
                  </span>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(post.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                  {post.title}
                </h2>

                <p className="text-muted-foreground text-sm line-clamp-2 md:line-clamp-3 leading-relaxed">
                  {getExcerpt(post.content, 150)}
                </p>
              </div>

              {/* Image Side */}
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
          ))}

          {posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16 text-muted-foreground opacity-50 bg-muted/10 rounded-xl border border-dashed">
              <FileQuestion className="w-12 h-12 mb-4" />
              <p className="text-lg">No matching stories found.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 opacity-30">
          <div className="text-6xl mb-4">🔍</div>
          <p className="font-display text-xl">Type to discover stories...</p>
        </div>
      )}
    </div>
  );
}
