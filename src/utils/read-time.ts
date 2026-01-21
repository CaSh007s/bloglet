export function calculateReadTime(content: string | null): string {
  if (!content) return "1 min read";

  const wordsPerMinute = 200; // Average reading speed
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  return `${minutes} min read`;
}
