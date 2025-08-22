import type { BookmarkData } from "./content/types";

export const dummyBookmarks: BookmarkData[] = [
  {
    id: "b1",
    title: "Understanding React State",
    snippet: "React state allows you to store and manage component data...",
    role: "user",
    timestamp: Date.now() - 1000000,
    anchor: "bubble1",
    selectionText: "React state allows you to store and manage component data across renders. It's crucial for interactive UIs..."
  },
  {
    id: "b2",
    title: "JavaScript Closures",
    snippet: "Closures are functions that can remember variables from their scope...",
    role: "assistant",
    timestamp: Date.now() - 900000,
    anchor: "bubble2",
    selectionText: "Closures are functions that can remember variables from their scope even after the outer function has executed..."
  },
  {
    id: "b3",
    title: "CSS Flexbox Basics",
    snippet: "Flexbox makes it easy to layout items in a row or column...",
    role: "user",
    timestamp: Date.now() - 800000,
    anchor: "bubble3",
    selectionText: "Flexbox makes it easy to layout items in a row or column, aligning and distributing space efficiently..."
  },
  {
    id: "b4",
    title: "Understanding Promises",
    snippet: "A Promise represents the eventual completion (or failure) of an async operation...",
    role: "assistant",
    timestamp: Date.now() - 700000,
    anchor: "bubble4",
    selectionText: "A Promise represents the eventual completion (or failure) of an asynchronous operation and allows you to handle success/failure..."
  },
  {
    id: "b5",
    title: "React useEffect Hook",
    snippet: "The useEffect hook lets you perform side effects in function components...",
    role: "user",
    timestamp: Date.now() - 600000,
    anchor: "bubble5",
    selectionText: "The useEffect hook lets you perform side effects in function components, like fetching data, directly manipulating the DOM, or setting timers..."
  },
  {
    id: "b6",
    title: "Async/Await in JS",
    snippet: "Async/Await allows you to write asynchronous code that looks synchronous...",
    role: "assistant",
    timestamp: Date.now() - 500000,
    anchor: "bubble6",
    selectionText: "Async/Await allows you to write asynchronous code that looks synchronous, making it easier to read and maintain..."
  },
  {
    id: "b7",
    title: "Understanding Git Branches",
    snippet: "Branches in Git let you develop features independently from main code...",
    role: "user",
    timestamp: Date.now() - 400000,
    anchor: "bubble7",
    selectionText: "Branches in Git let you develop features independently from the main codebase, and then merge them when ready..."
  },
  {
    id: "b8",
    title: "JavaScript Event Loop",
    snippet: "The event loop is what allows JS to perform non-blocking operations...",
    role: "assistant",
    timestamp: Date.now() - 300000,
    anchor: "bubble8",
    selectionText: "The event loop is what allows JavaScript to perform non-blocking operations by handling asynchronous callbacks and tasks..."
  },
  {
    id: "b9",
    title: "CSS Grid Layout",
    snippet: "CSS Grid provides a two-dimensional layout system for the web...",
    role: "user",
    timestamp: Date.now() - 200000,
    anchor: "bubble9",
    selectionText: "CSS Grid provides a two-dimensional layout system for the web, allowing you to control rows and columns simultaneously..."
  },
  {
    id: "b10",
    title: "Handling Errors in JS",
    snippet: "Try/Catch blocks let you handle exceptions in JavaScript...",
    role: "assistant",
    timestamp: Date.now() - 100000,
    anchor: "bubble10",
    selectionText: "Try/Catch blocks let you handle exceptions in JavaScript, making your code more robust and preventing crashes..."
  }
];
