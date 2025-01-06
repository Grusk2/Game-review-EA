export async function fetchGameDetails(id: string) {
  const response = await fetch(`https://api.rawg.io/api/games/${id}?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`);
  
  if (!response.ok) {
    throw new Error("Failed to fetch game details");
  }

  const game = await response.json();
  return game;
}
