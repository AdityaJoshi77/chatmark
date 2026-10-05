const MESSAGE_SELECTOR = [
  "[data-message-author-role]",
  "[data-message-id]",
  "[data-turn-id]",
  '[data-testid="user-message"]',
  '[data-testid="assistant-message"]',
  'article[data-testid^="conversation-turn-"]',
].join(",");

function asElement(node: Node | null): Element | null {
  if (!node) return null;
  return node.nodeType === Node.ELEMENT_NODE
    ? (node as Element)
    : node.parentElement;
}

function escapeAttribute(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function getConversationId(location = window.location): string {
  const match = location.pathname.match(/\/c\/([^/]+)/);
  return match ? decodeURIComponent(match[1]) : "";
}

export function findMessageElement(node: Node | null): HTMLElement | null {
  const element = asElement(node);
  if (!element || element.closest("#chatmark-root")) return null;

  const message = element.closest(MESSAGE_SELECTOR) as HTMLElement | null;
  if (message) return message;

  // ChatGPT occasionally moves identifying attributes onto a child of the
  // selected Markdown block. In that layout, find the surrounding turn first.
  const article = element.closest("article");
  if (
    article?.querySelector(
      '[data-message-author-role], [data-message-id], [data-turn-id], [data-testid="user-message"], [data-testid="assistant-message"]'
    )
  ) {
    return article;
  }

  // Keep selection actions available when ChatGPT changes or temporarily omits
  // its private message attributes. Restrict this fallback to conversation text.
  const main = element.closest("main");
  if (main) {
    const textBlock = element.closest(
      '.markdown, [class*="markdown"], [class*="message"], [class*="prose"]'
    );
    return (textBlock || element) as HTMLElement;
  }

  return null;
}

export function getMessageRole(message: HTMLElement): "User" | "ChatGPT" {
  if (
    message.matches('[data-testid="user-message"]') ||
    message.querySelector('[data-testid="user-message"]')
  ) {
    return "User";
  }

  const roleElement = message.matches("[data-message-author-role]")
    ? message
    : message.querySelector<HTMLElement>("[data-message-author-role]");

  return roleElement?.dataset.messageAuthorRole === "user" ? "User" : "ChatGPT";
}

export function messageToSelector(message: Element | null): string {
  if (!message) return "";

  const attributes = ["data-message-id", "data-turn-id", "data-testid"];
  for (const attribute of attributes) {
    const value = message.getAttribute(attribute);
    if (value) return `[${attribute}="${escapeAttribute(value)}"]`;
  }

  const nested = message.querySelector<HTMLElement>(
    '[data-message-id], [data-turn-id], [data-testid^="conversation-turn-"]'
  );
  if (nested) return messageToSelector(nested);

  return "";
}
