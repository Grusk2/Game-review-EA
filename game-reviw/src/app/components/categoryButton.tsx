"use client";
import React from "react";

interface CategoryButtonProps {
  id: string | null;
  name: string;
  imageUrl: string;
  isSelected: boolean;
  onClick: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({
  name,
  imageUrl,
  isSelected,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative w-24 md:w-32 lg:w-40 aspect-square rounded-lg border-2 ${
        isSelected ? "border-blue-500" : "border-transparent"
      } transition hover:scale-105 hover:border-blue-400`}
    >
      <img
        src={imageUrl}
        alt={name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <span className="text-sm md:text-base font-semibold text-white">{name}</span>
      </div>
    </button>
  );
};

export default CategoryButton;
