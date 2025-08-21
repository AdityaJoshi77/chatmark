// src/content/content-entry.ts
import "./content.css"; // Tailwind + custom styles
import { createRoot } from "react-dom/client";
import App from "./App";

// Inject root div into ChatGPT's DOM
const rootId = "chatmark-root";
let rootDiv = document.getElementById(rootId);
if (!rootDiv) {
  rootDiv = document.createElement("div");
  rootDiv.id = rootId;
  document.body.appendChild(rootDiv);
}

// Render React UI
createRoot(rootDiv).render(<App />);
