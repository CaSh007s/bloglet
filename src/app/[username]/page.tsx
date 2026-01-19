import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import { CalendarDays } from "lucide-react";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!profile) return notFound();

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", profile.id)
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="flex flex-col items-center text-center space-y-4 mb-12">
        <Avatar className="h-24 w-24 border-4 border-background shadow-xl">
          <AvatarImage src={profile.avatar_url} />
          <AvatarFallback className="text-2xl">
            {profile.username[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-2">
          <h1 className="text-3xl font-display font-bold">
            {profile.full_name || profile.username}
          </h1>
          <p className="text-muted-foreground text-lg">@{profile.username}</p>
          {profile.bio && <p className="max-w-md mx-auto">{profile.bio}</p>}
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-display font-bold border-b pb-2">
          Latest Stories
        </h2>

        {!posts || posts.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            This author hasn&apos;t published anything yet.
          </div>
        ) : (
          posts.map((post) => (
            <Link key={post.id} href={`/${username}/${post.slug}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer border-none shadow-none ring-1 ring-border">
                <CardHeader>
                  <CardTitle className="font-display text-xl">
                    {post.title}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <CalendarDays className="h-4 w-4" />
                    <span>
                      {formatDistanceToNow(new Date(post.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground line-clamp-2">
                    {post.content?.replace(/[#*`_]/g, "").slice(0, 150)}...
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
