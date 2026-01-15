import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default async function WritePage() {
  const supabase = await createClient();

  // 1. Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 2. If not, kick them back to home
  if (!user) {
    redirect("/");
  }

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold">New Post</h1>
        <div className="flex gap-2">
          <Button variant="outline">Save Draft</Button>
          <Button>Publish</Button>
        </div>
      </div>

      <form className="space-y-6">
        {/* Title Section */}
        <div className="space-y-2">
          <Label htmlFor="title">Article Title</Label>
          <Input
            id="title"
            placeholder="How to build a blog with Next.js..."
            className="text-lg font-medium p-6"
          />
        </div>

        {/* Slug Section (Auto-generated usually, but manual for now) */}
        <div className="space-y-2">
          <Label htmlFor="slug">URL Slug</Label>
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground text-sm">
              bloglet.dev/{user.user_metadata.username || "user"}/
            </span>
            <Input
              id="slug"
              placeholder="how-to-build-blog"
              className="font-mono text-sm"
            />
          </div>
        </div>

        {/* Content Section */}
        <div className="space-y-2">
          <Label htmlFor="content">Content (Markdown)</Label>
          <Textarea
            id="content"
            placeholder="Start writing your masterpiece..."
            className="min-h-[400px] font-mono text-base leading-relaxed p-6"
          />
        </div>
      </form>
    </div>
  );
}
