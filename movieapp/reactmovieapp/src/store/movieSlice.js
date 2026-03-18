import { createSlice } from '@reduxjs/toolkit';

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    movieList: [], // starting state
    topRatedMovies: [], // Added Top Rated to the vault
  },
  reducers: {

     ///similar to usestate
      setReduxMovieList: (state, action) => {
      state.movieList = action.payload; 
    },

    setReduxTopRatedMovies: (state, action) => { // NEW: Action to set Top Rated
      state.topRatedMovies = action.payload;
    },

    
    // NEW: Deletes a movie by filtering it out of the array
    deleteMovie: (state, action) => {

      // Filter the movie out of BOTH lists
      // action.payload will be the ID of the movie we want to delete
      state.movieList = state.movieList.filter(movie => movie.id !== action.payload);
      state.topRatedMovies = state.topRatedMovies.filter(movie => movie.id !== action.payload);
    },


    
    // // NEW: Updates a specific movie's data
    // updateMovie: (state, action) => {
    //   // action.payload will be the updated movie object
    //   const index = state.movieList.findIndex(movie => movie.id === action.payload.id);
    //   if (index !== -1) {
    //     state.movieList[index] = action.payload; 
    //   }
    // },

    updateMovie: (state, action) => {
      const updatedItem = action.payload;
      
      // 1. Check if it exists in the normal movie list and update it
      const listIndex = state.movieList.findIndex(movie => movie.id === updatedItem.id);
      if (listIndex !== -1) {
        state.movieList[listIndex] = updatedItem; 
      }

      // 2. Check if it exists in the top rated list and update it
      const topIndex = state.topRatedMovies.findIndex(movie => movie.id === updatedItem.id);
      if (topIndex !== -1) {
        state.topRatedMovies[topIndex] = updatedItem; 
      }
    }

  }
});


export const { setReduxMovieList, setReduxTopRatedMovies, deleteMovie, updateMovie } = movieSlice.actions;
export default movieSlice.reducer;