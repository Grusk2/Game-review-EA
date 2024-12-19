"use client"
import React, { useState, useEffect } from "react";
import GameCard from "../components/gameCard";
import GameCardPlaceholder from "../components/gameCardPlaceholder";
import { auth, db } from "../utils/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import toast from "react-hot-toast";

interface Game {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  rating: number;
  platforms: string[];
}

function GameGrid() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const userId = auth.currentUser?.uid;

  const fetchData = async (pageNumber: number) => {
    try {
      if (pageNumber === 1) {
        setIsLoading(true); // reset loading state when starting a new fetch
      } else {
        setIsFetchingMore(true); // only indicate fetching when loading more
      }

      const response = await fetch(
        `https://api.rawg.io/api/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&page=${pageNumber}`
      );

      const data = await response.json();

      const formattedGames = data.results.map((game: any) => ({
        id: game.id,
        title: game.name,
        imageUrl: game.background_image,
        description: game.description || "No description available",
        platforms: game.platforms.map((p: any) => p.platform.name),
        rating: game.rating,
      }));

      // If we are on the first page, we reset the list
      setGames((prevGames) => {
        if (pageNumber === 1) {
          return formattedGames; // reset the list
        }
        return [...prevGames, ...formattedGames]; // append new data
      });

      setHasMore(data.next !== null);
      setIsLoading(false);
      setIsFetchingMore(false);
    } catch (error) {
      console.error("Error fetching games:", error);
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  const handleAddToLibrary = async (game: Game) => {
    if (!userId) {
      toast.error("You need to be logged in to add a game to your library.");
      return;
    }

    try {
      const libraryRef = doc(db, "users", userId, "library", game.id.toString());

      await setDoc(libraryRef, {
        title: game.title,
        imageUrl: game.imageUrl,
        description: game.description,
        platforms: game.platforms,
        rating: game.rating,
      });

      toast.success(`${game.title} added to your library!`);
    } catch (error) {
      console.error("Error adding game to library:", error);
      toast.error("There was an issue adding the game to your library.");
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !isFetchingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  // Reset the games when component is mounted (on route change, etc.)
  useEffect(() => {
    setGames([]); // clear games when navigating to this component
  }, []);

  return (
    <div className="bg-gray-900 text-white pt-20 px-6 md:px-20">
      <div className="game-card-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {isLoading ? (
          Array.from({ length: 15 }).map((_, index) => (
            <GameCardPlaceholder key={index} />
          ))
        ) : (
          games.map((game) => (
            <GameCard
              key={game.id}
              game={game}
              onAddToLibrary={handleAddToLibrary}
            />
          ))
        )}
      </div>
  
      {hasMore && !isLoading && (
        <div className="text-center p-8">
          <button
            onClick={handleLoadMore}
            disabled={isFetchingMore}
            className="px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-500 disabled:opacity-50"
          >
            {isFetchingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default GameGrid;
