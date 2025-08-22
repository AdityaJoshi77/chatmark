// src/content/storage.ts
import type { BookmarkData } from "./types";

const STORAGE_KEY = "chatmark_bookmarks";

export async function getBookmarks(): Promise<BookmarkData[]> {
  try {
    const result = await chrome.storage.sync.get([STORAGE_KEY]);
    return (result[STORAGE_KEY] as BookmarkData[]) || [];
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
}

export async function saveBookmarks(bookmarks: BookmarkData[]): Promise<void> {
  try {
    await chrome.storage.sync.set({ [STORAGE_KEY]: bookmarks });
  } catch (error) {
    console.error("Error saving bookmarks:", error);
  }
}

export async function clearBookmarks(): Promise<void> {
  try {
    await chrome.storage.sync.remove(STORAGE_KEY);
    console.log("All bookmarks cleared.");
  } catch (error) {
    console.error("Error clearing bookmarks:", error);
  }
}
