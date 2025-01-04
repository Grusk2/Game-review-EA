export interface Game {
    id: number;
    title: string;
    imageUrl: string;
    description: string;
    rating: number;
    platforms: string[];
    genre?: string;
  }
  
export interface FirestoreGame {
  id: string; 
  title: string;
  imageUrl: string;
  description: string;
  platforms: string[];
  rating: number;
}