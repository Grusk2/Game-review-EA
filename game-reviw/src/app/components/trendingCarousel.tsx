"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { auth, db } from "../utils/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";

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

  const fetchTrendingGames = async () => {
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games/lists/main?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&ordering=-added&page_size=10`
      );
      const data = await response.json();

      const formattedGames: Game[] = data.results.map((game: any) => ({
        id: game.id,
        title: game.name,
        imageUrl: game.background_image,
        platforms: game.platforms.map((p: any) => p.platform.name),
        rating: game.rating,
      }));

      const uniqueGames: Game[] = Array.from(
        new Map(formattedGames.map((g: Game) => [g.id, g])).values()
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
  };

  const handleAddToLibrary = async (game: Game) => {
    if (!userId) {
      toast.error("You need to be logged in to add a game to your library.");
      return;
    }

    try {
      const libraryRef = doc(db, "users", userId, "library", game.id.toString());
      await setDoc(libraryRef, game);
      setAddedGames((prev) => ({ ...prev, [game.id]: true }));
      toast.success(`${game.title} added to your library!`);
    } catch (error) {
      console.error("Error adding game to library:", error);
      toast.error("Failed to add game to your library.");
    }
  };

  useEffect(() => {
    fetchTrendingGames();
  }, []);

  return (
    <div className="bg-gray-900 text-white">
      {isLoading ? (
        <div className="flex justify-center items-center w-full h-[600px] bg-gray-700 animate-pulse rounded-lg relative">
        </div>
      ) : (
        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          effect="fade"
          pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          spaceBetween={50} // More space between slides
          slidesPerView={1}
          loop={true}
          className="w-full h-[600px]"
        >
          {trendingGames.map((game) => (
            <SwiperSlide key={game.id}>
              <div
                className="relative w-full h-[600px] bg-cover bg-center flex items-center justify-start rounded-lg"
                style={{
                  backgroundImage: `url(${game.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black opacity-75 z-10 rounded-lg"></div>

                {/* Content Section */}
                <div className="relative z-20 text-left px-12 max-w-2xl space-y-6">
                  <h2 className="text-5xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
                    {game.title}
                  </h2>
                  <p className="text-lg text-gray-300 font-light">
                    Available on:{" "}
                    <span className="font-semibold text-white">
                      {game.platforms.join(", ")}
                    </span>
                  </p>

                  {/* ✅ Button with Feedback */}
                  <button
                    onClick={() => handleAddToLibrary(game)}
                    className={`px-8 py-3 text-lg font-semibold rounded-full transition-all duration-300 ease-in-out shadow-lg hover:scale-105 ${
                      addedGames[game.id]
                        ? "bg-transparent border-2 border-green-500 text-green-500 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-500 text-white"
                    }`}
                    disabled={addedGames[game.id]}
                  >
                    {addedGames[game.id] ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6 inline-block"
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
