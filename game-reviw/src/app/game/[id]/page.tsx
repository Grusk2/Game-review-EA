import React from "react";

interface GameDetailsProps {
  params: { id: string };
}

async function fetchGameDetails(id: string) {
  const res = await fetch(
    `https://api.rawg.io/api/games/${id}?key=3a05e794adaf449aa9c3e347c10065fb`
  );
  if (!res.ok) {
    throw new Error("Failed to fetch game details");
  }
  return res.json();
}

export default async function GameDetails({ params }: GameDetailsProps) {
  const game = await fetchGameDetails(params.id);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="relative w-full h-64 md:h-96 mb-8">
        <img
          src={game.background_image}
          alt={game.name}
          className="absolute inset-0 w-full h-full object-cover rounded-lg"
        />
      </div>
      <h1 className="text-3xl font-bold mb-4">{game.name}</h1>
      <p className="text-gray-700 mb-4">{game.description_raw}</p>
      <div className="flex flex-wrap gap-4 mb-6">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
          Released: {game.released}
        </span>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded">
          Rating: {game.rating}/5
        </span>
      </div>
    </div>
  );
}
