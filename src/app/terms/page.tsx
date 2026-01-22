export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto py-20 px-6 prose dark:prose-invert">
      <h1>Terms of Service</h1>
      <p>Welcome to Bloglet. By using our website, you agree to these terms.</p>

      <h3>1. Content</h3>
      <p>You own the rights to the content you create and post on Bloglet.</p>

      <h3>2. Conduct</h3>
      <p>
        We believe in free speech, but hate speech or harassment will result in
        an account ban.
      </p>

      <h3>3. Disclaimer</h3>
      <p>Bloglet is provided &quot;as is&quot; without any warranties.</p>

      <p className="text-sm text-muted-foreground mt-12">
        Last updated: {new Date().toLocaleDateString()}
      </p>
    </div>
  );
}
