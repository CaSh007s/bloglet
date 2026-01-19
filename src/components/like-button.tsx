"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function LikeButton({
  postId,
  initialCount,
}: {
  postId: string;
  initialCount: number;
}) {
  const supabase = createClient();
  const router = useRouter();

  const [count, setCount] = useState(initialCount);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1. Check if WE liked this post already
  useEffect(() => {
    const checkLikeStatus = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("likes")
          .select("*")
          .eq("user_id", user.id)
          .eq("post_id", postId)
          .single();

        if (data) setIsLiked(true);
      }
      setLoading(false);
    };
    checkLikeStatus();
  }, [postId, supabase]);

  const handleToggleLike = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // If not logged in, send them to login
    if (!user) {
      router.push("/login");
      return;
    }

    // Optimistic UI Update (Update screen BEFORE waiting for DB)
    const previousIsLiked = isLiked;
    const previousCount = count;

    setIsLiked(!isLiked);
    setCount(isLiked ? count - 1 : count + 1);

    try {
      if (previousIsLiked) {
        // Unlike
        await supabase
          .from("likes")
          .delete()
          .eq("user_id", user.id)
          .eq("post_id", postId);
      } else {
        // Like
        await supabase
          .from("likes")
          .insert({ user_id: user.id, post_id: postId });
      }
      router.refresh(); // Refresh server data to stay in sync
    } catch (error) {
      // Revert if error
      setIsLiked(previousIsLiked);
      setCount(previousCount);
      console.error("Error toggling like:", error);
    }
  };

  if (loading) {
    return (
      <Button variant="ghost" disabled size="sm" className="gap-2">
        <Heart className="h-4 w-4" /> {count}
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggleLike}
      className={cn(
        "gap-2 transition-colors duration-300",
        isLiked
          ? "text-red-500 hover:text-red-600 hover:bg-red-100/50"
          : "text-muted-foreground",
      )}
    >
      {/* Fill the heart if liked */}
      <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
      <span>{count}</span>
    </Button>
  );
}
