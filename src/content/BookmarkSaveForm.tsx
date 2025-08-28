import { useState } from "react";
import { bubbleToSelector } from "./App";
import { saveBookmarks } from "./storage";
import type { BookmarkData } from "./types";

interface BookmarkSaveFormProps {
  snippet: string;
  chatId: string;
  anchor: HTMLElement | null;
  bookmarks: BookmarkData[];
  setSnippet: React.Dispatch<React.SetStateAction<string>>;
  setAnchor: React.Dispatch<React.SetStateAction<HTMLElement | null>>;
  setBookmarks: React.Dispatch<React.SetStateAction<BookmarkData[]>>;
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setShowBookMarkForm: React.Dispatch<React.SetStateAction<boolean>>;
}

// HANDLE SAVE
const handleSave = async (
  title: string,
  snippet: string,
  chatId: string,
  anchor: HTMLElement | null,
  bookmarks: BookmarkData[],
  setSnippet: React.Dispatch<React.SetStateAction<string>>,
  setIsPanelOpen: React.Dispatch<React.SetStateAction<boolean>>,
  setAnchor: React.Dispatch<React.SetStateAction<HTMLElement | null>>,
  setBookmarks: React.Dispatch<React.SetStateAction<BookmarkData[]>>,
  setShowBookMarkForm: React.Dispatch<React.SetStateAction<boolean>>,
  setTitle: React.Dispatch<React.SetStateAction<string>>
) => {
  if (!chatId) return; // <-- wait for chatId
  if (!snippet.trim()) return;

  const newBookmark: BookmarkData = {
    id: Date.now().toString(),
    title,
    snippet,
    role: anchor?.dataset.messageAuthorRole! === "user" ? "User" : "ChatGPT",
    timestamp: Date.now(),
    anchor: bubbleToSelector(anchor), // ✅ safe null check
    selectionText: snippet,
    chatId,
    url: window.location.href,
  };

  const updated = [...bookmarks, newBookmark];
  setBookmarks(updated);
  setTitle("");
  setSnippet("");
  setAnchor(null);
  setShowBookMarkForm(false);
  setIsPanelOpen(false);

  await saveBookmarks(chatId, updated);
};

const BookmarkSaveForm = ({
  snippet,
  chatId,
  anchor,
  bookmarks,
  setSnippet,
  setIsPanelOpen,
  setAnchor,
  setBookmarks,
  setShowBookMarkForm,
}: BookmarkSaveFormProps) => {
  const [title, setTitle] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault(); // ✅ prevent page reload
        handleSave(
          title,
          snippet,
          chatId,
          anchor,
          bookmarks, // ✅ fixed missing argument
          setSnippet,
          setIsPanelOpen,
          setAnchor,
          setBookmarks,
          setShowBookMarkForm,
          setTitle
        );
      }}
      className="border border-gray-200 dark:border-gray-600 rounded p-3 mb-4 bg-gray-50 dark:bg-gray-700"
    >
      {/* Titular Snippet of the Bookmark */}
      <label className="block text-xs font-medium mb-2 text-gray-700 dark:text-gray-50">
        Title Snippet: 
      </label>
      <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 p-2 mb-3">
        <p className="text-gray-600 dark:text-gray-50">
          "{snippet}"
        </p>
      </div>


      <label className="block text-xs font-medium mb-2 text-gray-700 dark:text-gray-50">
        About {'(Optional)'}: 
      </label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 text-sm rounded border border-gray-200 dark:border-gray-600
             bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
             placeholder-gray-400 dark:placeholder-gray-500
             focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600
             transition-colors duration-200 mb-3"
        placeholder="Something to remember the bookmark..."
        autoFocus
      />

      <div className="flex justify-end space-x-2">
        <button
          type="button" // ✅ prevent accidental submit on cancel
          onClick={() => {
            setSnippet("");
            setIsPanelOpen(false);
            setShowBookMarkForm(false);
          }}
          className="px-3 py-1 text-xs bg-gray-900 dark:bg-gray-600 text-white
               hover:bg-gray-800 dark:hover:bg-gray-500 rounded
               transition-colors duration-200"
        >
          Cancel
        </button>
        <button
          type="submit" // ✅ submits the form
          disabled={!snippet.trim() || !chatId}
          className="px-3 py-1 text-xs text-gray-600 dark:text-black
                bg-gray-300 dark:bg-gray-500
               hover:bg-gray-100 dark:hover:bg-gray-300 rounded
               disabled:opacity-50 disabled:cursor-not-allowed
               transition-colors duration-200"
        >
          Save
        </button>
      </div>
    </form>
  );
};

export default BookmarkSaveForm;
