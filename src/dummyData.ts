
// dummBook.ts

export interface Bookmark {
  id: number;
  title: string;
  snippet: string;
}

export const dummyBookmarks: Bookmark[] = [
  {
    id: 1,
    title: "UX Tip 1",
    snippet: "Use consistent spacing and padding to improve readability."
  },
  {
    id: 2,
    title: "UX Tip 2",
    snippet: "Keep primary actions above the fold for better engagement."
  },
  {
    id: 3,
    title: "React Hook",
    snippet: "useState allows you to manage local component state."
  },
  {
    id: 4,
    title: "CSS Trick",
    snippet: "Use line-clamp to truncate long text elegantly."
  },
  {
    id: 5,
    title: "Bookmark Design",
    snippet: "Borders highlight selection without annoying background tints."
  },
  {
    id: 6,
    title: "Accessibility",
    snippet: "Ensure sufficient contrast for text in dark mode."
  },
  {
    id: 7,
    title: "UX Microcopy",
    snippet: "Place clear labels on buttons to improve user understanding."
  },
  {
    id: 8,
    title: "Performance Tip",
    snippet: "Avoid unnecessary renders by using React.memo or useCallback."
  },
  {
    id: 9,
    title: "Dark Mode",
    snippet: "Use dark gray instead of pure black for comfortable reading."
  },
  {
    id: 10,
    title: "Scrollbar UX",
    snippet: "Custom scrollbars make the panel look cleaner and polished."
  },
  {
    id: 11,
    title: "React Icons",
    snippet: "Use react-icons for lightweight SVG icons instead of images."
  },
  {
    id: 12,
    title: "Button Feedback",
    snippet: "Hover and active states provide tactile feedback to users."
  },
  {
    id: 13,
    title: "State Management",
    snippet: "Keep state minimal and derived where possible."
  },
  {
    id: 14,
    title: "Testing Scroll",
    snippet: "Adding multiple bookmarks helps you test scroll behaviour easily."
  },
  {
    id: 15,
    title: "Final Tip",
    snippet: "Always clean up event listeners to avoid memory leaks."
  }
];
