import { findMessageByText } from "./chatDom";

export function scrollToAndHighlight(selector?: string, snippet?: string) {
  let target: HTMLElement | null = null;

  if (selector?.trim()) {
    try {
      target = document.querySelector(selector) as HTMLElement | null;
    } catch {
      // A stale or malformed selector can still recover through snippet matching.
    }
  }

  // Recover older bookmarks whose anchors are empty or whose DOM markers
  // ChatGPT has since replaced.
  if (!target && snippet) target = findMessageByText(snippet);
  if (!target) return false;

  target.scrollIntoView({ behavior: "smooth", block: "center" });

  // ChatGPT owns these nodes through React. Animate without wrapping,
  // extracting, or otherwise mutating its message content.
  try {
    target.animate(
      [
        { outline: "3px solid transparent", backgroundColor: "transparent" },
        {
          outline: "3px solid #facc15",
          backgroundColor: "rgba(250, 204, 21, 0.22)",
        },
        { outline: "3px solid transparent", backgroundColor: "transparent" },
      ],
      { duration: 1800, easing: "ease-in-out" }
    );
  } catch {
    // Scrolling is the primary action; animation support must never break it.
  }

  return true;
}
