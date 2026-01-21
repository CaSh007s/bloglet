"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, RefreshCw, Save, Globe, User } from "lucide-react";

const AVATAR_STYLE = "notionists";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile Fields
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [seed, setSeed] = useState("");

  // 1. Fetch current profile
  useEffect(() => {
    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (data) {
        setUsername(data.username || "");
        setFullName(data.full_name || "");
        setBio(data.bio || "");
        setWebsite(data.website || "");
        setAvatarUrl(data.avatar_url || "");

        if (data.avatar_url?.includes("dicebear")) {
          setSeed("saved");
        } else {
          setSeed(Math.random().toString(36).substring(7));
        }
      }
      setLoading(false);
    };
    getProfile();
  }, [router, supabase]);

  // 2. Randomize Avatar
  const handleRandomize = () => {
    const newSeed = Math.random().toString(36).substring(7);
    setSeed(newSeed);
    setAvatarUrl(
      `https://api.dicebear.com/9.x/${AVATAR_STYLE}/svg?seed=${newSeed}&backgroundColor=e5e7eb,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
    );
  };

  // 3. Save Changes
  const handleSave = async () => {
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        bio: bio,
        website: website,
        avatar_url: avatarUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (error) {
      alert("Error saving profile: " + error.message);
    } else {
      router.refresh();
      alert("Profile updated successfully!");
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-display font-bold mb-8">Profile Settings</h1>

      <div className="space-y-8">
        {/* Avatar Section */}
        <div className="bg-muted/30 p-6 rounded-xl border border-border">
          <Label className="text-lg font-bold mb-4 block">
            Choose your Avatar
          </Label>
          <div className="flex items-center gap-6">
            <div className="h-32 w-32 rounded-full overflow-hidden border-4 border-background shadow-lg bg-white shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  avatarUrl ||
                  `https://api.dicebear.com/9.x/${AVATAR_STYLE}/svg?seed=${seed}`
                }
                alt="Avatar Preview"
                className="h-full w-full object-cover"
              />
            </div>

            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Click randomize until you find a face that matches your vibe.
              </p>
              <Button
                onClick={handleRandomize}
                variant="outline"
                className="gap-2"
              >
                <RefreshCw className="h-4 w-4" />
                Randomize Look
              </Button>
            </div>
          </div>
        </div>

        {/* Identity Section */}
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                value={username}
                disabled
                className="pl-9 bg-muted text-muted-foreground cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Username cannot be changed.
            </p>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fullname">Display Name</Label>
            <Input
              id="fullname"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="e.g. Gandalf the Grey"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell the world a little about yourself..."
              className="resize-none h-24"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="website">Website</Label>
            <div className="relative">
              <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://your-portfolio.com"
                className="pl-9"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4 border-t">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="min-w-[140px] gap-2"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
