import React, { useState } from 'react';


// 1. Import Redux dispatch and your new actions
// Add useSelector to read the vault, and toggleFavorite to update it
import { useDispatch, useSelector } from 'react-redux';
import { deleteMovie, updateMovie ,toggleFavorite} from '../store/movieSlice';

// 2. Add 'onUpdate' to your destructured props so we can tell App.jsx the item changed
const DetailPage = ({ item, mediaType, onBack, onUpdate }) => {
  const displayTitle = item.title || item.name;
  const displayDate = item.release_date || item.first_air_date;;

  ////// a. THE EDIT TOGGLE //////
  const [isEditing, setIsEditing] = useState(false);

  ///////////// b. THE FORM DATA   ///////////
  // We initialize this with the current movie's data so the inputs aren't empty /////////
  const [formData, setFormData] = useState({
    title: displayTitle,
    original_language: item.original_language || '',
    release_date: displayDate || '',
    overview: item.overview || '',
  });
  
  // 3. Initialize dispatch
  const dispatch = useDispatch();

  // Read the favorites list from Redux
  const favorites = useSelector(state => state.movies.favorites);
  
  // Is this specific movie inside that list? (Returns true or false)
  const isFavorited = favorites.some(fav => fav.id === item.id);

  // 4. The Delete Function
  const handleDelete = () => {
        const confirmDelete = window.confirm(`Are you sure you want to delete ${displayTitle}?`);
        if (confirmDelete) {
        dispatch(deleteMovie(item.id)); // Tell Redux to delete it
        onBack(); // Instantly close the Detail Page and go back to search
        }
    };

    /////////old edit function//////////
//   // 5. The Edit Function
//   const handleEdit = () => {
//         const newTitle = window.prompt("Enter a new title for this item:", displayTitle);
        
//         if (newTitle && newTitle !== displayTitle) {
//         // Make a copy of the current item so we don't directly mutate React state
//         const updatedItem = { ...item };
        
//         // TMDB uses 'title' for movies and 'name' for TV, so we update the correct one
//         if (item.title !== undefined) updatedItem.title = newTitle;
//         else updatedItem.name = newTitle;

//         dispatch(updateMovie(updatedItem)); // Tell Redux to update the main list
//         onUpdate(updatedItem); // Tell App.jsx to update the Detail Page view
//         }
//     };
    /////////////////////////////////////////////


    // Updates the local formData as the user types
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Saves to Redux and closes Edit Mode
    const handleSave = () => {
        // Merge the old item data with the new typed data
        const updatedItem = {
        ...item,
        original_language: formData.original_language,
        overview: formData.overview,
        };
        
        // TMDB relies on specific keys for movies vs tv shows, so we map them back correctly
        if (item.title !== undefined) updatedItem.title = formData.title;
        else updatedItem.name = formData.title;
        
        if (item.release_date !== undefined) updatedItem.release_date = formData.release_date;
        else updatedItem.first_air_date = formData.release_date;

        dispatch(updateMovie(updatedItem)); // 1. Save to Global Vault
        onUpdate(updatedItem);              // 2. Update App.jsx's selectedItem
        setIsEditing(false);                // 3. Turn off Edit Mode
    };

    const handleCancel = () => {
        // Reset the form back to the original data and close Edit Mode
        setFormData({
        title: displayTitle,
        original_language: item.original_language || '',
        release_date: displayDate || '',
        overview: item.overview || '',
        });
        setIsEditing(false);
    };




  return (
    <div className="animate-delayed-fade text-white pb-10">
      
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="mb-8 flex items-center gap-2 text-gray-100 hover:text-white transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Back to Search
      </button>

      <div className="flex flex-col md:flex-row gap-10 bg-dark-100 p-8 rounded-3xl shadow-inner shadow-light-100/10 relative overflow-hidden">
        
        {/* Left Side: Poster */}
        <div className="w-full md:w-1/3 flex-shrink-0 z-10">
          <img 
            src={item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : '/no-movie.png'}
            alt={displayTitle}
            className="w-full h-auto rounded-2xl shadow-lg"
          />
        </div>

        {/* Right Side: Details & Action Buttons */}
        <div className="w-full md:w-2/3 flex flex-col z-10">

        {isEditing ? (
            /* --- EDIT MODE UI --- */
            <div className="flex flex-col gap-4 mb-8 flex-grow">
              <input 
                name="title"
                value={formData.title} 
                onChange={handleChange}
                className="text-4xl sm:text-5xl font-bold bg-dark-100/50 border border-light-100/20 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 w-full"
              />
              <div className="flex gap-4">
                <input 
                  name="original_language"
                  value={formData.original_language} 
                  onChange={handleChange}
                  placeholder="Language (e.g., en)"
                  className="bg-dark-100/50 border border-light-100/20 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 w-24"
                />
                <input 
                  name="release_date"
                  value={formData.release_date} 
                  onChange={handleChange}
                  placeholder="YYYY-MM-DD"
                  className="bg-dark-100/50 border border-light-100/20 rounded-lg p-2 text-white focus:outline-none focus:border-blue-500 w-36"
                />
              </div>
              <textarea 
                name="overview"
                value={formData.overview} 
                onChange={handleChange}
                rows="5"
                className="bg-dark-100/50 border border-light-100/20 rounded-lg p-3 text-white text-lg leading-relaxed focus:outline-none focus:border-blue-500 w-full resize-none"
              />
            </div>
          ) : (
            /* --- NORMAL DISPLAY UI --- */
        <>
          <h2 className="text-4xl sm:text-5xl font-bold mb-2">{displayTitle}</h2>
          
          <div className="flex flex-wrap items-center gap-4 text-gray-100 mb-6">
            <div className='flex items-center gap-1 bg-light-100/10 px-3 py-1 rounded-full text-white font-bold'>
              <img src="star.svg" alt="Star" className="w-4 h-4" />
              <span>{item.vote_average ? item.vote_average.toFixed(1) : 'N/A'}</span>
            </div>
            <span className="capitalize">{item.original_language}</span>
            <span>•</span>
            <span>{displayDate}</span>
          </div>

          <p className="text-gray-100 text-lg leading-relaxed mb-8 flex-grow">
            {item.overview || "No description available for this title."}
          </p>
          </>
          )
        }
             
          {/* Action Buttons: Favorite, Edit, Delete */}
          <div className="flex flex-wrap gap-4 mt-auto">

            {isEditing ? (
              /* If Editing, show Save and Cancel buttons */
              <>
                <button onClick={handleSave} className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/40 text-blue-400 rounded-xl font-semibold transition-all duration-300">
                  Save Changes
                </button>
                <button onClick={handleCancel} className="px-6 py-3 bg-light-100/5 hover:bg-light-100/20 text-gray-100 rounded-xl font-semibold transition-all duration-300">
                  Cancel
                </button>
              </>
            ) : (
              /* If Not Editing, show Favorite, Edit, Delete */

              <>
            
            {/* Dynamic Favorite Button */}
            <button 
              onClick={() => dispatch(toggleFavorite(item))}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 group ${isFavorited ? 'bg-rose-500/20 text-rose-400' : 'bg-light-100/5 hover:bg-rose-500/20 hover:text-rose-400'}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill={isFavorited ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:scale-110 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              <span className="font-semibold">{isFavorited ? 'Favorited' : 'Favorite'}</span>
            </button>

            {/* Edit Button (Blue on hover) */}
            <button className="flex items-center gap-2 px-6 py-3 bg-light-100/5 hover:bg-blue-500/20 hover:text-blue-400 rounded-xl transition-all duration-300 group" onClick={() => setIsEditing(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:scale-110 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
              </svg>
              <span className="font-semibold">Edit</span>
            </button>

            {/* Delete Button (Red on hover) */}
            <button className="flex items-center gap-2 px-6 py-3 bg-light-100/5 hover:bg-red-500/20 hover:text-red-500 rounded-xl transition-all duration-300 group" onClick={handleDelete}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 group-hover:scale-110 transition-transform">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              <span className="font-semibold">Delete</span>
            </button>
           </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default DetailPage;