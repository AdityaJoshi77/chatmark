// src/content/selectionListener.tsx
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import AddNoteIcon from "./AddNoteIcon";
import BookmarkIcon from "./BookmarkIcon";
import { openPanelWithSnippet } from "./App";

let iconContainer: HTMLDivElement | null = null;
let root: Root | null = null;
// 1️⃣ Add a flag to track if the click originated from an icon
let isIconClicked = false;

export function initSelectionListener() {
  document.addEventListener("mouseup", handleMouseUp);
  document.addEventListener("keyup", handleKeyUp);
  document.addEventListener("pointerdown", handlePointerDown, true);
}

function handlePointerDown(event: PointerEvent) {
  const target = event.target as HTMLElement;
  const isIcon = target.closest(".bookmark-icon-wrapper");
  if (isIcon) {
    // 2️⃣ Set the flag if the click is on an icon
    isIconClicked = true;
  } else {
    // 3️⃣ Reset the flag for other clicks
    isIconClicked = false;
    removeIcon();
  }
}

function handleMouseUp() {
  setTimeout(() => {
    // 4️⃣ Check the flag before showing the icon
    if (!isIconClicked) {
      checkAndShowIcon();
    }
  }, 50);
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
  if (
    !selection ||
    selection.toString().trim() === "" ||
    selection.rangeCount === 0
  ) {
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

  // Keep within viewport
  const maxLeft = window.innerWidth + scrollLeft - iconWidth - 10;
  const maxTop = window.innerHeight + scrollTop - iconHeight - 10;
  left = Math.max(scrollLeft + 10, Math.min(left, maxLeft));
  top = Math.max(scrollTop + 10, Math.min(top, maxTop));

  renderIcon(top, left, selection.toString(), parentBubble);
}

function renderIcon(
  top: number,
  left: number,
  snippet: string,
  bubble: HTMLElement
) {
  removeIcon();

  iconContainer = document.createElement("div");
  iconContainer.className = "bookmark-icon-wrapper";
  iconContainer.style.position = "absolute";
  iconContainer.style.top = `${top}px`;
  iconContainer.style.left = `${left}px`;
  iconContainer.style.width = "32px";
  iconContainer.style.height = "auto";
  iconContainer.style.zIndex = "10000";
  iconContainer.style.pointerEvents = "none";
  document.body.appendChild(iconContainer);

  root = createRoot(iconContainer);
  root.render(
    <div style={{ pointerEvents: "auto" }}>
      <BookmarkIcon
        onClick={(e) => {
          // 5️⃣ Set the flag here too, for good measure
          isIconClicked = true;
          e.stopPropagation();
          if ((window as any).addInstantBookmarkFn) {
            (window as any).addInstantBookmarkFn(snippet, bubble);
          }
          removeIcon();
        }}
      />

      <AddNoteIcon
        onClick={(e) => {
          // 6️⃣ And here
          isIconClicked = true;
          e.stopPropagation();
          openPanelWithSnippet(snippet, bubble);
          removeIcon();
        }}
      />
    </div>
  );
}

function removeIcon() {
  if (iconContainer) {
    try {
      if (root) root.unmount();
    } catch {}
    iconContainer.remove();
  }
  iconContainer = null;
  root = null;
}

{
  /* <div className="flex flex-row w-[70px] h-full items-center justify-start gap-1" style={{ pointerEvents: "auto" }}>
      <BookmarkIcon
        onClick={(e) => {
          e.stopPropagation(); // prevent outside detection
          if ((window as any).addInstantBookmarkFn) {
            (window as any).addInstantBookmarkFn(snippet, bubble);
          }
          removeIcon(); // reliably remove icon
        }}
      />

      <AddNoteIcon
        onClick={(e) => {
          e.stopPropagation();
          openPanelWithSnippet(snippet, bubble);
          removeIcon(); // remove icon when opening form
        }}
      />
    </div> */
}
