import { Movie } from '../types';
import { supabase } from '../supabaseClient'; // We import the Supabase client you created
import { GoogleGenAI, Type } from '@google/genai'; // This is for the AI recommendations

// Initialize the Google AI client for recommendations
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- All the mock/dummy data has been removed ---

// Fetches ALL movies from your Supabase 'movies' table
export const getMovies = async (): Promise<Movie[]> => {
  const { data, error } = await supabase.from('movies').select('*');
  if (error) {
    console.error('Error fetching movies:', error);
    return [];
  }
  return data;
};

// Fetches a SINGLE movie by its ID from your Supabase 'movies' table
export const getMovieById = async (id: string): Promise<Movie | undefined> => {
  const { data, error } = await supabase.from('movies').select('*').eq('id', id).single();
  if (error) {
    console.error('Error fetching movie by id:', error);
    return undefined;
  }
  return data;
};

// Fetches the 4 movies with the highest rating to be featured on the homepage
export const getFeaturedMovies = async (): Promise<Movie[]> => {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('rating', { ascending: false }) // Order by rating, highest first
    .limit(4); // Get only 4

  if (error) {
    console.error('Error fetching featured movies:', error);
    return [];
  }
  return data;
};

// Fetches the 4 most recently added movies to your database
export const getRecentlyWatched = async (): Promise<Movie[]> => {
  // NOTE: For a real app with user accounts, this would show the user's actual history.
  // For now, we show the newest movies on the platform.
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('created_at', { ascending: false }) // Order by creation date, newest first
    .limit(4);

  if (error) {
    console.error('Error fetching recently added movies:', error);
    return [];
  }
  return data;
};

// Fetches the actual watch history for a specific logged-in user
export const getWatchHistory = async (userId: string): Promise<Movie[]> => {
  if (!userId) return []; // If there's no user, return nothing

  // This query joins 'watch_history' with 'movies' to get full movie details
  const { data, error } = await supabase
    .from('watch_history')
    .select('movies(*)') // This special syntax gets all columns from the linked movie
    .eq('user_id', userId)
    .order('watched_at', { ascending: false }); // Show most recently watched first

  if (error) {
    console.error('Error fetching watch history:', error);
    return [];
  }
  
  // The data comes back as [{ movies: {...} }, { movies: {...} }]. We clean it up.
  return data.map((item: any) => item.movies);
};

// Adds a movie to a specific user's watch history
export const addToWatchHistory = async (userId: string, movieId: string): Promise<void> => {
  if (!userId) return; // Can't add history without a user

  // 'upsert' will INSERT a new row, or UPDATE the 'watched_at' time if it already exists.
  // This prevents duplicate history entries.
  const { error } = await supabase
    .from('watch_history')
    .upsert({
        user_id: userId,
        movie_id: parseInt(movieId, 10), // The database expects a number, not a string
        watched_at: new Date().toISOString() // Set the watched time to now
    }, { onConflict: 'user_id, movie_id' });

  if (error) {
    console.error('Error adding to watch history:', error);
  }
};

// This function for AI recommendations now uses REAL data
export const getRecommendedMovies = async (watchedMovies: Movie[]): Promise<Movie[]> => {
  if (!watchedMovies || watchedMovies.length === 0) {
    return [];
  }

  try {
    // Get ALL movies from the database to compare against
    const allMovies = await getMovies();
    const watchedMovieIds = new Set(watchedMovies.map(m => m.id));
    
    // Find movies that the user has NOT watched yet
    const availableMovies = allMovies.filter(m => !watchedMovieIds.has(m.id));
    
    if (availableMovies.length === 0) {
        return [];
    }

    // The AI prompt remains the same
    const prompt = `
      Based on the user's watch history, recommend 4 new movies for them to watch from the list of available movies.
      
      The user has watched:
      ${watchedMovies.map(m => `- ${m.title