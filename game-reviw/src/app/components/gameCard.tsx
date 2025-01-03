import Link from "next/link";
import { useEffect, useState } from "react";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db, auth } from "../utils/firebase";

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
  const [userRating, setUserRating] = useState<number | null>(null); 
  const [isAdded, setIsAdded] = useState(false); 
  const [menuOpen, setMenuOpen] = useState(false); 

  useEffect(() => {
    setIsClient(true);

    const fetchUserRating = async () => {
      if (!auth.currentUser) return;

      try {
        const userRef = doc(db, "users", auth.currentUser.uid, "ratings", game.id.toString());
        const userRatingDoc = await getDoc(userRef);

        if (userRatingDoc.exists()) {
          setUserRating(userRatingDoc.data()?.rating || null);
        }
      } catch (error) {
        console.error("Error fetching user rating:", error);
      }
    };

    fetchUserRating();
  }, [game.id]);

  useEffect(() => {
    const checkIfAdded = async () => {
      if (!auth.currentUser) return;

      try {
        const userLibraryRef = doc(db, "users", auth.currentUser.uid, "library", game.id.toString());
        const userLibraryDoc = await getDoc(userLibraryRef);

        if (userLibraryDoc.exists()) {
          setIsAdded(true);
        }
      } catch (error) {
        console.error("Error checking if game is in the library:", error);
      }
    };

    checkIfAdded();
  }, [game.id]);

  if (!isClient) {
    return null;
  }

  const displayedRating = userRating !== null ? userRating : game.rating;

  const renderStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={`text-xl ${i <= rating ? "text-yellow-500" : "text-gray-400"}`}>
          {i <= rating ? "★" : "☆"}
        </span>
      );
    }
    return stars;
  };

  const handleAddToLibrary = () => {
    if (!isAdded) {
      onAddToLibrary(game);
      setIsAdded(true);
    }
  };

  const handleRemoveFromLibrary = async () => {
    if (!auth.currentUser) return;

    try {
      const userLibraryRef = doc(db, "users", auth.currentUser.uid, "library", game.id.toString());
      await deleteDoc(userLibraryRef);
      setIsAdded(false);
      setMenuOpen(false);
    } catch (error) {
      console.error("Error removing game from library:", error);
    }
  };

  return (
    <div className="game-card bg-gray-800 rounded-lg overflow-hidden shadow-md flex flex-col relative">
      {/* Three-dot menu for removing the game */}
      <div className="absolute top-2 right-2 z-10">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white text-lg focus:outline-none"
        >
          ⋮
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-gray-900 rounded-md shadow-lg overflow-hidden z-20">
            <button
              onClick={handleRemoveFromLibrary}
              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-700"
            >
              Remove Game
            </button>
          </div>
        )}
      </div>

      {/* Card Content */}
      <Link href={`/game/${game.id}`}>
        <img
          src={game.imageUrl}
          alt={game.title}
          className="h-48 w-full object-cover object-top"
        />
        <div className="p-4 flex-grow">
          <h2 className="text-lg font-bold text-white mb-6 truncate">{game.title}</h2>
          <p className="text-sm text-green-400 font-semibold">
            {renderStars(displayedRating)}
          </p>
        </div>
      </Link>

      {/* Add to Library Button */}
      <button
        onClick={handleAddToLibrary}
        className={`absolute bottom-4 right-4 w-10 h-10 flex items-center justify-center rounded-3xl ${
          isAdded
            ? "bg-transparent border-2 border-green-600 text-green-600"
            : "bg-green-600 hover:bg-green-500"
        }`}
      >
        {isAdded ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          "+"
        )}
      </button>
    </div>
  );
}

export default GameCard;
