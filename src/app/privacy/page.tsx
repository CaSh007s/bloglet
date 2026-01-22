export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto py-20 px-6 prose dark:prose-invert">
      <h1>Privacy Policy</h1>
      <p>
        Your privacy matters to us. This policy explains how we handle your
        data.
      </p>

      <h3>1. Data Collection</h3>
      <p>
        We collect your email and username for authentication purposes only.
      </p>

      <h3>2. Data Usage</h3>
      <p>
        We do not sell your data to third parties. We use it solely to provide
        the Bloglet service.
      </p>

      <h3>3. Cookies</h3>
      <p>We use cookies to keep you logged in. That&apos;s it.</p>

      <p className="text-sm text-muted-foreground mt-12">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
