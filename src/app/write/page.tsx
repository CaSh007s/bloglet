"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, Suspense } from "react";
import ReactMarkdown from "react-markdown";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, X, Eye, EyeOff, Hash, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import CoverImageUpload from "@/components/cover-image-upload";

function Editor() {
  const supabase = createClient();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [isFetching, setIsFetching] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Data
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [username, setUsername] = useState("user");

  useEffect(() => {
    const load = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();
        if (profile) setUsername(profile.username);
      }

      const editSlug = searchParams.get("slug");
      if (editSlug) {
        const { data } = await supabase
          .from("posts")
          .select("*")
          .eq("slug", editSlug)
          .single();
        if (data) {
          setTitle(data.title);
          setSlug(data.slug);
          setContent(data.content || "");
          setTags(data.tags || []);
          setCoverImage(data.cover_image || "");
        }
      }
      setIsFetching(false);
    };
    load();
  }, [searchParams, supabase]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!searchParams.get("slug") && !slug) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      );
    }
  };

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = currentTag.trim().toLowerCase();
      if (val && !tags.includes(val)) {
        setTags([...tags, val]);
        setCurrentTag("");
      }
    }
  };

  const removeTag = (t: string) => setTags(tags.filter((tag) => tag !== t));

  const handleSave = async (isPublished: boolean) => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    if (isPublished && (!title || !slug || !content)) {
      alert("Please fill out the title, URL, and content.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("posts").upsert(
      {
        title,
        slug,
        content,
        tags,
        cover_image: coverImage, // <--- 4. Save to DB
        author_id: user.id,
        updated_at: new Date().toISOString(),
        published: isPublished,
      },
      { onConflict: "author_id, slug" },
    );

    if (error) {
      alert(error.message);
    } else {
      if (isPublished) router.push(`/${username}/${slug}`);
      else alert("Draft saved.");
    }
    setLoading(false);
  };

  if (isFetching)
    return (
      <div className="h-screen flex items-center justify-center text-muted-foreground">
        Loading Studio...
      </div>
    );

  return (
    <div className="max-w-screen-2xl mx-auto h-[calc(100vh-64px)] flex flex-col bg-background">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 backdrop-blur-sm sticky top-0 z-10 bg-background/80">
        <div className="flex items-center gap-2">
          <div
            className={`w-2 h-2 rounded-full ${loading ? "bg-yellow-500 animate-pulse" : "bg-green-500"}`}
          />
          <span className="text-sm font-medium text-muted-foreground">
            {loading ? "Saving..." : "Draft"}
          </span>
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? (
              <EyeOff className="w-4 h-4 mr-2" />
            ) : (
              <Eye className="w-4 h-4 mr-2" />
            )}
            {showPreview ? "Editor" : "Preview"}
          </Button>
          <Button
            variant="secondary"
            onClick={() => handleSave(false)}
            disabled={loading}
          >
            Save Draft
          </Button>
          <Button onClick={() => handleSave(true)} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* EDITING AREA */}
        <div
          className={`flex-1 overflow-y-auto transition-all duration-300 ${showPreview ? "hidden md:flex" : "flex"}`}
        >
          <div className="max-w-2xl mx-auto w-full py-12 px-6 flex flex-col">
            {/* 5. Render Upload Component*/}
            <CoverImageUpload url={coverImage} onUpload={setCoverImage} />

            <input
              placeholder="Title"
              className="text-4xl md:text-5xl font-display font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/30 mb-6 w-full"
              value={title}
              onChange={handleTitleChange}
            />

            {/* Slug & Tags Section */}
            <div className="group flex flex-col gap-4 mb-8 bg-muted/20 p-4 rounded-xl border border-transparent focus-within:border-border transition-colors">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="w-4 h-4 hover:text-foreground cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>The &quot;Slug&quot; is the end of the URL address.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <span className="font-mono text-xs opacity-50">
                  bloglet.com/@{username}/
                </span>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-url"
                  className="bg-transparent border-none outline-none font-mono text-foreground flex-1 p-0 focus:ring-0 h-auto"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-muted-foreground/50" />
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-secondary px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1"
                  >
                    {tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <input
                  placeholder="Add topic..."
                  className="bg-transparent border-none outline-none text-sm flex-1 min-w-[80px]"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  onKeyDown={handleAddTag}
                />
              </div>
            </div>

            <Textarea
              placeholder="Tell your story..."
              className="flex-1 resize-none border-none shadow-none focus-visible:ring-0 px-0 text-lg md:text-xl leading-relaxed font-serif text-foreground/90 bg-transparent min-h-[500px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        </div>

        {/* PREVIEW AREA */}
        <div
          className={`flex-1 border-l border-border/40 bg-muted/5 overflow-y-auto ${showPreview ? "flex" : "hidden md:block"}`}
        >
          <div className="max-w-2xl mx-auto py-12 px-8 prose dark:prose-invert prose-lg prose-headings:font-display">
            {/* Preview the Cover Image */}
            {coverImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={coverImage}
                alt="Cover"
                className="w-full h-auto rounded-xl mb-8 object-cover shadow-sm border border-border/50"
              />
            )}

            <h1 className="mb-2">{title || "Untitled Story"}</h1>
            {tags.length > 0 && (
              <div className="flex gap-2 mb-8 not-prose">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs font-mono text-muted-foreground border px-2 py-1 rounded-full"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}
            <ReactMarkdown>
              {content || "*Start writing to see preview...*"}
            </ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WritePage() {
  return (
    <Suspense fallback={null}>
      <Editor />
    </Suspense>
  );
}
