import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PenSquare, Eye, Trash2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
  const supabase = await createClient();

  // 1. Verify User
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // 2. Fetch User's Posts
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="max-w-5xl mx-auto py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your stories and analytics.
          </p>
        </div>
        <Link href="/write">
          <Button>New Post</Button>
        </Link>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-6">
        {posts?.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed rounded-lg opacity-50">
            <p className="text-xl font-medium">No posts yet</p>
            <p className="text-sm">Write your first masterpiece today.</p>
          </div>
        ) : (
          posts?.map((post) => (
            <Card
              key={post.id}
              className="flex flex-row items-center justify-between p-6"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">
                    {post.title || "Untitled"}
                  </h3>
                  <Badge variant={post.published ? "default" : "secondary"}>
                    {post.published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground font-mono">
                  <span>/{post.slug}</span>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(new Date(post.updated_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Edit Button */}
                <Link href={`/write?slug=${post.slug}`}>
                  <Button variant="ghost" size="icon">
                    <PenSquare className="h-4 w-4" />
                  </Button>
                </Link>

                {/* View Button */}
                <Button variant="ghost" size="icon" disabled={!post.published}>
                  <Eye className="h-4 w-4" />
                </Button>

                {/* Delete Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
