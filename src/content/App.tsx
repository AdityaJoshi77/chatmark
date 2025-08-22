import { useState, useEffect } from "react";
import { MdBookmarkAdd, MdDeleteForever } from "react-icons/md";

import type { BookmarkData } from "./types";
import { getBookmarks, saveBookmarks, clearBookmarks } from "./storage";
import { dummyBookmarks } from "../dummyData";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>(dummyBookmarks);
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");

  useEffect(() => {
    const loadBookmarks = async () => {
      const stored = await getBookmarks();
      setBookmarks(stored);
    };

    loadBookmarks();
  }, []);

  // Save new bookmark
  const handleSave = async () => {
    if (!title.trim()) return;

    const newBookmark: BookmarkData = {
      id: Date.now().toString(),
      title,
      snippet: "Dummy snippet", // later will be from selection
      role: "user",
      timestamp: Date.now(),
      anchor: "sampleBubbleId",
      selectionText: "Dummy Selection Text",
    };

    const updated = [...bookmarks, newBookmark];
    setBookmarks(updated);
    setTitle("");
    setAdding(false);

    await saveBookmarks(updated);
  };

  // Dev-only: clear all bookmarks
  const handleClear = async () => {
    await clearBookmarks();
    setBookmarks([]);
  };

  return (
    <div className="bg-gray-700">
      {/* Floating Bookmark Button */}
      {!isOpen && (
        <button
          className="fixed top-40 right-6 flex items-center justify-center bg-gray-600 text-gray-100 w-10 h-10 rounded-full shadow-lg hover:bg-gray-500 transition cursor-pointer z-50"
          onClick={() => setIsOpen(!isOpen)}
          title="Open ChatMark"
        >
          <MdBookmarkAdd size={20} />
        </button>
      )}

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 dark:bg-gray-600 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-slate-300 dark:border-gray-500 pb-2 mb-4">
            <h2 className="text-lg font-bold dark:text-gray-200">Bookmarks</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-900 dark:bg-gray-400 px-2 py-1 rounded-md hover:dark:bg-gray-300 text-xs font-semibold cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Search Box */}
          {!adding && (
            <input
              type="text"
              placeholder="Search bookmarks..."
              className="border rounded px-3 py-2 mb-4 w-full dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300"
            />
          )}

          {/* Bookmarks List */}
          <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
            {bookmarks.length === 0 && !adding && (
              <p className="text-sm text-gray-500 dark:text-gray-300">
                No bookmarks yet
              </p>
            )}

            {bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="p-2 border border-gray-300 dark:border-gray-500 rounded dark:text-gray-200 flex justify-between items-start"
              >
                <div>
                  <p className="font-semibold">{bm.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-300 truncate">
                    {bm.snippet}
                  </p>
                </div>
                <button
                  onClick={async () => {
                    const updated = bookmarks.filter((b) => b.id !== bm.id);
                    setBookmarks(updated);
                    await saveBookmarks(updated);
                  }}
                  className="text-red-500 text-xs hover:text-red-400 ml-2"
                  title="Delete bookmark"
                >
                  <MdDeleteForever/>
                </button>
              </div>
            ))}

            {/* Add Bookmark Form */}
            {adding && (
              <div className="flex-grow p-3 border border-dashed border-gray-400 rounded-md bg-gray-50 dark:bg-gray-700">
                <label className="block text-sm font-semibold mb-1 dark:text-gray-200">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="border rounded px-2 py-1 w-full mb-2 text-sm dark:text-white placeholder:dark:text-gray-400"
                  placeholder="Enter bookmark title"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setAdding(false)}
                    className="px-3 py-1 text-sm rounded bg-gray-300 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-400 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-3 py-1 text-sm rounded bg-yellow-500 hover:bg-yellow-400 text-black font-semibold cursor-pointer"
                  >
                    Save
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Footer Buttons */}
          {!adding && (
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => setAdding(true)}
                className="bg-gray-400 font-semibold text-black px-4 py-2 rounded hover:bg-slate-300 transition cursor-pointer"
              >
                + Add Bookmark
              </button>

              {/* Dev-only Clear Button */}
              {import.meta.env.MODE === "development" && (
                <button
                  onClick={handleClear}
                  className="bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-400 transition cursor-pointer"
                >
                  Clear All (Dev)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
