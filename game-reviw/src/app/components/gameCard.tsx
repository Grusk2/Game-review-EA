import React from 'react';

interface Game {
    id: number;
    title: string;
    imageUrl: string;
    description: string;
    // Add other properties as needed
  }
  function GameCard({ game }: { game: Game }) {
  return (
    <div className="game-card h-64 w-64 bg-white rounded-lg overflow-hidden">
      <img src={game.imageUrl} alt={game.title} className="h-40 w-full object-cover" />
      <div className="p-4">
        <h2 className="text-lg font-bold">{game.title}</h2>
        <p className="text-gray-500">{game.description}</p>
      </div>
    </div>
  );
}

export default GameCard;