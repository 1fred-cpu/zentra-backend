/**
 * Converts a string into a URL-friendly slug
 * @param text The input string to convert
 * @returns A slugified version of the string
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')       // Remove special characters
    .replace(/\s+/g, '-')           // Replace spaces with dashes
    .replace(/--+/g, '-')           // Replace multiple dashes with one
}