"use client"
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../utils/firebase"; // assuming you have these utilities set up

interface StarRatingProps {
  initialRating?: number;
  gameId: string;
}

const StarRating = ({ initialRating = 0, gameId }: StarRatingProps) => {
  const [rating, setRating] = useState<number>(initialRating);
  const [hoverRating, setHoverRating] = useState<number>(0);

  // Handle click to save rating
  const handleClick = async (newRating: number) => {
    setRating(newRating);  // Update the local state with the new rating value

    if (auth.currentUser) {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid, "ratings", gameId);
        await setDoc(userRef, { rating: newRating });  // Store as a number in Firestore
        console.log("Rating saved to Firebase:", newRating);
      } catch (error) {
        console.error("Error saving rating to Firebase:", error);
      }
    }
  };

  const handleMouseEnter = (hoverValue: number) => setHoverRating(hoverValue);
  const handleMouseLeave = () => setHoverRating(0);

  // Logic for displaying full, half, or empty stars
  const getStarClass = (index: number) => {
    if (hoverRating) {
      if (hoverRating >= index + 0.5) return "full";
      if (hoverRating >= index) return "half";
    }

    if (rating) {
      if (rating >= index + 0.5) return "full";
      if (rating >= index) return "half";
    }

    return "empty";
  };

  return (
    <div className="flex items-center justify-center">
      {[0, 1, 2, 3, 4].map((index) => (
        <span
          key={index}
          className={`cursor-pointer text-4xl transition duration-100 ease-in-out ${getStarClass(index) === "full"
            ? "text-yellow-400"
            : getStarClass(index) === "half"
            ? "text-yellow-300"
            : "text-gray-400"
            }`}
          onMouseEnter={() => handleMouseEnter(index + 0.5)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index + 0.5)}  // Ensure we're saving a number
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
