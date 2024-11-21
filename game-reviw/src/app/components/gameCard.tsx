import React from 'react';

interface Game {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  platforms: string[];
  rating: number;
}

function GameCard({ game }: { game: Game }) {
  return (
    <div className="game-card bg-white rounded-lg overflow-hidden shadow-md flex flex-col">
      <img
        src={game.imageUrl}
        alt={game.title}
        className="h-40 w-full object-cover"
      />
      <div className="p-4 flex-grow">
        <h2 className="text-lg font-bold mb-2 truncate">{game.title}</h2>
        <p className="text-sm text-gray-600 mb-2 line-clamp-3">
          {game.description}
        </p>
        <p className="text-sm text-gray-800">
          <strong>Platforms:</strong> {game.platforms.join(", ")}
        </p>
        <p className="text-sm text-yellow-500 font-semibold">
          <strong>Rating:</strong> {game.rating.toFixed(1)}
        </p>
      </div>
    </div>
  );
}

export default GameCard;
