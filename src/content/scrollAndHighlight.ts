import { findMessageByText } from "./chatDom";

export function scrollToAndHighlight(selector?: string, snippet?: string) {
  let target: HTMLElement | null = null;

  if (selector?.trim()) {
    try {
      target = document.querySelector(selector) as HTMLElement | null;
    } catch (error) {
      console.warn("ChatMark could not use the saved message selector:", error);
    }
  }

  // Recover older bookmarks whose anchors are empty or whose DOM markers
  // ChatGPT has since replaced.
  if (!target && snippet) target = findMessageByText(snippet);
  if (!target) {
    console.warn("ChatMark could not find the bookmarked message.");
    return false;
  }

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
  } catch (error) {
    // Scrolling is the primary action; animation support must never break it.
    console.debug("ChatMark highlight animation was unavailable:", error);
  }

  return true;
}
