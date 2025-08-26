
document.addEventListener("DOMContentLoaded", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];
    const container = document.querySelector(".popup-container");

    // If user is not on ChatGPT's chat
    if (!tab.url.includes("https://chatgpt.com/c/")) {
      container.innerHTML = `
        <p class="popup-text" style="text-align: center; margin-top: 40px;">
          The extension works only on ChatGPT's chats
        </p>
      `;
    }
  });
});
