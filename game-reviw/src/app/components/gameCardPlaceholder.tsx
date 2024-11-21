import React from "react";

function GameCardPlaceholder() {
  return (
    <div className="game-card-placeholder bg-gray-300 rounded-lg animate-pulse h-64 w-64">
      <div className="h-40 bg-gray-400"></div>
      <div className="p-4 space-y-2">
        <div className="h-4 bg-gray-400 rounded"></div>
        <div className="h-4 bg-gray-400 rounded w-3/4"></div>
      </div>
    </div>
  );
}

export default GameCardPlaceholder;
