export function scrollToAndHighlight(selector: string, snippet?: string) {
  const bubble = document.querySelector(selector) as HTMLElement | null;
  if (!bubble) return;

  bubble.scrollIntoView({ behavior: "smooth", block: "center" });
  bubble.classList.add("highlighted-bubble");

  const originalHTML = bubble.innerHTML;

  if (snippet) {
    bubble.innerHTML = originalHTML.replace(
      snippet,
      `<mark style="background-color: yellow;">${snippet}</mark>`
    );

    setTimeout(() => {
      bubble.innerHTML = originalHTML;
    }, 2000);
  }

  setTimeout(() => bubble.classList.remove("highlighted-bubble"), 2000);
}
