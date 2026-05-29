import React from "react";

export default function ScrollableContent({ children, className = "" }) {
  return (
    <div className={`flex-1 overflow-y-auto ${className}`}>
      {children}
    </div>
  );
}
