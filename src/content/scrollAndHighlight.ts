export function scrollToAndHighlight(selector: string, snippet?: string) {
  const bubble = document.querySelector(selector) as HTMLElement | null;
  if (!bubble) return;

  console.log("Firing scrollToAndHighlight.....");
  bubble.scrollIntoView({ behavior: "smooth", block: "center" });

  // ✅ add border highlight
  bubble.style.outline = "3px solid yellow";
  bubble.style.outlineOffset = "3px";
  bubble.style.background = "cyan";
  bubble.style.transition = "outline 0.3s ease-in-out background 0.3s ease-in-out";

  if (snippet) {
    const range = document.createRange();
    const walker = document.createTreeWalker(bubble, NodeFilter.SHOW_TEXT);
    let found = false;

    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const idx = node.nodeValue?.indexOf(snippet);
      if (idx !== undefined && idx >= 0) {
        range.setStart(node, idx);
        range.setEnd(node, idx + snippet.length);

        const mark = document.createElement("mark");
        mark.style.backgroundColor = "yellow";
        range.surroundContents(mark);

        found = true;
        break;
      }
    }

    if (found) {
      setTimeout(() => {
        const mark = bubble.querySelector("mark");
        if (mark) {
          mark.replaceWith(document.createTextNode(mark.textContent || ""));
        }
      }, 2000);
    }
  }

  // ✅ remove border highlight after 2 seconds
  setTimeout(() => {
    bubble.style.outline = "";
    bubble.style.background= "inherit";
    bubble.style.transition = "outline 1s ease-in-out background 1s ease-in-out";
  }, 2000);
}
