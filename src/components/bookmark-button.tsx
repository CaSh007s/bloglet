"use client";

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";

export default function BookmarkButton({ postId }: { postId: string }) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // 1. Check if already bookmarked
  useEffect(() => {
    const checkBookmark = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("bookmarks")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single();

      if (data) setIsBookmarked(true);
      setLoading(false);
    };
    checkBookmark();
  }, [postId, supabase]);

  // 2. Toggle Bookmark
  const handleToggle = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      alert("Please login to bookmark posts.");
      return;
    }

    const newState = !isBookmarked;
    setIsBookmarked(newState);

    if (newState) {
      // Add Bookmark
      await supabase.from("bookmarks").insert({
        user_id: user.id,
        post_id: postId,
      });
    } else {
      // Remove Bookmark
      await supabase
        .from("bookmarks")
        .delete()
        .eq("user_id", user.id)
        .eq("post_id", postId);
    }
  };

  if (loading) return <div className="w-9 h-9" />; // Placeholder to prevent jump

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={`transition-all ${isBookmarked ? "text-yellow-500 hover:text-yellow-600" : "text-muted-foreground hover:text-foreground"}`}
    >
      <Bookmark className={`h-5 w-5 ${isBookmarked ? "fill-current" : ""}`} />
    </Button>
  );
}
