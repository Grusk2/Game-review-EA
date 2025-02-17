"use client";
import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { auth, db } from "../utils/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

interface RawgTrendingGame {
  id: number;
  name: string;
  background_image?: string;
  rating: number;
  platforms: { platform: { name: string } }[];
}

interface Game {
  id: number;
  title: string;
  imageUrl: string;
  rating: number;
  platforms: string[];
}

const TrendingCarousel = () => {
  const [trendingGames, setTrendingGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addedGames, setAddedGames] = useState<Record<number, boolean>>({});
  const userId = auth.currentUser?.uid;

  // ✅ Fixed: Memoized fetchTrendingGames and added dependencies
  const fetchTrendingGames = useCallback(async () => {
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games/lists/main?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&ordering=-added&page_size=10`
      );
      const data = await response.json();

      // ✅ Fixed: Removed `any` and used `RawgTrendingGame` type
      const formattedGames: Game[] = data.results.map(
        (game: RawgTrendingGame) => ({
          id: game.id,
          title: game.name,
          imageUrl: game.background_image || "/placeholder.jpg",
          platforms: game.platforms.map((p) => p.platform.name),
          rating: game.rating,
        })
      );

      const uniqueGames: Game[] = Array.from(
        new Map(formattedGames.map((g) => [g.id, g])).values()
      );

      setTrendingGames(uniqueGames);
      setIsLoading(false);

      if (userId) {
        const addedStatus: Record<number, boolean> = {};
        for (const game of uniqueGames) {
          const gameRef = doc(
            db,
            "users",
            userId,
            "library",
            game.id.toString()
          );
          const docSnap = await getDoc(gameRef);
          addedStatus[game.id] = docSnap.exists();
        }
        setAddedGames(addedStatus);
      }
    } catch (error) {
      console.error("Error fetching trending games:", error);
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchTrendingGames();
  }, [fetchTrendingGames]); // ✅ Fixed missing dependency warning

  const handleAddToLibrary = async (game: Game) => {
    if (!userId) {
      toast.error("You need to be logged in to add a game to your library.");
      return;
    }

    try {
      const libraryRef = doc(
        db,
        "users",
        userId,
        "library",
        game.id.toString()
      );
      await setDoc(libraryRef, game);
      setAddedGames((prev) => ({ ...prev, [game.id]: true }));
      toast.success(`${game.title} added to your library!`);
    } catch (error) {
      console.error("Error adding game to library:", error);
      toast.error("Failed to add game to your library.");
    }
  };

  return (
    <div className="bg-gray-900 text-white">
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-[600px] bg-gray-700 animate-pulse rounded-lg relative">
          Loading...
        </div>
      ) : (
        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          effect="fade"
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          spaceBetween={20}
          slidesPerView={1}
          loop={true}
          className="w-full h-[400px] sm:h-[600px]"
        >
          {trendingGames.map((game) => (
            <SwiperSlide key={game.id}>
              <div
                className="relative w-full h-[400px] sm:h-[600px] bg-cover bg-center flex items-center justify-start rounded-lg"
                style={{
                  backgroundImage: `url(${game.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-75 z-10 rounded-lg"></div>

                {/* Content Section */}
                <div className="relative z-20 text-left px-4 sm:px-12 max-w-full sm:max-w-2xl space-y-4 sm:space-y-6">
                  <Link href={`/game/${game.id}`}>
                    <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg cursor-pointer hover:text-blue-400 transition-all duration-200">
                      {game.title}
                    </h2>
                  </Link>
                  <p className="text-sm sm:text-lg text-gray-300 font-light">
                    Available on:{" "}
                    <span className="font-semibold text-white">
                      {game.platforms.join(", ")}
                    </span>
                  </p>
                  <button
                    onClick={() => handleAddToLibrary(game)}
                    className={`px-6 sm:px-8 py-2 sm:py-3 text-sm sm:text-lg font-semibold rounded-full transition-all duration-300 ease-in-out shadow-lg hover:scale-105 ${
                      addedGames[game.id]
                        ? "bg-transparent border-2 border-green-500 text-green-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-500 text-white"
                    }`}
                    disabled={addedGames[game.id]}
                    aria-label={
                      addedGames[game.id]
                        ? `Game "${game.title}" is already in your library`
                        : `Add game "${game.title}" to your library`
                    }
                  >
                    {addedGames[game.id] ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-5 h-5 inline-block"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    ) : (
                      "Add to Library"
                    )}
                  </button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default TrendingCarousel;
