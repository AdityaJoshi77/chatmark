import React from "react";
import { MdBookmarkAdd } from "react-icons/md";
interface BookmarkIconProps {
  top: number;
  left: number;
  onClick: () => void;
}

const BookmarkIcon: React.FC<BookmarkIconProps> = ({ top, left, onClick }) => {
  console.log("The bookmark icon attempted render");
  return (
    <button
      style={{
        position: "absolute",
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 9999,
        cursor: "pointer",
        background: "yellow",
        border: "1px solid #ccc",
        borderRadius: "50%",
        padding: "4px",
        boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      title="Add Bookmark"
      onClick={onClick}
    >
      <MdBookmarkAdd size={20} color="black" />
    </button>
  );
};

export default BookmarkIcon;
