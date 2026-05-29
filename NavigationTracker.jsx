import React from "react";

export default function AppContainer({ children }) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {children}
    </div>
  );
}