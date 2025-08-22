import { useState, useEffect } from "react";
import { MdBookmarkAdd, MdDeleteForever } from "react-icons/md";
import { dummyBookmarks } from "../dummyData";
import type { BookmarkData } from "./types";
import { getBookmarks, saveBookmarks } from "./storage";
import { scrollToAndHighlight } from "./scrollAndHighlight";

// Function called by the floating selection icon
let openPanelFn: (snippet?: string, bubble?: HTMLElement) => void;
export function openPanelWithSnippet(snippet?: string, bubble?: HTMLElement) {
  if (openPanelFn) openPanelFn(snippet, bubble);
}

function App() {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>(dummyBookmarks);
  const [title, setTitle] = useState("");
  const [snippet, setSnippet] = useState("");
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [showBookMarkForm, setShowBookMarkForm] = useState<boolean>(false);
  const [sortLatest, setSortLatest] = useState<boolean>(true);
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "assistant">(
    "all"
  );

  useEffect(() => {
    openPanelFn = (newSnippet?: string, bubble?: HTMLElement) => {
      setSnippet(newSnippet || "");
      setAnchor(bubble || null);
      setIsPanelOpen(true);
      setShowBookMarkForm(true);
    };

    const loadBookmarks = async () => {
      const stored = await getBookmarks();
      setBookmarks(stored);
    };
    loadBookmarks();
  }, []);

  // Cancel bookmarking or close the panel
  const handleCancel = () => {
    setIsPanelOpen(false);
    setSnippet("");
    setShowBookMarkForm(false);
  };

  // Save new bookmark
  const handleSave = async () => {
    if (!title.trim()) return;

    const newBookmark: BookmarkData = {
      id: Date.now().toString(),
      title,
      snippet, // from selection
      role: anchor?.dataset.messageAuthorRole!,
      timestamp: Date.now(),
      anchor: bubbleToSelector(anchor),
      selectionText: snippet,
      url: window.location.href,
    };

    const updated = [...bookmarks, newBookmark];
    setBookmarks(updated);
    setTitle("");
    setSnippet("");
    setAnchor(null);
    setIsPanelOpen(false);

    await saveBookmarks(updated);
  };

  // Bookmark click → scroll and highlight
  const handleBookmarkClick = async (bm: BookmarkData) => {
    try {
      scrollToAndHighlight(bm.anchor, bm.snippet);
    } catch (err) {
      console.error("Failed to load highlighter:", err);
    }
  };

  // Filter and sort bookmarks
  const filteredBookmarks = bookmarks
    .filter((b) => roleFilter === "all" || b.role === roleFilter)
    .sort((a, b) =>
      sortLatest ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
    );

  return (
    <div className="bg-gray-700">
      {/* Floating Bookmark Button */}
      {!isPanelOpen && (
        <button
          className="fixed top-40 right-6 flex items-center justify-center bg-gray-600 text-gray-100 w-10 h-10 rounded-full shadow-lg hover:bg-gray-500 transition cursor-pointer z-50"
          onClick={() => setIsPanelOpen(!isPanelOpen)}
          title="Open ChatMark"
        >
          <MdBookmarkAdd size={20} />
        </button>
      )}

      {/* Side Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-80 dark:bg-gray-600 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-40
          ${isPanelOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-4 h-full flex flex-col">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-slate-300 dark:border-gray-500 pb-2 mb-4">
            <h2 className="text-lg font-bold dark:text-gray-200">Bookmarks</h2>
            <button
              onClick={handleCancel}
              className="text-gray-900 dark:bg-gray-400 px-2 py-1 rounded-md hover:dark:bg-gray-300 text-xs font-semibold cursor-pointer"
            >
              ✕
            </button>
          </div>

          {/* Search Box */}
          {!showBookMarkForm && (
            <>
              <input
                type="text"
                placeholder="Search bookmarks..."
                className="border rounded px-3 py-2 mb-2 w-full dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-300"
              />

              {/* Render sort/filter buttons only if there are bookmarks */}
              {bookmarks.length >= 0 && (
                <div className="flex space-x-2 mb-4">
                  <button
                    onClick={() => setSortLatest(!sortLatest)}
                    className="flex-1 px-2 py-1 text-sm rounded bg-gray-300 hover:bg-gray-200 dark:bg-gray-500 dark:hover:bg-gray-400 cursor-pointer text-black"
                  >
                    Sort: {sortLatest ? "Latest" : "Earliest"}
                  </button>

                  <select
                    value={roleFilter}
                    onChange={(e) =>
                      setRoleFilter(
                        e.target.value as "all" | "user" | "assistant"
                      )
                    }
                    className="flex-1 px-2 py-1 text-sm rounded border dark:bg-gray-500 dark:text-white cursor-pointer"
                  >
                    <option value="all">All Roles</option>
                    <option value="user">User</option>
                    <option value="assistant">Assistant</option>
                  </select>
                </div>
              )}
            </>
          )}

          {/* Add Bookmark Form */}
          {showBookMarkForm && (
            <div className="flex-grow p-3 border border-dashed border-gray-400 rounded-md bg-gray-50 dark:bg-gray-700 mb-4">
              <label className="block text-sm font-semibold mb-1 dark:text-gray-200">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border rounded px-2 py-1 w-full mb-2 text-sm dark:text-black placeholder:dark:text-gray-700"
                placeholder="Enter bookmark title"
              />
              <p className="text-xs text-gray-500 truncate">{snippet}</p>
              <div className="flex justify-end space-x-2 mt-2">
                <button
                  onClick={handleCancel}
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

          {/* Bookmarks List */}
          {!showBookMarkForm && (
            <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar">
              {filteredBookmarks.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-300">
                  No bookmarks yet
                </p>
              )}
              {filteredBookmarks.map((bm) => (
                <div
                  key={bm.id}
                  className="p-2 border border-gray-300 dark:border-gray-500 rounded dark:text-gray-200 flex justify-between items-start cursor-pointer"
                  onClick={() => handleBookmarkClick(bm)}
                >
                  <div>
                    <p className="font-semibold">{bm.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-300 truncate">
                      {bm.snippet}
                    </p>
                  </div>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      const updated = bookmarks.filter((b) => b.id !== bm.id);
                      setBookmarks(updated);
                      await saveBookmarks(updated);
                    }}
                    className="text-red-500 text-xs hover:text-red-400 ml-2"
                    title="Delete bookmark"
                  >
                    <MdDeleteForever size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// helper: convert bubble element to a reliable CSS selector
function bubbleToSelector(el: Element | null): string {
  if (!el) return "";
  const id = el.getAttribute("data-message-id");
  return id ? `[data-message-id="${id}"]` : "";
}

export default App;
