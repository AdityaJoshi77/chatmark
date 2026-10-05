

// src/content/content-entry.ts
import "./content.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import { initSelectionListener } from "./selectionListener";

const rootId = "chatmark-root";

function injectApp() {
  if (document.getElementById(rootId)) return; // prevent duplicates
  if (!document.body) return;

  const rootDiv = document.createElement("div");
  rootDiv.id = rootId;
  // ChatGPT frequently replaces its main subtree during navigation and streaming.
  // Mount directly under body so those rerenders cannot remove the extension.
  document.body.appendChild(rootDiv);

  createRoot(rootDiv).render(<App />);
  initSelectionListener();

  console.log("✅ ChatMark injected!");
}

injectApp();

// Recover if ChatGPT (or another extension) replaces the body contents.
const observer = new MutationObserver(injectApp);
observer.observe(document.documentElement, { childList: true, subtree: true });
