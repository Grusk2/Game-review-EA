import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

interface GameDetailsProps {
  id: number;
  name: string;
  description: string;
  background_image: string;
  rating: number;
  released: string;
  genres: { name: string }[];
  platforms: { platform: { name: string } }[];
  developers: { name: string }[];
  publishers: { name: string }[];
}

function GameDetails() {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<GameDetailsProps | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await fetch(
          `https://api.rawg.io/api/${id}?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`
        );
        const data = await response.json();
        setGame(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching game details:", error);
        setIsLoading(false);
      }
    };

    fetchGameDetails();
  }, [id]);

  if (isLoading) {
    return <p>Loading game details...</p>;
  }

  if (!game) {
    return <p>Error loading game details.</p>;
  }

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
      <p className="text-gray-700 mb-4">{game.description}</p>
      <div className="flex flex-wrap gap-4 mb-6">
        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded">
          Released: {game.released}
        </span>
        <span className="px-3 py-1 bg-green-100 text-green-800 rounded">
          Rating: {game.rating}/5
        </span>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Genres</h2>
        <p>{game.genres.map((genre) => genre.name).join(", ")}</p>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Platforms</h2>
        <p>
          {game.platforms.map((p) => p.platform.name).join(", ")}
        </p>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Developers</h2>
        <p>{game.developers.map((dev) => dev.name).join(", ")}</p>
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Publishers</h2>
        <p>{game.publishers.map((pub) => pub.name).join(", ")}</p>
      </div>
    </div>
  );
}

export default GameDetails;
