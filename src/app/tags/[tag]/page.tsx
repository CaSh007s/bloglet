import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Hash } from "lucide-react";

interface TaggedPost {
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

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const supabase = await createClient();

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
    .contains("tags", [decodedTag])
    .order("created_at", { ascending: false });

  const posts = (data || []) as unknown as TaggedPost[];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 min-h-[80vh]">
      <div className="flex items-center gap-4 mb-8">
        <div className="p-4 bg-primary/10 rounded-full text-primary">
          <Hash className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-4xl font-display font-bold capitalize">
            {decodedTag}
          </h1>
          <p className="text-muted-foreground">
            {posts.length} {posts.length === 1 ? "story" : "stories"} about this
            topic
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/${post.profiles.username}/${post.slug}`}
            className="group block p-6 rounded-xl border border-border/50 bg-card hover:border-primary/50 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                  <Avatar className="h-5 w-5">
                    <AvatarImage src={post.profiles.avatar_url || ""} />
                    <AvatarFallback>{post.profiles.username[0]}</AvatarFallback>
                  </Avatar>
                  <span>
                    {post.profiles.full_name || post.profiles.username}
                  </span>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(post.created_at))} ago
                  </span>
                </div>

                <h2 className="text-2xl font-bold group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-muted-foreground line-clamp-2 text-sm">
                  {post.content?.slice(0, 150).replace(/[#*`]/g, "")}...
                </p>

                <div className="flex gap-2 mt-4">
                  {post.tags?.map((t) => (
                    <span
                      key={t}
                      className={`text-xs px-2 py-0.5 rounded bg-muted ${t === decodedTag ? "text-primary font-bold" : "text-muted-foreground"}`}
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Link>
        ))}

        {posts.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <p>
              No stories found for <strong>#{decodedTag}</strong> yet.
            </p>
            <Link
              href="/write"
              className="text-primary hover:underline mt-2 block"
            >
              Write the first one!
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
