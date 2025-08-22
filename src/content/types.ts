
export interface BookmarkData {
  id: string;
  title: string;
  snippet: string; // truncated version of selection
  role: "user" | "assistant";
  timestamp: number;
  anchor: string; // bubble ID
  selectionText: string; // full selection
}