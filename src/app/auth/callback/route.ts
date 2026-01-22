import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  // "next" is where to go after login (default to home "/")
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // SUCCESS: Redirect to the original domain (localhost or vercel)
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  // FAILURE: Redirect to error page
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
