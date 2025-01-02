"use client";

import React, { useState, useEffect } from "react";
import Categories from "../components/categories";
import GameCard from "../components/gameCard";
import GameCardPlaceholder from "../components/gameCardPlaceholder";
import TrendingCarousel from "../components/trendingCarousel";
import { auth, db } from "../utils/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Game } from "../utils/types";
import toast from "react-hot-toast";

function GameGrid() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Game[] | null>(null);

  const userId = auth.currentUser?.uid;

  useEffect(() => {
    if (!searchResults) {
      fetchData(page);
    }
  }, [page, selectedCategory, searchResults]);

  const fetchData = async (pageNumber: number) => {
    try {
      if (pageNumber === 1) setIsLoading(true);
      else setIsFetchingMore(true);

      const url = selectedCategory
        ? `https://api.rawg.io/api/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&genres=${selectedCategory}&page=${pageNumber}`
        : `https://api.rawg.io/api/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&page=${pageNumber}`;

      const response = await fetch(url);
      const data = await response.json();

      const formattedGames = data.results.map((game: any): Game => ({
        id: game.id,
        title: game.name,
        imageUrl: game.background_image,
        description: game.description || "No description available",
        platforms: game.platforms.map((p: any) => p.platform.name),
        rating: game.rating,
      }));

      setGames((prevGames) =>
        pageNumber === 1 ? formattedGames : [...prevGames, ...formattedGames]
      );

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
      await setDoc(libraryRef, game);
      toast.success(`${game.title} added to your library!`);
    } catch (error) {
      console.error("Error adding game to library:", error);
      toast.error("There was an issue adding the game to your library.");
    }
  };

  const handleLoadMore = () => {
    if (hasMore && !isFetchingMore) setPage((prevPage) => prevPage + 1);
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen grid grid-cols-1 lg:grid-cols-[250px_1fr] overflow-x-hidden px-16">
      <aside className="px-4 w-full max-w-[250px] mb-6">
        <h2 className="text-xl font-semibold mb-4 mt-6">Categories</h2>
        <Categories
          onCategorySelect={(categoryId) => {
            setSelectedCategory(categoryId ? categoryId.toString() : null);
            setPage(1);
            setGames([]);
          }}
        />
      </aside>

      <main className="pt-4 space-y-6 overflow-x-hidden">
        {!searchResults && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Trending Games</h2>
            <TrendingCarousel />
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            {searchResults ? "Search Results" : selectedCategory || "All Games"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {isLoading && !searchResults ? (
              Array.from({ length: 15 }).map((_, index) => (
                <GameCardPlaceholder key={index} />
              ))
            ) : (
              (searchResults || games).map((game) => (
                <GameCard
                  key={game.id}
                  game={game}
                  onAddToLibrary={handleAddToLibrary}
                />
              ))
            )}
          </div>
          {hasMore && !isLoading && !searchResults && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                disabled={isFetchingMore}
                className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-500 disabled:opacity-50"
              >
                {isFetchingMore ? "Loading..." : "Load More"}
              </button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default GameGrid;
