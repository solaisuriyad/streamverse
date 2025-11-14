import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import { getMovies } from '../services/movieService';
import MovieList from '../components/MovieList';

const MoviesPage: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const allMovies = await getMovies();
        setMovies(allMovies);
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-[50vh]">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <MovieList title="All Movies" movies={movies} />
    </div>
  );
};

export default MoviesPage;
