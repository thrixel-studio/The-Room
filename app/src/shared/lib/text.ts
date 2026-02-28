/**
 * Decode HTML entities in text
 * Converts entities like &#39; &apos; &quot; etc. to their actual characters
 */
export function decodeHtmlEntities(text: string): string {
  if (typeof document === 'undefined') {
    // Server-side: use a simple regex replacement
    return text
      .replace(/&#39;/g, "'")
      .replace(/&apos;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  }
  
  // Client-side: use textarea element for accurate decoding
  const textarea = document.createElement('textarea');
  textarea.innerHTML = text;
  return textarea.value;
}
