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
