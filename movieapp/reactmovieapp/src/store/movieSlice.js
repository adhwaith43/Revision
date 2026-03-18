import { createSlice } from '@reduxjs/toolkit';

const movieSlice = createSlice({
  name: 'movies',
  initialState: {
    movieList: [], // starting state
  },
  reducers: {

     ///similar to usestate
      setReduxMovieList: (state, action) => {
      state.movieList = action.payload; 
    },

    // NEW: Deletes a movie by filtering it out of the array
    deleteMovie: (state, action) => {
      // action.payload will be the ID of the movie we want to delete
      state.movieList = state.movieList.filter(movie => movie.id !== action.payload);
    },

    // NEW: Updates a specific movie's data
    updateMovie: (state, action) => {
      // action.payload will be the updated movie object
      const index = state.movieList.findIndex(movie => movie.id === action.payload.id);
      if (index !== -1) {
        state.movieList[index] = action.payload; 
      }
    },

  }
});


export const { setReduxMovieList, deleteMovie, updateMovie } = movieSlice.actions;
export default movieSlice.reducer;