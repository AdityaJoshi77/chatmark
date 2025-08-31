// src/content/content-entry.ts
import "./content.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initSelectionListener } from "./selectionListener";

const rootId = "chatmark-root";

function injectApp() {
  // Check for the element and prevent re-injection
  if (document.getElementById(rootId)) {
    console.log("ChatMark root already exists. Not re-injecting.");
    return;
  }

  const mainChatContainerSelector = 'main[class*="overflow-y-auto"]';
  let mainChatContainer = document.querySelector(mainChatContainerSelector);

  if (!mainChatContainer) {
    mainChatContainer = document.body;
    console.log("Main chat container not found, using body as fallback.");
  }

  const rootDiv = document.createElement("div");
  rootDiv.id = rootId;
  mainChatContainer.appendChild(rootDiv);

  createRoot(rootDiv).render(<App />);
  initSelectionListener();

  console.log("✅ ChatMark injected!");
}

// Add a MutationObserver to watch for DOM changes
// This is more robust for SPAs as it detects content changes, not just URL changes.
const observer = new MutationObserver((mutations) => {
  // Check if the main content area has been updated.
  // A simple check can be if a new 'main' element has appeared
  // or if a chat message div is added.
  const mainChatContainer = document.querySelector(
    'main[class*="overflow-y-auto"]'
  );
  if (mainChatContainer && !document.getElementById(rootId)) {
    console.log("DOM updated, re-injecting ChatMark.");
    injectApp();
  }
});

// Start observing the body for child list changes and subtree modifications
observer.observe(document.body, { childList: true, subtree: true });

// You can still keep the initial injection with a delay for the first load
setTimeout(() => {
  injectApp();
}, 1250);
