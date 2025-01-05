"use client";
import React, { useEffect, useState } from "react";

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
    <div className="space-y-4 p-4 md:p-6">
      {/* Skeleton Loader */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-1 gap-6">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className="w-full aspect-square rounded-lg overflow-hidden bg-gray-300 animate-pulse"
            >
              <div className="w-full h-full bg-gray-400 mb-4"></div>
              <div className="w-2/3 h-4 bg-gray-400 mx-auto"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-1 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`cursor-pointer relative w-full aspect-square rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 ${
                category.id === selectedCategory ? "border-4 border-blue-500" : "border border-gray-600"
              }`}
            >
              <img
                src={category.imageUrl}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <h3 className="text-center text-white text-lg font-semibold drop-shadow-lg">
                  {category.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Categories;
