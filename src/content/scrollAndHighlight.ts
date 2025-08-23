export function scrollToAndHighlight(selector: string, snippet?: string) {
  const bubble = document.querySelector(selector) as HTMLElement | null;
  if (!bubble) return;

  console.log("Firing scrollToAndHighlight.....");
  bubble.scrollIntoView({ behavior: "smooth", block: "center" });

  // ✅ add border highlight immediately
  bubble.style.outline = "2px solid yellow";

  // ✅ create smooth blink animation for background
  const style = document.createElement("style");
  style.textContent = `
    @keyframes smoothBlink {
      0%, 100% { background-color: inherit; }
      50% { background-color: #d1d5db; }
    }
    .blink-bg {
      animation: smoothBlink 0.8s ease-in-out 3;
    }
  `;
  document.head.appendChild(style);

  // apply blink class
  bubble.classList.add("blink-bg");

  if (snippet) {
    const range = document.createRange();
    const walker = document.createTreeWalker(bubble, NodeFilter.SHOW_TEXT);

    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const idx = node.nodeValue?.indexOf(snippet);
      if (idx !== undefined && idx >= 0) {
        range.setStart(node, idx);
        range.setEnd(node, idx + snippet.length);

        const mark = document.createElement("mark");
        mark.style.backgroundColor = "yellow"; // ✅ snippet highlighted in yellow
        range.surroundContents(mark);
        break;
      }
    }
  }

  // ✅ remove border highlight after ~4s, once blink finishes
  setTimeout(() => {
    bubble.style.outline = "";
    bubble.classList.remove("blink-bg");
    style.remove();
  }, 4000); // matches 3 blinks at 0.8s each
}
