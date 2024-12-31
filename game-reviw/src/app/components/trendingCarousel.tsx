"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import GameCard from "../components/gameCard";
import GameCardPlaceholder from "../components/gameCardPlaceholder";

interface Game {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  rating: number;
  platforms: string[];
}

const TrendingCarousel = () => {
  const [trendingGames, setTrendingGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchTrendingGames = async () => {
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games/lists/main?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&ordering=-added&page_size=10`
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

      setTrendingGames(formattedGames);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching trending games:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTrendingGames();
  }, []);

  return (
    <div className="bg-gray-900 text-white pt-10">
      {isLoading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, index) => (
            <GameCardPlaceholder key={index} />
          ))}
        </div>
      ) : (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{
            clickable: true,
            el: ".custom-swiper-pagination", // Target custom pagination container
          }}
          autoplay={{ delay: 5000 }}
          spaceBetween={16} // Adjusted for better spacing between cards
          slidesPerView={1}
          breakpoints={{
            480: { slidesPerView: 2, spaceBetween: 16 },
            768: { slidesPerView: 3, spaceBetween: 20 },
            1024: { slidesPerView: 4, spaceBetween: 24 },
          }}
        >
          {trendingGames.map((game) => (
            <SwiperSlide key={game.id}>
              <div className="hover:scale-105 transform transition duration-300">
                <GameCard game={game} />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default TrendingCarousel;
