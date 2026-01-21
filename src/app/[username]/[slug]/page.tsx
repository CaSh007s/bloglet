import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import LikeButton from "@/components/like-button";
import CommentSection from "@/components/comment-section";
import DeletePostButton from "@/components/delete-post-button";
import { calculateReadTime } from "@/utils/read-time";
import rehypeHighlight from "rehype-highlight";
import { Clock } from "lucide-react";
import BookmarkButton from "@/components/bookmark-button";

interface Post {
  id: string;
  title: string;
  content: string | null;
  created_at: string;
  slug: string;
  published: boolean;
  author_id: string;
  tags: string[] | null;
}

interface Author {
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;
  const supabase = await createClient();

  const { data: author } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (!author) return notFound();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();
  const isOwner = currentUser?.id === author.id;

  const query = supabase
    .from("posts")
    .select("*")
    .eq("author_id", author.id)
    .eq("slug", slug)
    .single();

  const { data: post } = await query;

  if (!post) return notFound();
  if (!post.published && !isOwner) return notFound();

  const { count: likeCount } = await supabase
    .from("likes")
    .select("*", { count: "exact", head: true })
    .eq("post_id", post.id);

  return (
    <RenderPost
      post={post}
      author={author}
      likeCount={likeCount || 0}
      isOwner={isOwner}
    />
  );
}

function RenderPost({
  post,
  author,
  likeCount = 0,
  isOwner = false,
}: {
  post: Post;
  author: Author;
  likeCount?: number;
  isOwner?: boolean;
}) {
  const readTime = calculateReadTime(post.content);

  return (
    <article className="max-w-3xl mx-auto py-12 px-4">
      {/* Draft Banner */}
      {!post.published && (
        <div className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 p-4 rounded-lg mb-8 text-center">
          This is a private draft. Only you can see this.
        </div>
      )}

      {/* Header */}
      <header className="mb-10 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-muted-foreground text-sm flex-wrap">
            <Link
              href={`/${author.username}`}
              className="flex items-center gap-2 hover:text-foreground transition-colors"
            >
              <Avatar className="h-8 w-8 border border-border">
                <AvatarImage src={author.avatar_url || ""} />
                <AvatarFallback>
                  {author.username[0].toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-medium text-foreground">
                {author.full_name || author.username}
              </span>
            </Link>

            <span>•</span>
            <time className="capitalize">
              {formatDistanceToNow(new Date(post.created_at), {
                addSuffix: true,
              })}
            </time>

            {/* READ TIME DISPLAY */}
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {readTime}
            </span>
          </div>

          {isOwner && (
            <DeletePostButton
              postId={post.id}
              authorUsername={author.username}
            />
          )}
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight leading-tight">
          {post.title}
        </h1>

        {/* Tags Display */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-secondary text-secondary-foreground px-2.5 py-1 rounded-md text-xs font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Content with Syntax Highlighting */}
      <div className="prose dark:prose-invert prose-lg max-w-none prose-headings:font-display prose-a:text-primary prose-pre:bg-[#282c34] prose-pre:p-0 prose-pre:overflow-hidden">
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {post.content || ""}
        </ReactMarkdown>
      </div>

      <hr className="my-12 border-muted" />
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">Thanks for reading.</p>
        <div className="flex items-center gap-4">
          <BookmarkButton postId={post.id} />
          <LikeButton postId={post.id} initialCount={likeCount} />
        </div>
      </div>

      <CommentSection postId={post.id} />
    </article>
  );
}
