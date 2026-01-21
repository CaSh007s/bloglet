"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function DeletePostButton({
  postId,
  authorUsername,
}: {
  postId: string;
  authorUsername: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const confirm = window.confirm(
      "Are you sure you want to delete this post? This cannot be undone.",
    );
    if (!confirm) return;

    setLoading(true);
    const supabase = createClient();

    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      alert("Error deleting post: " + error.message);
      setLoading(false);
    } else {
      alert("Post deleted.");
      // Redirect to the author's profile
      router.push(`/${authorUsername}`);
      router.refresh();
    }
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className="gap-2"
    >
      <Trash2 className="h-4 w-4" />
      {loading ? "Deleting..." : "Delete Post"}
    </Button>
  );
}
