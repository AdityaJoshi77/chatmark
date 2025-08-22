export function scrollToAndHighlight(selector: string, snippet?: string) {
  const bubble = document.querySelector(selector) as HTMLElement | null;
  if (!bubble) return;

  console.log("Firing scrollToAndHighlight.....");
  bubble.scrollIntoView({ behavior: "smooth", block: "center" });

  // 👉 target the first child instead of the bubble itself
  const target = bubble.firstElementChild as HTMLElement | null;
  if (!target) return;

  // ✅ inject blinking animation dynamically
  const style = document.createElement("style");
  style.textContent = `
    @keyframes smoothBlink {
      0%, 100% {
        background-color: inherit;
        outline-color: inherit;
      }
      50% {
        background-color: #d1d5db; /* gray-300 */
        outline-color: white;
      }
    }
    .blink-highlight {
      outline: 3px solid inherit;
      outline-offset: 3px;
      animation: smoothBlink 1s ease-in-out 3; /* 3 blinks */
    }
  `;
  document.head.appendChild(style);

  target.classList.add("blink-highlight");

  // remove styles after animation ends
  target.addEventListener(
    "animationend",
    () => {
      target.classList.remove("blink-highlight");
      target.style.outline = "";
      style.remove(); // cleanup the injected <style>
    },
    { once: true }
  );

  if (snippet) {
    const range = document.createRange();
    const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);

    while (walker.nextNode()) {
      const node = walker.currentNode as Text;
      const idx = node.nodeValue?.indexOf(snippet);
      if (idx !== undefined && idx >= 0) {
        range.setStart(node, idx);
        range.setEnd(node, idx + snippet.length);

        const mark = document.createElement("mark");
        mark.style.backgroundColor = "yellow";
        range.surroundContents(mark);
        break;
      }
    }
  }
}
