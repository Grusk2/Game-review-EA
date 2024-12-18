import Link from "next/link";
import { useEffect, useState } from "react";

interface Game {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  rating: number;
}

function GameCard({ game }: { game: Game }) {
  const [isClient, setIsClient] = useState(false); 

  useEffect(() => {
    setIsClient(true); 
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="game-card bg-white rounded-lg overflow-hidden shadow-md flex flex-col hover:shadow-lg transition-shadow duration-200">
      <Link href={`/game/${game.id}`}>
        <img
          src={game.imageUrl}
          alt={game.title}
          className="h-40 w-full object-cover"
        />
        <div className="p-4 flex-grow">
          <h2 className="text-lg font-bold mb-2 truncate">{game.title}</h2>
          <p className="text-sm text-yellow-500 font-semibold">
            <strong>Rating:</strong> {game.rating.toFixed(1)}
          </p>
        </div>
      </Link>
    </div>
  );
}

export default GameCard;
