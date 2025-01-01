"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination } from "swiper/modules";
import CategoryButton from "./categoryButton";

interface Category {
  id: number;
  name: string;
  imageUrl: string;
}

interface CategoriesProps {
  onCategorySelect: (categoryId: number | null) => void;
}

const Categories: React.FC<CategoriesProps> = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const response = await fetch(
        `https://api.rawg.io/api/genres?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`
      );

      const data = await response.json();

      const formattedCategories = data.results.map((category: any) => ({
        id: category.id,
        name: category.name,
        imageUrl: category.image_background,
      }));

      setCategories(formattedCategories);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setIsLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategory((prev) => (prev === categoryId ? null : categoryId));
    onCategorySelect(categoryId === selectedCategory ? null : categoryId);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="space-y-6">
      {isLoading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {!isLoading && (
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{
              clickable: true,
              el: ".custom-pagination", // Custom class name
            }}
            spaceBetween={16}
            slidesPerView={2} // Default for small screens
            breakpoints={{
              480: { slidesPerView: 3, spaceBetween: 16 },
              768: { slidesPerView: 4, spaceBetween: 20 },
              1024: { slidesPerView: 6, spaceBetween: 24 },
            }}
            className="pb-12" // Add padding for pagination dots
          >
            {categories.map((category) => (
              <SwiperSlide key={category.id}>
                <CategoryButton
                  id={category.id.toString()}
                  name={category.name}
                  imageUrl={category.imageUrl}
                  isSelected={category.id === selectedCategory}
                  onClick={() => handleCategoryClick(category.id)}
                />
              </SwiperSlide>
            ))}
            <div className="flex justify-center gap-3 align-center custom-pagination mt-4" />
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default Categories;
