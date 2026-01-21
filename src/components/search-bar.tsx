"use client";

import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useSearchParams, useRouter } from "next/navigation";
import { useDebouncedCallback } from "use-debounce";
import { useState } from "react";

export default function SearchBar() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get("q") || "";

  const [isSearching, setIsSearching] = useState(false);

  // The Magic: Wait 300ms after typing stops before triggering the search
  const handleSearch = useDebouncedCallback((term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set("q", term);
    } else {
      params.delete("q");
    }

    // Update the URL without reloading the page
    router.replace(`/search?${params.toString()}`);
    setIsSearching(false);
  }, 300);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        {isSearching ? (
          <Loader2 className="absolute left-4 top-3.5 h-5 w-5 text-primary animate-spin" />
        ) : (
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
        )}

        <Input
          placeholder="Type to search stories, tags, or content..."
          className="pl-12 h-12 text-lg bg-muted/30 border-border/50 focus:bg-background transition-all rounded-full shadow-sm"
          defaultValue={initialQuery}
          onChange={(e) => {
            setIsSearching(true);
            handleSearch(e.target.value);
          }}
          autoFocus
        />
      </div>
    </div>
  );
}
