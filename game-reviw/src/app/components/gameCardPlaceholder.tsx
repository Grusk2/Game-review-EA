import React from 'react';

function GameCardPlaceholder() {
  return (
    <div className="game-card h-64 w-64 bg-gray-200 rounded-lg overflow-hidden">
      <div className="h-40 bg-gray-300 animate-pulse"></div>
      <div className="p-4">
        <div className="h-4 bg-gray-300 rounded-full w-2/3 animate-pulse mb-2"></div>
        <div className="h-2 bg-gray-300 rounded-full w-1/2 animate-pulse"></div>
      </div>
    </div>
  );
}

export default GameCardPlaceholder;