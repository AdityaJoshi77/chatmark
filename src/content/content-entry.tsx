

// src/content/content-entry.ts
import "./content.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initSelectionListener } from "./selectionListener";

const rootId = "chatmark-root";

function injectApp() {
  const mainChatContainerSelector = 'main[class*="overflow-y-auto"]';
  let mainChatContainer = document.querySelector(mainChatContainerSelector);

  if (!mainChatContainer) {
    mainChatContainer = document.body; // fallback
  }

  if (document.getElementById(rootId)) return; // prevent duplicates

  const rootDiv = document.createElement("div");
  rootDiv.id = rootId;
  mainChatContainer.appendChild(rootDiv);

  createRoot(rootDiv).render(<App />);
  initSelectionListener();

  console.log("✅ ChatMark injected!");
}

// Delay the injection a bit to let the DOM settle
setTimeout(() => {
  injectApp();
}, 1250); // you can experiment: 500ms, 800ms, 1500ms
