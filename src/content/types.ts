
export interface BookmarkData {
  id: string;
  title: string;
  snippet: string; // truncated version of selection
  role: string;
  timestamp: number;
  anchor: string; // bubble ID
  selectionText: string; // full selection
  chatId: string;
  url?:string
}