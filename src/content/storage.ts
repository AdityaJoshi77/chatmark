const STORAGE_KEY = "chatmark_bookmarks";
import type { BookmarkData } from "./types";
export async function getBookmarks(chatId: string): Promise<BookmarkData[]> {
  try {
    const result = await chrome.storage.sync.get([STORAGE_KEY]);
    const allBookmarks: Record<string, BookmarkData[]> = result[STORAGE_KEY] || {};
    console.log('chatId received by Str : ', chatId);
    console.log('Bookmarks of current chat : ', allBookmarks[chatId]);
    return allBookmarks[chatId] || [];
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
}

export async function saveBookmarks(chatId: string, bookmarks: BookmarkData[]): Promise<void> {
  try {
    if (!Array.isArray(bookmarks)) {
      console.error("Attempted to save non-array data as bookmarks");
      return;
    }

    const result = await chrome.storage.sync.get([STORAGE_KEY]);
    const allBookmarks: Record<string, BookmarkData[]> = result[STORAGE_KEY] || {};

    // Always merge with existing for this chat
    const existing = allBookmarks[chatId] || [];
    allBookmarks[chatId] = bookmarks.length ? bookmarks : existing;

    await chrome.storage.sync.set({ [STORAGE_KEY]: allBookmarks });
  } catch (error) {
    console.error("Error saving bookmarks:", error);
  }
}


export async function getAllBookmarks(): Promise<Record<string, BookmarkData[]>> {
  try {
    const result = await chrome.storage.sync.get([STORAGE_KEY]);
    return result[STORAGE_KEY] || {};
  } catch (error) {
    console.error("Error fetching all bookmarks:", error);
    return {};
  }
}

export async function clearAllBookmarks(): Promise<void> {
  try {
    await chrome.storage.sync.set({ [STORAGE_KEY]: {} });
  } catch (error) {
    console.error("Error clearing bookmarks:", error);
  }
}
