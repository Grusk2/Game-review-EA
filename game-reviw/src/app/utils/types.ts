// src/types.ts
export interface Game {
    id: number;
    title: string;
    imageUrl: string;
    description: string;
    rating: number;
    platforms: string[];
    genre?: string;
  }
  