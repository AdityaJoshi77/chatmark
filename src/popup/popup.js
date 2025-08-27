document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".popup-container");
  const logo = document.getElementById("ChatMark_Logo");

  // Redirect to Web Store when logo is clicked
  if (logo) {
    logo.addEventListener("click", () => {
      chrome.tabs.create({
        url: "https://chromewebstore.google.com/detail/jkdclcljnfbbnfnbkiokfcanncaejcea" // <-- replace with your extension ID
      });
    });
  }

  // Check current tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tab = tabs[0];

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
