"use client";

import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  RefreshCw,
  Save,
  Globe,
  User,
  AlertCircle,
} from "lucide-react";

const AVATAR_STYLE = "notionists";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fields
  const [originalUsername, setOriginalUsername] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [website, setWebsite] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [seed, setSeed] = useState("");

  // Validation State
  const [usernameError, setUsernameError] = useState("");

  // 1. Fetch Profile
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
        setOriginalUsername(data.username || "");
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

  const handleRandomize = () => {
    const newSeed = Math.random().toString(36).substring(7);
    setSeed(newSeed);
    setAvatarUrl(
      `https://api.dicebear.com/9.x/${AVATAR_STYLE}/svg?seed=${newSeed}&backgroundColor=e5e7eb,b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`,
    );
  };

  // 2. Save Logic with Username Check
  const handleSave = async () => {
    setUsernameError("");
    setSaving(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    // A. Check Username Uniqueness
    const cleanUsername = username
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, "");

    if (cleanUsername !== originalUsername) {
      if (cleanUsername.length < 3) {
        setUsernameError("Username must be at least 3 chars.");
        setSaving(false);
        return;
      }

      const { data: existing } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", cleanUsername)
        .single();

      if (existing) {
        setUsernameError("Sorry, that username is already taken.");
        setSaving(false);
        return;
      }
    }

    // B. Update Profile
    const { error } = await supabase
      .from("profiles")
      .update({
        username: cleanUsername,
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
      setOriginalUsername(cleanUsername);
      setUsername(cleanUsername);
      router.refresh();
      alert("Profile updated successfully!");
    }
    setSaving(false);
  };

  if (loading)
    return (
      <div className="flex h-screen items-center justify-center">
        Loading settings...
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-display font-bold mb-8">Profile Settings</h1>

      <div className="space-y-8">
        {/* Avatar Section */}
        <div className="bg-muted/30 p-6 rounded-xl border border-border">
          <Label className="text-lg font-bold mb-4 block">Identity</Label>
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-background shadow-sm bg-white shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={
                  avatarUrl ||
                  `https://api.dicebear.com/9.x/${AVATAR_STYLE}/svg?seed=${seed}`
                }
                alt="Avatar"
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <Button
                onClick={handleRandomize}
                variant="outline"
                size="sm"
                className="gap-2 mb-2"
              >
                <RefreshCw className="h-3.5 w-3.5" /> Randomize Avatar
              </Button>
              <p className="text-xs text-muted-foreground">
                Click until you find your vibe.
              </p>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className={`pl-9 ${usernameError ? "border-red-500" : ""}`}
                placeholder="username"
              />
            </div>
            {usernameError ? (
              <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {usernameError}
              </p>
            ) : (
              <p className="text-xs text-muted-foreground">
                This will be your unique URL handle.
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="fullname">Display Name</Label>
            <Input
              id="fullname"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
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
                className="pl-9"
              />
            </div>
          </div>
        </div>

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
            {saving ? "Save Changes" : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
