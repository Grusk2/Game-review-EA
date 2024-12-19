import Link from "next/link";
import { useEffect, useState } from "react";

interface Game {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  rating: number;
  platforms: string[];
}

function GameCard({
  game,
  onAddToLibrary,
}: {
  game: Game;
  onAddToLibrary: (game: Game) => void;
}) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="game-card bg-gray-800 rounded-lg overflow-hidden shadow-md flex flex-col relative">
      <Link href={`/game/${game.id}`}>
        <img
          src={game.imageUrl}
          alt={game.title}
          className="h-48 w-full object-cover object-top"
        />
        <div className="p-4 flex-grow">
          <h2 className="text-lg font-bold text-white mb-6 truncate">
            {game.title}
          </h2>
          <p className="text-sm text-green-400 font-semibold">
            <strong>Rating:</strong> {game.rating.toFixed(1)}
          </p>
        </div>
      </Link>
      <button
        onClick={() => onAddToLibrary(game)}
        className="absolute bottom-4 right-4 px-4 py-2 bg-green-600 text-white text-sm rounded-3xl hover:bg-green-500"
      >
        +
      </button>
    </div>
  );
}

export default GameCard;
