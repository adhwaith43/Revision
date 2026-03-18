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
  },
});

export const { setReduxMovieList } = movieSlice.actions;
export default movieSlice.reducer;