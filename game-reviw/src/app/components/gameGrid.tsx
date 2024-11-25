"use client";

import React, { useState, useEffect } from "react";
import GameCard from "../components/gameCard";
import GameCardPlaceholder from "../components/gameCardPlaceholder";

interface Game {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  rating: number;
}

function GameGrid() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async (pageNumber: number) => {
    try {
      if (pageNumber === 1) {
        setIsLoading(true);
      } else {
        setIsFetchingMore(true);
      }

      const response = await fetch(
        `https://api.rawg.io/api/games?key=3a05e794adaf449aa9c3e347c10065fb&page=${pageNumber}`
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

      setGames((prevGames) => [...prevGames, ...formattedGames]);
      setHasMore(data.next !== null);
      setIsLoading(false);
      setIsFetchingMore(false);
    } catch (error) {
      console.error("Error fetching games:", error);
      setIsLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchData(page); 
  }, [page]);

  const handleLoadMore = () => {
    if (hasMore && !isFetchingMore) {
      const nextPage = page + 1;
      setPage(nextPage);
    }
  };

  return (
    <div className="pt-20 pl-80 pr-80">
      <div className="game-card-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {isLoading ? (
          Array.from({ length: 15 }).map((_, index) => (
            <GameCardPlaceholder key={index} />
          ))
        ) : (
          games.map((game) => <GameCard key={game.id} game={game} />)
        )}
      </div>
      {hasMore && !isLoading && (
        <div className="text-center mt-8">
          <button
            onClick={handleLoadMore}
            disabled={isFetchingMore}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {isFetchingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
}

export default GameGrid;
