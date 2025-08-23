// src/content/selectionListener.tsx
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import BookmarkIcon from "./BookmarkIcon";
import { openPanelWithSnippet } from "./App";

let iconContainer: HTMLDivElement | null = null;
let root: Root | null = null;

export function initSelectionListener() {
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("keyup", handleKeyUp);
  document.addEventListener("mousedown", handleMouseDown, true); // use capture phase
}

function handleMouseDown(event: MouseEvent) {
  const target = event.target as HTMLElement;
  // Remove icon if clicked anywhere except the icon itself
  if (!target.closest(".bookmark-icon-btn")) {
    removeIcon();
  }
}

function handleMouseUp() {
  setTimeout(() => checkAndShowIcon(), 50);
}

function handleKeyUp(event: KeyboardEvent) {
  if (
    event.shiftKey ||
    ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Home", "End"].includes(
      event.key
    )
  ) {
    setTimeout(() => checkAndShowIcon(), 50);
  }
}

function checkAndShowIcon() {
  const selection = window.getSelection();
  if (!selection || selection.toString().trim() === "" || selection.rangeCount === 0) {
    removeIcon();
    return;
  }

  const range = selection.getRangeAt(0);
  const parentBubble = range.startContainer.parentElement?.closest(
    "[data-message-author-role]"
  ) as HTMLElement;

  if (!parentBubble) {
    removeIcon();
    return;
  }

  const rect = range.getBoundingClientRect();
  if (!rect || rect.width === 0 || rect.height === 0) {
    removeIcon();
    return;
  }

  const iconWidth = 32;
  const iconHeight = 32;
  const gap = 8;

  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

  // Calculate position with fallback strategies
  let left = rect.right + scrollLeft + gap;
  let top = rect.top + scrollTop;

  const spaceRight = window.innerWidth - rect.right;
  const spaceLeft = rect.left;
  const spaceBelow = window.innerHeight - rect.bottom;
  const spaceAbove = rect.top;

  if (spaceRight >= iconWidth + gap) {
    left = rect.right + scrollLeft + gap;
    top = rect.top + scrollTop;
  } else if (spaceLeft >= iconWidth + gap) {
    left = rect.left + scrollLeft - iconWidth - gap;
    top = rect.top + scrollTop;
  } else if (spaceBelow >= iconHeight + gap) {
    top = rect.bottom + scrollTop + gap;
    left = rect.right + scrollLeft - iconWidth;
  } else if (spaceAbove >= iconHeight + gap) {
    top = rect.top + scrollTop - iconHeight - gap;
    left = rect.right + scrollLeft - iconWidth;
  }

  // Ensure within document bounds
  const maxLeft = window.innerWidth + scrollLeft - iconWidth - 10;
  const maxTop = window.innerHeight + scrollTop - iconHeight - 10;
  left = Math.max(scrollLeft + 10, Math.min(left, maxLeft));
  top = Math.max(scrollTop + 10, Math.min(top, maxTop));

  renderIcon(top, left, selection.toString(), parentBubble);
}

function renderIcon(top: number, left: number, snippet: string, bubble: HTMLElement) {
  // Remove previous icon if exists
  removeIcon();

  iconContainer = document.createElement("div");
  iconContainer.style.position = "absolute";
  iconContainer.style.top = `${top}px`;
  iconContainer.style.left = `${left}px`;
  iconContainer.style.width = "32px";
  iconContainer.style.height = "32px";
  iconContainer.style.zIndex = "10000";
  iconContainer.style.pointerEvents = "auto"; // only icon is clickable
  document.body.appendChild(iconContainer);

  root = createRoot(iconContainer);
  root.render(
    <BookmarkIcon
      // top={0} // iconContainer already positioned absolutely
      // left={0}
      onClick={(e) => {
        e.stopPropagation();
        openPanelWithSnippet(snippet, bubble);
        removeIcon();
      }}
    />
  );
}

function removeIcon() {
  if (iconContainer && root) {
    root.unmount();
    iconContainer.remove();
  }
  iconContainer = null;
  root = null;
}
