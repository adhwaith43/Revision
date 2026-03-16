import { use, useState } from 'react'
import Search from './components/Search'
import { useEffect } from 'react';

import './App.css'
import Spinner from './components/Spinner';
import { MovieCard } from './components/MovieCard';

function App() {
  const [searchTerm, setSearchTerm] = useState('');///searching

  const [errorMessage, setErrorMessage] = useState('');///error handling
  
  const[movieList, setMovieList] = useState([]); /// state to store the fetched movies 
  
  const [isLoading, setIsLoading] = useState(true); /// state to track loading status of the API request



  ///API configuration /////
  const API_BASE_URL = 'https://api.themoviedb.org/3';
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const API_OPTIONS = {
    method: 'GET',
    headers: { 
      'accept': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    }
  };

  /////////////////////
 


  ///function to fetch movies from the API//////
  const fetchMovies = async (query='') => {

    setErrorMessage(''); /// Clear any previous error messages before fetching new movies
    setIsLoading(true); /// Set loading state to true when starting to fetch movies

    try {
       const endpoint = query
       ?`${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
       :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc` ; /// if there is a search term, use the search endpoint, otherwise use the discover endpoint to get popular movies
       //////converted to utf-8 to make sure the query is processd properly 


       const response = await fetch(endpoint, API_OPTIONS);


       if (!response.ok) {
        throw new Error(`failed to fetch movies`);
      }

        const data = await response.json();
        if(data.Response === 'False') {

          setErrorMessage(data.Error || 'No movies found.'); ///someimes the API might return a response with an error message
          //, so we check for that and set it as the error message if it exists. Otherwise, we set a generic error message.

          setMovieList([]); /// Clear the movie list if there was an error fetching movies
          return;
         }

         setMovieList(data.results); /// if no error , update the movie list
     }

      catch (error) {
        console.error('Error fetching movies:', error);
        setErrorMessage('Failed to fetch movies. Please try again later.');
      }


      finally {
        setIsLoading(false); /// Set loading state to false after the API request is complete, regardless of success or failure
      }

    }
  ////////////////////////////



  ///useEffect to fetch movies when the component mounts//////
  useEffect(() => {
    fetchMovies(searchTerm);
                    }, [searchTerm]);

  ////////////////////////////////



  return (
    <main>
      <div className='pattern'/>
      <div className='wrapper'>
        <header>
          <img src="./hero.png" alt="Hero Banner" />
          <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle</h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> 
        </header>


        <section className='all-movies'>
          <h2 className='mt-[40px]'>All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) :errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (

               <MovieCard key={movie.id} movie={movie} />

              ))}
            </ul>
          )}

        </section>
      </div>

    </main>
  )
}

export default App
