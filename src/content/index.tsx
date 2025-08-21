// content/index.ts
import { createRoot } from "react-dom/client";
import App from "./App"; 
import "./content.css"; // Tailwind + custom styles

// Inject a root div into ChatGPT's DOM
const rootId = "chatmark-root";
let rootDiv = document.getElementById(rootId);

if (!rootDiv) {
  rootDiv = document.createElement("div");
  rootDiv.id = rootId;
  
  // Insert root div at the end of the body
  document.body.appendChild(rootDiv);
}

// Render the React UI
createRoot(rootDiv).render(<App />);
