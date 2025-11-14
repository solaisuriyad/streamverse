import React from 'react';
import { Movie } from '../types';
import MovieCard from './MovieCard';

interface MovieListProps {
  title: string;
  movies: Movie[];
}

const MovieList: React.FC<MovieListProps> = ({ title, movies }) => {
  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-white mb-6 border-l-4 border-blue-400 pl-4">{title}</h2>
      {movies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {movies.map(movie => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <p className="text-gray-400">No movies to display.</p>
      )}
    </section>
  );
};

export default MovieList;