import { useState, useEffect, useRef } from "react";
import {
  MdBookmarkAdd,
  MdDeleteForever,
  MdSearch,
  MdSort,
  MdBookmark,
  MdClose,
} from "react-icons/md";


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
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [chatId, setChatId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [snippet, setSnippet] = useState("");
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [showBookMarkForm, setShowBookMarkForm] = useState<boolean>(false);
  const [sortLatest, setSortLatest] = useState<boolean>(true);
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "assistant">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState<string>("");
  const panelRef = useRef<HTMLDivElement>(null);

  // setup openPanelFn once
  useEffect(() => {
    openPanelFn = (newSnippet?: string, bubble?: HTMLElement) => {
      setSnippet(newSnippet || "");
      setAnchor(bubble || null);
      setIsPanelOpen(true);
      setShowBookMarkForm(true);
    };
  }, []);

  // detect chatId from url
  useEffect(() => {
    const pathname = window.location.href;
    const id = pathname.split("/c/")[1] || "";
    setChatId(id);
  }, []);

  // periodic check for chatId
  useEffect(() => {
    const interval = setInterval(() => {
      const pathname = window.location.href;
      const id = pathname.split("/c/")[1] || "";
      setChatId(id);
    }, 2000);

    return () => clearInterval(interval);
  });

  // load bookmarks whenever chatId changes
  useEffect(() => {
    if (!chatId) return;
    const loadBookmarks = async () => {
      const stored = await getBookmarks(chatId);
      setBookmarks(stored);
    };
    loadBookmarks();
  }, [chatId]);

  // push content when panel opens
  useEffect(() => {
    const mainContent = document.querySelector(
      "main, .main, #root > div, body > div"
    );
    if (mainContent) {
      (mainContent as HTMLElement).style.transition =
        "margin-right 0.3s ease-out";
      (mainContent as HTMLElement).style.marginRight = isPanelOpen
        ? "320px"
        : "0";
    }

    return () => {
      if (mainContent) {
        (mainContent as HTMLElement).style.marginRight = "0";
      }
    };
  }, [isPanelOpen]);

  // close panel on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isPanelOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        setIsPanelOpen(false);
        setShowBookMarkForm(false);
        setSnippet("");
        setTitle("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPanelOpen]);

  const handleCancel = () => {
    setIsPanelOpen(false);
    setSnippet("");
    setShowBookMarkForm(false);
    setSearchQuery("");
  };

  const handleSave = async () => {
    if (!title.trim()) return;

    const newBookmark: BookmarkData = {
      id: Date.now().toString(),
      title,
      snippet,
      role: anchor?.dataset.messageAuthorRole!,
      timestamp: Date.now(),
      anchor: bubbleToSelector(anchor),
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

  const handleBookmarkClick = async (bm: BookmarkData) => {
    try {
      scrollToAndHighlight(bm.anchor, bm.snippet);
      setIsPanelOpen(false);
    } catch (err) {
      console.error("Failed to load highlighter:", err);
    }
  };

  const filteredBookmarks = bookmarks
    .filter((b) => roleFilter === "all" || b.role === roleFilter)
    .filter((b) =>
      [b.title, b.snippet]
        .join(" ")
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortLatest ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
    );

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      {!isPanelOpen && (
        <button
          className="fixed top-32 right-4 flex items-center justify-center 
                     bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300
                     w-10 h-10 rounded-full shadow-lg border border-gray-200 dark:border-gray-700
                     hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900  dark:hover:text-gray-100
                     transition-all duration-200 z-50"
          onClick={() => setIsPanelOpen(true)}
          title="Open ChatMark"
        >
          <MdBookmark size={18} />
        </button>
      )}

      <div
        ref={panelRef}
        className={`fixed top-0 right-0 h-full w-80 bg-white dark:bg-gray-800 
                   border-l border-gray-200 dark:border-gray-700
                   transform transition-transform duration-300 ease-out z-40
                   ${isPanelOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex justify-between items-center pb-3 mb-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <MdBookmark
                size={16}
                className="text-gray-600 dark:text-gray-300"
              />
              <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                Bookmarks
              </h2>
              <span className="text-xs text-gray-500 dark:text-gray-400">
                ({bookmarks.length})
              </span>
            </div>
            <button
              onClick={handleCancel}
              className="p-1 text-black dark:text-gray-300
                         hover:bg-gray-100 dark:hover:bg-gray-700 rounded 
                         transition-colors duration-200"
            >
              <MdClose size={16} />
            </button>
          </div>

          {!showBookMarkForm && (
            <>
              <div className="relative mb-3">
                <MdSearch
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={14}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-7 pr-3 py-2 text-sm rounded border border-gray-200 dark:border-gray-600
                           bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100
                           placeholder-gray-400 dark:placeholder-gray-500
                           focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 focus:border-gray-300
                           transition-colors duration-200"
                />
              </div>

              {bookmarks.length > 0 && (
                <div className="flex space-x-2 mb-4">
                  <button
                    onClick={() => setSortLatest(!sortLatest)}
                    className="flex items-center space-x-1 px-2 py-1 text-xs rounded
                             bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600
                             text-gray-600 dark:text-gray-300 transition-colors duration-200"
                  >
                    <MdSort size={12} />
                    <span>{sortLatest ? "Latest" : "Oldest"}</span>
                  </button>

                  <select
                    value={roleFilter}
                    onChange={(e) =>
                      setRoleFilter(
                        e.target.value as "all" | "user" | "assistant"
                      )
                    }
                    className="px-2 py-1 text-xs rounded border border-gray-200 dark:border-gray-600
                             bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300
                             focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-600 cursor-pointer"
                  >
                    <option value="all">All</option>
                    <option value="user">User</option>
                    <option value="assistant">Assistant</option>
                  </select>
                </div>
              )}
            </>
          )}

          {showBookMarkForm && (
            <div className="border border-gray-200 dark:border-gray-600 rounded p-3 mb-4 bg-gray-50 dark:bg-gray-700">
              <label className="block text-xs font-medium mb-2 text-gray-700 dark:text-gray-300">
                Title
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
                placeholder="Enter title..."
                autoFocus
              />

              <div className="bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-600 p-2 mb-3">
                <p className="text-xs text-gray-600 dark:text-gray-400 italic">
                  "{snippet}"
                </p>
              </div>

              <div className="flex justify-end space-x-2">
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 text-xs bg-gray-900 dark:bg-gray-600 text-white
                           hover:bg-gray-800 dark:hover:bg-gray-500 rounded
                           transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={!title.trim()}
                  className="px-3 py-1 text-xs text-gray-600 dark:text-black
                            bg-gray-300 dark:bg-gray-500
                           hover:bg-gray-100 dark:hover:bg-gray-300 rounded
                           disabled:opacity-50 disabled:cursor-not-allowed
                           transition-colors duration-200"
                >
                  Save
                </button>
              </div>
            </div>
          )}

          {!showBookMarkForm && (
            <div className="flex-1 overflow-hidden">
              {filteredBookmarks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 text-center">
                  <MdBookmark
                    size={24}
                    className="text-gray-300 dark:text-gray-600 mb-2"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {searchQuery ? "No matches" : "No bookmarks"}
                  </p>
                </div>
              ) : (
                <div className="space-y-2 h-full overflow-y-auto custom-scrollbar">
                  {filteredBookmarks.map((bm) => (
                    <div
                      key={bm.id}
                      className="group p-3 rounded border border-gray-200 dark:border-gray-700
                               bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750
                               cursor-pointer transition-colors duration-200"
                      onClick={() => handleBookmarkClick(bm)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate flex-1 mr-2">
                          {bm.title}
                        </h3>
                        <button
                          onClick={async (e) => {
                            e.stopPropagation();
                            const updated = bookmarks.filter(
                              (b) => b.id !== bm.id
                            );
                            setBookmarks(updated);
                            await saveBookmarks(chatId, updated);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-600
                                   hover:bg-gray-100 dark:hover:bg-gray-700 rounded
                                   transition-all duration-200"
                          title="Delete"
                        >
                          <MdDeleteForever size={18} />
                        </button>
                      </div>

                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
                        {bm.snippet}
                      </p>

                      <div className="flex justify-between items-center">
                        <span className="text-xs px-2 py-0.5 rounded text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700">
                          {bm.role}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">
                          {formatTime(bm.timestamp)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #9ca3af #f9fafb;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f9fafb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #9ca3af;
          border-radius: 10px;
          border: 2px solid #f9fafb;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #6b7280;
        }
        .dark .custom-scrollbar {
          scrollbar-color: #4b5563 #1f2937;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-track {
          background: #1f2937;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #4b5563;
          border: 2px solid #1f2937;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #6b7280;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .dark .bg-gray-750 {
          background-color: rgb(55, 65, 81);
        }
        .dark .hover\\:bg-gray-750:hover {
          background-color: rgb(55, 65, 81);
        }
      `}</style>
    </div>
  );
}

function bubbleToSelector(el: Element | null): string {
  if (!el) return "";
  const id = el.getAttribute("data-message-id");
  return id ? `[data-message-id="${id}"]` : "";
}

export default App;
