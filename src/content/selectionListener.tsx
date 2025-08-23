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

  // Get viewport dimensions for boundary checking
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  // Icon dimensions and spacing
  const iconWidth = 32;
  const iconHeight = 32;
  const minGap = 4; // Minimal gap from selection
  const safeGap = 12; // Preferred gap from selection
  
  // Get the selection's visual bounds more precisely
  const selectionTop = rect.top + window.scrollY;
  const selectionBottom = rect.bottom + window.scrollY;
  const selectionLeft = rect.left + window.scrollX;
  const selectionRight = rect.right + window.scrollX;
  
  // Calculate available space in all directions
  const spaceRight = viewportWidth + window.scrollX - selectionRight;
  const spaceLeft = selectionLeft - window.scrollX;
  const spaceBelow = viewportHeight + window.scrollY - selectionBottom;
  const spaceAbove = selectionTop - window.scrollY;
  
  let top: number;
  let left: number;
  
  // Strategy 1: Try to place to the right of selection (most common)
  if (spaceRight >= iconWidth + safeGap) {
    left = selectionRight + safeGap;
    // Vertically align with top of selection, but ensure it stays in viewport
    top = Math.max(
      window.scrollY + 10, // Minimum distance from top
      Math.min(
        selectionTop, // Align with selection start
        window.scrollY + viewportHeight - iconHeight - 10 // Maximum distance from bottom
      )
    );
  }
  // Strategy 2: Try to place to the left of selection
  else if (spaceLeft >= iconWidth + safeGap) {
    left = selectionLeft - iconWidth - safeGap;
    top = Math.max(
      window.scrollY + 10,
      Math.min(
        selectionTop,
        window.scrollY + viewportHeight - iconHeight - 10
      )
    );
  }
  // Strategy 3: Try to place below selection
  else if (spaceBelow >= iconHeight + safeGap) {
    top = selectionBottom + safeGap;
    // Horizontally align but keep within viewport
    left = Math.max(
      window.scrollX + 10,
      Math.min(
        selectionRight - iconWidth + 10, // Slight offset from right edge
        window.scrollX + viewportWidth - iconWidth - 10
      )
    );
  }
  // Strategy 4: Try to place above selection
  else if (spaceAbove >= iconHeight + safeGap) {
    top = selectionTop - iconHeight - safeGap;
    left = Math.max(
      window.scrollX + 10,
      Math.min(
        selectionRight - iconWidth + 10,
        window.scrollX + viewportWidth - iconWidth - 10
      )
    );
  }
  // Strategy 5: Emergency positioning - use minimal gaps and force into viewport
  else {
    // Find the side with most space and use minimal gap
    if (spaceRight >= spaceLeft && spaceRight >= minGap + iconWidth) {
      left = selectionRight + minGap;
    } else if (spaceLeft >= minGap + iconWidth) {
      left = selectionLeft - iconWidth - minGap;
    } else {
      // Force horizontal position with minimum viewport margin
      left = Math.max(10, Math.min(selectionLeft, window.scrollX + viewportWidth - iconWidth - 10));
    }
    
    // Vertical positioning with emergency fallback
    if (spaceBelow >= spaceAbove && spaceBelow >= minGap + iconHeight) {
      top = selectionBottom + minGap;
    } else if (spaceAbove >= minGap + iconHeight) {
      top = selectionTop - iconHeight - minGap;
    } else {
      // Force vertical position with minimum viewport margin
      top = Math.max(window.scrollY + 10, Math.min(selectionTop, window.scrollY + viewportHeight - iconHeight - 10));
    }
  }
  
  // Final safety bounds - ensure icon never goes outside viewport
  left = Math.max(window.scrollX + 5, Math.min(left, window.scrollX + viewportWidth - iconWidth - 5));
  top = Math.max(window.scrollY + 5, Math.min(top, window.scrollY + viewportHeight - iconHeight - 5));

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
    // Add some base styles to ensure proper positioning
    iconContainer.style.position = 'absolute';
    iconContainer.style.zIndex = '10000';
    iconContainer.style.pointerEvents = 'none'; // Allow clicking through container
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