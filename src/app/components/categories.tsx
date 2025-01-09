"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";

interface Category {
  id: number;
  name: string;
  imageUrl: string;
}

interface RawgCategoryResponse {
  id: number;
  name: string;
  image_background?: string;
}

interface CategoriesProps {
  onCategorySelect: (categoryId: number | null, categoryName: string | null) => void;
}

const Categories: React.FC<CategoriesProps> = ({ onCategorySelect }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `https://api.rawg.io/api/genres?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`
        );

        const data = await response.json();

        const formattedCategories: Category[] = data.results.map((category: RawgCategoryResponse) => ({
          id: category.id,
          name: category.name,
          imageUrl: category.image_background || "/placeholder.jpg",
      }));
      
        

        setCategories(formattedCategories);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = (categoryId: number, categoryName: string) => {
    const isSelected = categoryId === selectedCategory;
    setSelectedCategory(isSelected ? null : categoryId);
    onCategorySelect(isSelected ? null : categoryId, isSelected ? null : categoryName);
  };

  return (
    <div className="space-y-4 p-4 md:p-6">
      {/* Skeleton Loader */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-1 gap-6">
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className="w-full aspect-square rounded-lg overflow-hidden bg-gray-300 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <>
          {/* Mobile: Horizontal scroll with names visible */}
          <div className="flex sm:hidden gap-4 overflow-x-auto py-2">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id, category.name)}
                className={`cursor-pointer flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-600 relative ${
                  selectedCategory === category.id ? "border-blue-500" : ""
                }`}
              >
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  width={300} 
                  height={200} 
                  className="w-full h-full object-cover"
                />
                <p className="absolute bottom-2 left-0 right-0 text-center text-white text-xs font-semibold bg-black bg-opacity-70">
                  {category.name}
                </p>
              </div>
            ))}
          </div>

          {/* Desktop: Grid Layout with Side Placement */}
          <div className="hidden sm:grid grid-cols-4 lg:grid-cols-1 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id, category.name)}
                className={`cursor-pointer relative w-full rounded-lg overflow-hidden transition-all duration-300 ease-in-out hover:scale-105 ${
                  selectedCategory === category.id ? "border-4 border-blue-500" : "border border-gray-600"
                }`}
              >
                <Image
                  src={category.imageUrl}
                  alt={category.name}
                  width={300} 
                  height={200} 
                  className="w-full h-[120px] object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                  <h3 className="text-center text-white text-lg font-semibold drop-shadow-lg">
                    {category.name}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Categories;
