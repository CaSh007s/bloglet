import AuthForm from "@/components/auth-form";

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-background selection:bg-primary/20">
      <AuthForm mode="signup" />
    </div>
  );
}
