import type { BookmarkData, PinnedChat } from "./types";

const STORAGE_KEY = "chatmark_bookmarks";
const PINNED_CHATS_KEY = "chatmark_pinned_chats";

/**
 * Get bookmarks for a specific chat
 */
export async function getBookmarks(chatId: string): Promise<BookmarkData[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allBookmarks: Record<string, BookmarkData[]> = stored ? JSON.parse(stored) : {};
    const bookmarks = allBookmarks[chatId] || [];

    // ✅ Normalize roles
    return bookmarks.map((bm) => ({
      ...bm,
      role:
        bm.role === "assistant"
          ? "ChatGPT"
          : bm.role === "user"
          ? "User"
          : bm.role === "all"
          ? "All"
          : bm.role,
    }));
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
}

/**
 * 
 * Instant Bookmarking
 */
export async function addBookmark(chatId: string, newBookmark: BookmarkData): Promise<void> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allBookmarks: Record<string, BookmarkData[]> = stored ? JSON.parse(stored) : {};

    // Ensure we have an array for this chat
    if (!Array.isArray(allBookmarks[chatId])) {
      allBookmarks[chatId] = [];
    }

    // Append the new bookmark
    allBookmarks[chatId].push(newBookmark);

    // Save back to localStorage
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allBookmarks));
  } catch (error) {
    console.error("Error adding bookmark:", error);
  }
}

/**
 * Save bookmarks for a specific chat
 */
export async function saveBookmarks(chatId: string, bookmarks: BookmarkData[]): Promise<void> {
  try {
    if (!Array.isArray(bookmarks)) {
      console.error("Attempted to save non-array data as bookmarks");
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    const allBookmarks: Record<string, BookmarkData[]> = stored ? JSON.parse(stored) : {};

    allBookmarks[chatId] = bookmarks.length ? bookmarks : allBookmarks[chatId] || [];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allBookmarks));
  } catch (error) {
    console.error("Error saving bookmarks:", error);
  }
}

/**
 * Save a chat as a pinned chat
 */
export async function savePinnedChat(pinnedChat: PinnedChat): Promise<void> {
  try {
    const stored = localStorage.getItem(PINNED_CHATS_KEY);
    const pinnedChats: PinnedChat[] = stored ? JSON.parse(stored) : [];

    // Create pinned chat with timestamp
    const newPinnedChat: PinnedChat = pinnedChat;

    // Avoid duplicates (replace if chat with same id exists)
    const updatedPinnedChats = [
      ...pinnedChats.filter(chat => chat.id !== newPinnedChat.id),
      newPinnedChat,
    ];

    localStorage.setItem(PINNED_CHATS_KEY, JSON.stringify(updatedPinnedChats));
  } catch (error) {
    console.error("Error saving pinned chat:", error);
  }
}

/**
 * Get all pinned chats
 */
export async function getPinnedChats(): Promise<PinnedChat[]> {
  try {
    const stored = localStorage.getItem(PINNED_CHATS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error fetching pinned chats:", error);
    return [];
  }
}

/**
 * Remove a pinned chat by its ID
 */
export async function removePinnedChat(id: string): Promise<void> {
  try {
    const stored = localStorage.getItem(PINNED_CHATS_KEY);
    const pinnedChats: PinnedChat[] = stored ? JSON.parse(stored) : [];

    const updatedPinnedChats = pinnedChats.filter(chat => chat.id !== id);

    localStorage.setItem(PINNED_CHATS_KEY, JSON.stringify(updatedPinnedChats));
  } catch (error) {
    console.error("Error removing pinned chat:", error);
  }
}


/**
 * Get all bookmarks across all chats
 */
export async function getAllBookmarks(): Promise<Record<string, BookmarkData[]>> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Error fetching all bookmarks:", error);
    return {};
  }
}

/**
 * Clear all bookmarks
 */
export async function clearAllBookmarks(): Promise<void> {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Error clearing bookmarks:", error);
  }
}
