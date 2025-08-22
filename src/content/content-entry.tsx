// src/content/content-entry.ts
import "./content.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initSelectionListener } from "./selectionListener";

// Inject root div into the ChatGPT UI container
const mainChatContainerSelector = 'main[class*="overflow-y-auto"]';
let mainChatContainer = document.querySelector(mainChatContainerSelector);

if (!mainChatContainer) {
  // Fallback for different DOM structures
  mainChatContainer = document.body;
}

const rootId = "chatmark-root";
let rootDiv = document.getElementById(rootId);
if (!rootDiv) {
  rootDiv = document.createElement("div");
  rootDiv.id = rootId;
  mainChatContainer.appendChild(rootDiv);
}

// Render React UI
createRoot(rootDiv).render(<App />);

// Initialize the selection listener AFTER the App component is rendered,
// ensuring openPanelWithSnippet is available.
initSelectionListener();

console.log("ChatMark content script loaded and initialized.");