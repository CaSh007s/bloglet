"use client";

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { Trash2 } from "lucide-react";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    avatar_url: string | null;
  };
}

export default function CommentSection({ postId }: { postId: string }) {
  const supabase = createClient();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const fetchComments = async () => {
    console.log("Fetching comments for:", postId);

    const { data, error } = await supabase
      .from("comments")
      .select(
        `
        *,
        profiles (
          username,
          avatar_url
        )
      `,
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
      return;
    }

    if (data) {
      console.log("Comments found:", data);
      setComments(data as unknown as Comment[]);
    }
  };

  // 1. Initial Load
  useEffect(() => {
    const init = async () => {
      // Get User ID
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);

      // Get Comments
      await fetchComments();
    };
    init();
  }, [postId]);

  // 2. Handle Submit
  const handleSubmit = async () => {
    if (!newComment.trim()) return;
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Please login to comment");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("comments").insert({
      content: newComment,
      post_id: postId,
      user_id: user.id,
    });

    if (error) {
      alert("Error posting comment");
    } else {
      setNewComment("");
      await fetchComments();
    }
    setLoading(false);
  };

  // 3. Handle Delete
  const handleDelete = async (commentId: string) => {
    const confirm = window.confirm("Delete this comment?");
    if (!confirm) return;

    await supabase.from("comments").delete().eq("id", commentId);
    await fetchComments();
  };

  return (
    <div className="mt-16 border-t pt-10">
      <h3 className="text-2xl font-display font-bold mb-6">
        Comments ({comments.length})
      </h3>

      {/* Input Area */}
      <div className="flex gap-4 mb-10">
        <Textarea
          placeholder="What are your thoughts?"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="resize-none"
        />
        <Button
          onClick={handleSubmit}
          disabled={loading || !newComment}
          className="h-auto"
        >
          {loading ? "Posting..." : "Post"}
        </Button>
      </div>

      {/* List Area */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-4 group">
            <Avatar className="h-10 w-10">
              <AvatarImage src={comment.profiles?.avatar_url || ""} />
              <AvatarFallback>
                {comment.profiles?.username?.[0]?.toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">
                    {comment.profiles?.username || "Unknown"}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {formatDistanceToNow(new Date(comment.created_at), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
                {/* Delete Button (Only visible to owner) */}
                {currentUserId === comment.user_id && (
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
              <p className="text-sm mt-1 text-muted-foreground">
                {comment.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
