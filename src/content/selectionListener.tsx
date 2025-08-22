// src/content/selectionListener.tsx
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import BookmarkIcon from "./BookmarkIcon";
import { openPanelWithSnippet } from "./App";

let iconContainer: HTMLDivElement | null = null;
let root: Root | null = null;

export function initSelectionListener() {
  document.addEventListener("selectionchange", handleSelectionChange);
}

function handleSelectionChange() {
  console.log("The selectionListener was fired");
  const selection = window.getSelection();
  if (!selection || selection.toString().trim() === "") {
    removeIcon();
    return;
  }

  console.log("Selection : ", selection.toString());

  // Ensure there is a valid range
  if (selection.rangeCount === 0) {
    removeIcon();
    return;
  }

  const range = selection.getRangeAt(0);
  const parentBubble = range.startContainer.parentElement?.closest(
    "[data-message-author-role]"
  );

  if (!parentBubble) {
    console.log("Could not find parentBubble of the selection text");
    removeIcon();
    return;
  }

  const rect = range.getBoundingClientRect();
  if (!rect) {
    removeIcon();
    return;
  }

  // Position the icon **beneath the selection** with an offset
  const offset = 8; // pixels below selection
  const top = Math.max(
    rect.bottom + window.scrollY + offset,
    window.scrollY + offset
  );
  const left = rect.left + window.scrollX;

  renderIcon(top, left, selection.toString(), parentBubble);
}

function renderIcon(
  top: number,
  left: number,
  snippet: string,
  bubble: Element
) {
  if (!iconContainer) {
    iconContainer = document.createElement("div");
    document.body.appendChild(iconContainer);
    root = createRoot(iconContainer); // create root once
  }

  if (root) {
    root.render(
      <BookmarkIcon
        top={top}
        left={left}
        onClick={() => {
          openPanelWithSnippet(snippet, bubble);
          removeIcon();
        }}
      />
    );
  }
}

function removeIcon() {
  if (iconContainer && root) {
    root.unmount();
    iconContainer.remove();
  }
  iconContainer = null;
  root = null;
}
