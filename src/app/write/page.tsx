"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, Suspense } from "react";
import ReactMarkdown from "react-markdown";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, X, Eye, EyeOff, Hash, Info, Sparkles } from "lucide-react";
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
        cover_image: coverImage,
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
    <div className="h-[calc(100vh-64px)] flex flex-col bg-muted/20">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 backdrop-blur-md sticky top-0 z-10 bg-background/50 border-b border-border/40">
        <div className="flex items-center gap-3">
          <div
            className={`w-2.5 h-2.5 rounded-full shadow-sm ${loading ? "bg-amber-500 animate-pulse" : "bg-emerald-500"}`}
          />
          <span className="text-sm font-medium text-foreground/80">
            {loading ? "Saving..." : "Ready to write"}
          </span>
        </div>
        <div className="flex gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="text-muted-foreground hover:text-foreground"
          >
            {showPreview ? (
              <EyeOff className="w-4 h-4 mr-2" />
            ) : (
              <Eye className="w-4 h-4 mr-2" />
            )}
            {showPreview ? "Focus Mode" : "Preview"}
          </Button>
          <Button
            variant="outline"
            className="bg-background"
            onClick={() => handleSave(false)}
            disabled={loading}
          >
            Save Draft
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={loading}
            className="shadow-md shadow-primary/20"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {loading ? "Publishing..." : "Publish"}
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden p-4 md:p-6 gap-6 max-w-[1800px] mx-auto w-full">
        {/* CARD 1: THE EDITOR SHEET */}
        <div
          className={`
            flex-1 h-full overflow-hidden flex flex-col 
            bg-card 
            rounded-3xl 
            border border-border/60 
            shadow-xl shadow-black/5 dark:shadow-black/20
            transition-all duration-500
            ${showPreview ? "hidden md:flex" : "flex"}
        `}
        >
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            <div className="max-w-3xl mx-auto w-full py-12 px-8 md:px-12 flex flex-col">
              <CoverImageUpload url={coverImage} onUpload={setCoverImage} />

              <input
                placeholder="Untitled Story"
                className="text-4xl md:text-5xl font-display font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/20 mb-8 w-full"
                value={title}
                onChange={handleTitleChange}
              />

              {/* Meta Box */}
              <div className="group flex flex-col gap-4 mb-8 bg-muted/30 p-5 rounded-2xl border border-border/40 focus-within:border-primary/30 focus-within:bg-muted/50 transition-all duration-300">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="w-4 h-4 hover:text-foreground cursor-help opacity-50 hover:opacity-100 transition-opacity" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          The &quot;Slug&quot; is the end of the URL address.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className="font-mono text-xs opacity-50 select-none">
                    bloglet.com/@{username}/
                  </span>
                  <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="post-url"
                    className="bg-transparent border-none outline-none font-mono text-foreground flex-1 p-0 focus:ring-0 h-auto placeholder:opacity-30"
                  />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Hash className="w-3.5 h-3.5 text-muted-foreground/40" />
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-background border border-border px-2.5 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 shadow-sm"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    placeholder="Add topic..."
                    className="bg-transparent border-none outline-none text-sm flex-1 min-w-[80px] placeholder:text-muted-foreground/40"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                </div>
              </div>

              {/* Boxed Textarea with Background & Padding */}
              <Textarea
                placeholder="Tell your story..."
                className="
                          flex-1 resize-none 
                          text-lg md:text-xl leading-8 font-serif text-foreground/90 
                          min-h-[500px] placeholder:text-muted-foreground/30
                          
                          bg-muted/20              /* 1. Darker background */
                          border border-border/40  /* 2. Inner boundary */
                          rounded-2xl              /* 3. Rounded corners */
                          p-8                      /* 4. Padding for text start */
                          focus-visible:ring-1 focus-visible:ring-primary/20
                          shadow-inner
                        "
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* CARD 2: THE PREVIEW SHEET */}
        <div
          className={`
            flex-1 h-full overflow-hidden 
            bg-card 
            rounded-3xl 
            border border-border/60 
            shadow-xl shadow-black/5 dark:shadow-black/20
            relative
            ${showPreview ? "flex" : "hidden md:block"}
        `}
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-20 z-10" />

          <div className="h-full overflow-y-auto custom-scrollbar">
            <div className="max-w-2xl mx-auto py-12 px-8 md:px-12">
              <div className="flex items-center gap-2 mb-8 text-xs font-mono text-muted-foreground uppercase tracking-widest opacity-50 select-none">
                <Sparkles className="w-3 h-3" />
                Live Preview
              </div>

              {coverImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverImage}
                  alt="Cover"
                  className="w-full h-auto rounded-xl mb-8 object-cover shadow-sm border border-border/50"
                />
              )}

              <h1 className="mb-2 !leading-tight text-4xl font-display font-bold">
                {title || "Untitled Story"}
              </h1>

              {tags.length > 0 && (
                <div className="flex gap-2 mb-8 not-prose">
                  {tags.map((t) => (
                    <span
                      key={t}
                      className="text-xs font-mono text-muted-foreground border border-border px-2 py-1 rounded-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              )}

              <div
                className="
                        prose dark:prose-invert prose-lg prose-headings:font-display prose-img:rounded-xl
                        bg-muted/20              /* Match Editor BG */
                        border border-border/40  /* Match Editor Border */
                        rounded-2xl              /* Match Editor Rounding */
                        p-8                      /* Match Editor Padding */
                        min-h-[500px]
                        shadow-inner
                    "
              >
                <ReactMarkdown>
                  {content || "*Start writing to see preview...*"}
                </ReactMarkdown>
              </div>
            </div>
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
