export interface Note {
  title: string;
  content: string;
}

export interface BookmarkData {
  id: string;             // Date.now().toString()
  chatId: string;         // Chat ID from URL
  userId?: string;        // UUID (for future MongoDB)
  title: string;          // Bookmark title
  snippet: string;        // Truncated selection
  role: string;           // 'user' | 'assistant'
  timestamp: number;
  anchor: string;         // Bubble ID
  selectionText: string;  // Full selection
  url?: string;
  notes?: Note[];         // Optional array of notes
}

export interface PinnedChat {
  id: string;           // Unique chat identifier from the URL (everything after /c/)
  title: string;        // User-defined title for the chat
  description?: string; // Optional short description/context about the chat
  url: string;          // Full URL of the chat
  datePinned: string;   // ISO timestamp of when the chat was pinned
  tags?: string[];       // Categories/tags applied by the user
}



