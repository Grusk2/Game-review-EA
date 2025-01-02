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
    <div className="space-y-4">
      {isLoading && <p>Loading categories...</p>}
      {!isLoading &&
        categories.map((category) => (
          <div
            key={category.id}
            onClick={() => handleCategoryClick(category.id)}
            className={`cursor-pointer relative w-24 aspect-square rounded-lg overflow-hidden ${
              category.id === selectedCategory ? "border-2 border-blue-500" : "border border-gray-600"
            }`}
          >
            <img
              src={category.imageUrl}
              alt={category.name}
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
              <h3 className="text-center text-white text-sm font-semibold">{category.name}</h3>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Categories;