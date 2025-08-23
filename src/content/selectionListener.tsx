// src/content/selectionListener.tsx
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import BookmarkIcon from "./BookmarkIcon";
import { openPanelWithSnippet } from "./App";

let iconContainer: HTMLDivElement | null = null;
let root: Root | null = null;

export function initSelectionListener() {
  // Listen for mouseup instead of selectionchange
  document.addEventListener("mouseup", handleMouseUp);
  
  // Also listen for keyup to handle keyboard selections (Shift+Arrow keys, etc.)
  document.addEventListener("keyup", handleKeyUp);
  
  // Hide icon when user clicks elsewhere
  document.addEventListener("mousedown", removeIcon);
}

function handleMouseUp(event: MouseEvent) {
  // Small delay to let the selection settle
  setTimeout(() => {
    checkAndShowIcon();
  }, 50);
}

function handleKeyUp(event: KeyboardEvent) {
  // Only process if it might be a selection key
  if (event.shiftKey || ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
    setTimeout(() => {
      checkAndShowIcon();
    }, 50);
  }
}

function checkAndShowIcon() {
  console.log("Checking for selection...");
  
  const selection = window.getSelection();
  if (!selection || selection.toString().trim() === "") {
    removeIcon();
    return;
  }

  // Ensure there is a valid range
  if (selection.rangeCount === 0) {
    removeIcon();
    return;
  }

  console.log("Valid selection found: ", selection.toString());

  const range = selection.getRangeAt(0);
  const parentBubble = range.startContainer.parentElement?.closest(
    "[data-message-author-role]"
  ) as HTMLElement;

  if (!parentBubble) {
    console.log("Could not find parentBubble of the selection text");
    removeIcon();
    return;
  }
  console.log("parentBubble : ", parentBubble);

  const rect = range.getBoundingClientRect();
  if (!rect || rect.width === 0 || rect.height === 0) {
    removeIcon();
    return;
  }

  // Icon dimensions and spacing
  const iconWidth = 32;
  const iconHeight = 32;
  const gap = 8; // Gap from selection
  
  // Get selection bounds in viewport coordinates
  const selectionTop = rect.top;
  const selectionBottom = rect.bottom;
  const selectionLeft = rect.left;
  const selectionRight = rect.right;
  
  // Convert to document coordinates for absolute positioning
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
  
  // Calculate available space in viewport
  const spaceRight = window.innerWidth - selectionRight;
  const spaceLeft = selectionLeft;
  const spaceBelow = window.innerHeight - selectionBottom;
  const spaceAbove = selectionTop;
  
  let top: number;
  let left: number;
  
  // Strategy 1: Place to the right of selection (preferred)
  if (spaceRight >= iconWidth + gap) {
    left = selectionRight + scrollLeft + gap;
    top = selectionTop + scrollTop;
  }
  // Strategy 2: Place to the left of selection
  else if (spaceLeft >= iconWidth + gap) {
    left = selectionLeft + scrollLeft - iconWidth - gap;
    top = selectionTop + scrollTop;
  }
  // Strategy 3: Place below selection
  else if (spaceBelow >= iconHeight + gap) {
    top = selectionBottom + scrollTop + gap;
    left = selectionRight + scrollLeft - iconWidth; // Align with right edge of selection
  }
  // Strategy 4: Place above selection
  else if (spaceAbove >= iconHeight + gap) {
    top = selectionTop + scrollTop - iconHeight - gap;
    left = selectionRight + scrollLeft - iconWidth; // Align with right edge of selection
  }
  // Strategy 5: Force positioning (emergency)
  else {
    // Default to right side of selection with minimal spacing
    left = selectionRight + scrollLeft + 4;
    top = selectionTop + scrollTop;
  }
  
  // Ensure icon stays within document bounds
  const maxLeft = window.innerWidth + scrollLeft - iconWidth - 10;
  const maxTop = window.innerHeight + scrollTop - iconHeight - 10;
  const minLeft = scrollLeft + 10;
  const minTop = scrollTop + 10;
  
  left = Math.max(minLeft, Math.min(left, maxLeft));
  top = Math.max(minTop, Math.min(top, maxTop));

  console.log(`Positioning icon at: left=${left}, top=${top}`);
  console.log(`Selection bounds: top=${rect.top}, left=${rect.left}, bottom=${rect.bottom}, right=${rect.right}`);
  console.log(`Scroll: scrollTop=${scrollTop}, scrollLeft=${scrollLeft}`);

  renderIcon(top, left, selection.toString(), parentBubble);
}

function renderIcon(
  top: number,
  left: number,
  snippet: string,
  bubble: HTMLElement
) {
  if (!iconContainer) {
    iconContainer = document.createElement("div");
    // Ensure container doesn't interfere with positioning
    iconContainer.style.position = 'absolute';
    iconContainer.style.top = '0';
    iconContainer.style.left = '0';
    iconContainer.style.zIndex = '10000';
    iconContainer.style.pointerEvents = 'none';
    iconContainer.style.width = '100%';
    iconContainer.style.height = '100%';
    document.body.appendChild(iconContainer);
    root = createRoot(iconContainer);
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