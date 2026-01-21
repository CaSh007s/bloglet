import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Globe, Calendar } from "lucide-react";

interface ProfilePost {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  content: string | null;
  published: boolean;
  cover_image: string | null;
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  // 1. Fetch Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) return notFound();

  // 2. Fetch Posts
  const { data: postsData } = await supabase
    .from("posts")
    .select("id, title, slug, created_at, content, published, cover_image")
    .eq("author_id", profile.id)
    .eq("published", true)
    .order("created_at", { ascending: false });

  const posts = (postsData || []) as ProfilePost[];

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      {/* Profile Header (Unchanged) */}
      <div className="flex flex-col items-center text-center mb-16 border-b border-border/40 pb-12">
        <div className="h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden border-4 border-background ring-2 ring-border mb-6 shadow-sm">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={
              profile.avatar_url ||
              `https://api.dicebear.com/9.x/notionists/svg?seed=${profile.username}`
            }
            alt={profile.username}
            className="h-full w-full object-cover"
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
          {profile.full_name || profile.username}
        </h1>
        <p className="text-muted-foreground text-lg mb-4">
          @{profile.username}
        </p>

        {profile.bio && (
          <p className="max-w-lg text-muted-foreground/80 leading-relaxed mb-6">
            {profile.bio}
          </p>
        )}

        <div className="flex items-center gap-6 text-sm text-muted-foreground">
          {profile.website && (
            <a
              href={profile.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-primary transition-colors"
            >
              <Globe className="w-4 h-4" />
              <span>Website</span>
            </a>
          )}
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>
              Joined {new Date(profile.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Post List - Side by Side Layout */}
      <div className="space-y-8">
        <h2 className="text-2xl font-display font-bold pb-2">Latest Stories</h2>

        {posts.length > 0 ? (
          <div className="grid gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/${username}/${post.slug}`}
                className="group flex flex-col md:flex-row gap-6 p-6 rounded-xl border border-border/40 bg-card hover:border-primary/50 transition-all duration-300 hover:bg-muted/5"
              >
                {/* 1. Text Content (Left Side) */}
                <div className="flex-1 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>
                      {formatDistanceToNow(new Date(post.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>

                  <h3 className="text-xl md:text-2xl font-bold mb-3 group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                  </h3>

                  <p className="text-muted-foreground text-sm line-clamp-2 md:line-clamp-3 leading-relaxed">
                    {post.content?.slice(0, 150).replace(/[#*`]/g, "")}...
                  </p>
                </div>

                {/* 2. Image Thumbnail*/}
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
        ) : (
          <div className="py-12 text-center text-muted-foreground border border-dashed border-border rounded-xl">
            <p>No stories published yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
