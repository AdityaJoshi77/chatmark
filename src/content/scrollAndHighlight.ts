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

  // ✅ snippet highlighting
  if (snippet) {
    const bubbleText = bubble.innerText;
    const idx = bubbleText.indexOf(snippet);

    if (idx >= 0) {
      const range = document.createRange();

      let charCount = 0;
      let startNode: Node | null = null,
        endNode: Node | null = null;
      let startOffset = 0,
        endOffset = 0;

      const walker = document.createTreeWalker(bubble, NodeFilter.SHOW_TEXT);
      while (walker.nextNode()) {
        const node = walker.currentNode as Text;
        const nextCharCount = charCount + node.nodeValue!.length;

        if (!startNode && idx >= charCount && idx < nextCharCount) {
          startNode = node;
          startOffset = idx - charCount;
        }

        if (!endNode && idx + snippet.length > charCount && idx + snippet.length <= nextCharCount) {
          endNode = node;
          endOffset = idx + snippet.length - charCount;
          break;
        }

        charCount = nextCharCount;
      }

      if (startNode && endNode) {
        range.setStart(startNode, startOffset);
        range.setEnd(endNode, endOffset);

        const mark = document.createElement("mark");
        mark.style.backgroundColor = "yellow";
        try {
          range.surroundContents(mark);
        } catch {
          // if snippet spans multiple nodes, extract & wrap safely
          const frag = range.extractContents();
          mark.appendChild(frag);
          range.insertNode(mark);
        }
      }
    }
  }

  // ✅ remove border highlight + cleanup after ~4s
  setTimeout(() => {
    bubble.style.outline = "";
    bubble.classList.remove("blink-bg");
    style.remove();
  }, 4000);
}
