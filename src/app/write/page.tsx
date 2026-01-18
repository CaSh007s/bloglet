"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, Suspense } from "react";
import ReactMarkdown from "react-markdown";
import { useSearchParams, useRouter } from "next/navigation";

function Editor() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  const initialSlug = searchParams.get("slug");
  const [isFetching, setIsFetching] = useState(!!initialSlug);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Load Data if editing
  useEffect(() => {
    const editSlug = searchParams.get("slug");

    if (editSlug) {
      const fetchPost = async () => {
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .eq("slug", editSlug)
          .single();

        if (data) {
          setTitle(data.title);
          setSlug(data.slug);
          setContent(data.content || "");
        }
        setIsFetching(false);
      };
      fetchPost();
    }
  }, [searchParams, supabase]);

  const handleSave = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("Please login first");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("posts").upsert(
      {
        title,
        slug,
        content,
        author_id: user.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "author_id, slug" },
    );

    setLoading(false);

    if (error) {
      alert("Error: " + error.message);
    } else {
      alert("Saved!");
      if (!searchParams.get("slug")) {
        router.push(`/write?slug=${slug}`);
      }
    }
  };

  if (isFetching) {
    return (
      <div className="flex h-screen items-center justify-center text-muted-foreground">
        Loading editor...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8 h-[calc(100vh-100px)] flex flex-col">
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

// 2. Wrap in Suspense boundary
export default function WritePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Editor />
    </Suspense>
  );
}
