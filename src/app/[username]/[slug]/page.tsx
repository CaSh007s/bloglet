import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;
  const supabase = await createClient();

  // 1. Get the Author ID from the username
  const { data: author } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!author) {
    return notFound(); // Show 404 if user doesn't exist
  }

  // 2. Get the Post
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", author.id)
    .eq("slug", slug)
    .eq("published", true)
    .single();

  if (!post) {
    const {
      data: { user: currentUser },
    } = await supabase.auth.getUser();
    if (currentUser?.id === author.id) {
      const { data: draft } = await supabase
        .from("posts")
        .select("*")
        .eq("author_id", author.id)
        .eq("slug", slug)
        .single();

      if (draft) {
        return <RenderPost post={draft} author={author} isDraft={true} />;
      }
    }
    return notFound();
  }

  return <RenderPost post={post} author={author} />;
}

// Helper Component to render the UI
function RenderPost({
  post,
  author,
  isDraft = false,
}: {
  post: any;
  author: any;
  isDraft?: boolean;
}) {
  return (
    <article className="max-w-3xl mx-auto py-12 px-4">
      {isDraft && (
        <div className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 p-4 rounded-lg mb-8 text-center">
          This is a private draft. Only you can see this.
        </div>
      )}

      {/* Header */}
      <header className="mb-10 space-y-6">
        <div className="flex items-center gap-3 text-muted-foreground text-sm">
          <Link
            href={`/${author.username}`}
            className="flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src={author.avatar_url} />
              <AvatarFallback>
                {author.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span>{author.full_name || author.username}</span>
          </Link>
          <span>•</span>
          <time>{new Date(post.created_at).toLocaleDateString()}</time>
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight leading-tight">
          {post.title}
        </h1>
      </header>

      {/* The Content */}
      <div className="prose dark:prose-invert prose-lg max-w-none prose-headings:font-display prose-a:text-primary">
        <ReactMarkdown>{post.content}</ReactMarkdown>
      </div>

      {/* Footer */}
      <hr className="my-12 border-muted" />
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Thanks for reading.</p>
      </div>
    </article>
  );
}
