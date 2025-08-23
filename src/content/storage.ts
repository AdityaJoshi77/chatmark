// src/content/storage.ts
import type { BookmarkData } from "./types";

const STORAGE_KEY = "chatmark_bookmarks";

export async function getBookmarks(chatId: string): Promise<BookmarkData[]> {
  try {
    const result = await chrome.storage.sync.get([STORAGE_KEY]);
    const currentChatBookmarks = result[STORAGE_KEY].filter((bm: BookmarkData) => bm.chatId === chatId)
    return (currentChatBookmarks as BookmarkData[]) || [];
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

