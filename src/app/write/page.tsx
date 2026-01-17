"use client"; // Needs to be client for inputs/preview

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";

export default function WritePage() {
  const supabase = createClient();

  // State for the form
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle saving
  const handleSave = async () => {
    console.log("Save button clicked"); // Check browser console
    setLoading(true);

    // 1. Check User
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      setLoading(false);
      alert(
        "Error: You are not logged in! " +
          (authError?.message || "No user found")
      );
      return;
    }

    console.log("User found:", user.id);

    // 2. Validate Data
    if (!title || !slug) {
      setLoading(false);
      alert("Error: Title and Slug are required!");
      return;
    }

    // 3. Attempt Save
    console.log("Attempting upsert...");
    const { data, error } = await supabase
      .from("posts")
      .upsert(
        {
          title,
          slug,
          content,
          author_id: user.id,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "author_id, slug" }
      ) // Columns must match the Unique Constraint exactly
      .select();

    setLoading(false);

    if (error) {
      console.error("Supabase Error:", error);
      alert(
        "Database Error: " + error.message + " (Check console for details)"
      );
    } else {
      console.log("Success Data:", data);
      alert("Saved Successfully! 💾");
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 h-[calc(100vh-100px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold">Editor</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleSave} disabled={loading}>
            {loading ? "Saving..." : "Save Draft"}
          </Button>
          <Button disabled>Publish</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 flex-1">
        {/* LEFT: Editing Area */}
        <div className="flex flex-col gap-4 h-full">
          <Input
            placeholder="Article Title"
            className="text-2xl font-bold border-none px-0 shadow-none focus-visible:ring-0"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <div className="flex items-center gap-2 text-muted-foreground">
            <span className="text-sm">slug:</span>
            <Input
              placeholder="my-post-url"
              className="font-mono text-sm h-8 w-full"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
          </div>
          <Textarea
            placeholder="Write your story in Markdown..."
            className="flex-1 resize-none font-mono text-base leading-relaxed p-4 border-muted"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        {/* RIGHT: Live Preview Area */}
        <div className="h-full border-l pl-8 overflow-y-auto prose dark:prose-invert max-w-none">
          {content ? (
            <>
              <h1>{title || "Untitled"}</h1>
              <ReactMarkdown>{content}</ReactMarkdown>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground italic">
              Preview will appear here...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
