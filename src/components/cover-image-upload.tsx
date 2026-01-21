"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, Loader2, ImageIcon } from "lucide-react";

interface CoverImageUploadProps {
  url: string;
  onUpload: (url: string) => void;
}

export default function CoverImageUpload({
  url,
  onUpload,
}: CoverImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. RESTRICTION: File Type (Images only)
    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return;
    }

    // 2. RESTRICTION: File Size (Max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert("File size must be less than 2MB.");
      return;
    }

    setUploading(true);

    // 3. Upload to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await response.json();

      if (data.secure_url) {
        onUpload(data.secure_url);
      } else {
        alert("Upload failed. Please check your Cloudinary settings.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mb-8 group relative">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleFileChange}
      />

      {url ? (
        // SHOW IMAGE PREVIEW
        <div className="relative w-full h-[40vh] rounded-xl overflow-hidden shadow-sm border border-border/50 bg-muted">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={url}
            alt="Cover"
            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
          />

          {/* Remove Button */}
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity rounded-full shadow-lg"
            onClick={() => onUpload("")} // Clear URL
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        // SHOW UPLOAD BUTTON
        <div
          onClick={() => fileInputRef.current?.click()}
          className="w-full h-32 border-2 border-dashed border-border/60 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-muted/30 hover:border-primary/40 transition-all gap-2 text-muted-foreground hover:text-primary"
        >
          {uploading ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <div className="flex items-center gap-2">
                <ImagePlus className="w-5 h-5" />
                <span className="font-medium">Add Cover Image</span>
              </div>
              <p className="text-xs opacity-50">Max 2MB • JPG, PNG, WEBP</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}
