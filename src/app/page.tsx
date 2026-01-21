import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { calculateReadTime } from "@/utils/read-time";
import { Clock } from "lucide-react";

export const revalidate = 0;

interface FeedPost {
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

export default async function Home() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("posts")
    .select(
      `
      id, title, slug, created_at, content, published, tags, cover_image,
      profiles ( username, full_name, avatar_url )
    `,
    )
    .eq("published", true)
    .order("created_at", { ascending: false });

  const posts = (data || []) as unknown as FeedPost[];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-4xl font-display font-bold mb-12">Latest Stories</h1>

      <div className="grid gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/${post.profiles.username}/${post.slug}`}
            className="group flex flex-col md:flex-row gap-6 p-6 rounded-xl border border-border/40 bg-card hover:border-primary/50 transition-all duration-300 hover:bg-muted/5"
          >
            {/* 1. Text Content */}
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Avatar className="h-5 w-5 border border-border">
                  <AvatarImage src={post.profiles.avatar_url || ""} />
                  <AvatarFallback>{post.profiles.username[0]}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-foreground">
                  {post.profiles.full_name || post.profiles.username}
                </span>
                <span>•</span>
                <span>
                  {formatDistanceToNow(new Date(post.created_at), {
                    addSuffix: true,
                  })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {calculateReadTime(post.content)}
                </span>
              </div>

              <h2 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                {post.title}
              </h2>

              <p className="text-muted-foreground text-sm line-clamp-2 md:line-clamp-3 leading-relaxed mb-4">
                {post.content?.slice(0, 200).replace(/[#*`]/g, "")}...
              </p>

              {/* Tags (Only show if there's space, or keep them small) */}
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-2">
                  {post.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground uppercase tracking-wide opacity-80"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Thumbnail (Right Side) */}
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
      </div>
    </div>
  );
}
