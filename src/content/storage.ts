// src/content/storage.ts
import type { BookmarkData } from "./types";

const STORAGE_KEY = "chatmark_bookmarks";

export async function getBookmarks(chatId: string): Promise<BookmarkData[]> {
  try {
    const result = await chrome.storage.sync.get([STORAGE_KEY]);
    
    // Handle case where storage is empty or undefined
    const allBookmarks = result[STORAGE_KEY] || [];
    
    // Ensure allBookmarks is an array before filtering
    if (!Array.isArray(allBookmarks)) {
      console.warn("Stored bookmarks data is not an array, resetting to empty array");
      return [];
    }
    
    const currentChatBookmarks = allBookmarks.filter((bm: BookmarkData) => bm.chatId === chatId);
    return currentChatBookmarks;
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
}

export async function saveBookmarks(bookmarks: BookmarkData[]): Promise<void> {
  try {
    // Validate that bookmarks is an array
    if (!Array.isArray(bookmarks)) {
      console.error("Attempted to save non-array data as bookmarks");
      return;
    }
    
    await chrome.storage.sync.set({ [STORAGE_KEY]: bookmarks });
  } catch (error) {
    console.error("Error saving bookmarks:", error);
  }
}

// Optional: Helper function to get all bookmarks (useful for debugging)
export async function getAllBookmarks(): Promise<BookmarkData[]> {
  try {
    const result = await chrome.storage.sync.get([STORAGE_KEY]);
    const allBookmarks = result[STORAGE_KEY] || [];
    
    if (!Array.isArray(allBookmarks)) {
      console.warn("Stored bookmarks data is not an array, resetting to empty array");
      return [];
    }
    
    return allBookmarks;
  } catch (error) {
    console.error("Error fetching all bookmarks:", error);
    return [];
  }
}

// Optional: Helper function to clear all bookmarks (useful for debugging)
export async function clearAllBookmarks(): Promise<void> {
  try {
    await chrome.storage.sync.set({ [STORAGE_KEY]: [] });
  } catch (error) {
    console.error("Error clearing bookmarks:", error);
  }
}