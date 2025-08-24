import type { BookmarkData } from "./types";

const STORAGE_KEY = "chatmark_bookmarks";

/**
 * Get bookmarks for a specific chat
 */
export async function getBookmarks(chatId: string): Promise<BookmarkData[]> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const allBookmarks: Record<string, BookmarkData[]> = stored ? JSON.parse(stored) : {};
    console.log("chatId received by local storage:", chatId);
    console.log("Bookmarks of current chat:", allBookmarks[chatId]);
    return allBookmarks[chatId] || [];
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
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
