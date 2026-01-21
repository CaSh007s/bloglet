export function getExcerpt(
  content: string | null,
  limit: number = 150,
): string {
  if (!content) return "";

  // Remove markdown symbols for a cleaner preview
  const plainText = content.replace(/[#*`]/g, "").trim();

  if (plainText.length <= limit) {
    return plainText; // Return text as-is if it fits
  }

  // Slice and add ellipsis
  return plainText.slice(0, limit).trim() + "...";
}
