/**
 * Normalizes an image URL for Next.js Image component
 * Ensures the URL starts with "/" for relative paths or is an absolute URL
 */
export function normalizeImageUrl(url: string | undefined | null): string {
  if (!url) {
    return "/placeholder.svg";
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("/")) {
    return url;
  }

  if (
    url.includes("Users/") ||
    url.includes("Desktop/") ||
    url.includes("\\")
  ) {
    console.warn("Invalid image path detected, using placeholder:", url);
    return "/placeholder.svg";
  }

  return `/${url}`;
}
