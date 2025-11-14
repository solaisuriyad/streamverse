
export interface Movie {
  id: string;
  title: string;
  year: number;
  rating: number;
  genres: string[];
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  trailerUrl: string;
  streamUrl: string;
  reason?: string;
}