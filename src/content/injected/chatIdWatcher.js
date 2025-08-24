
(() => {
  const sendChatId = () => {
    const id = window.location.href.split("/c/")[1] || "";
    window.postMessage({ type: "CHAT_ID_CHANGE", chatId: id }, "*");
  };

  // Patch history
  const originalPush = history.pushState;
  const originalReplace = history.replaceState;

  history.pushState = function (...args) {
    originalPush.apply(this, args);
    sendChatId();
  };

  history.replaceState = function (...args) {
    originalReplace.apply(this, args);
    sendChatId();
  };

  window.addEventListener("popstate", sendChatId);

  sendChatId(); // initial fire
})();
