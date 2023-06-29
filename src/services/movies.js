

export const searchMovies = async ( { search } ) => {
   if ( search === '' ) return null;
   if ( search ) {
      // setResponseMovies(withResults)
      try {
         const resp = await fetch( `https://www.omdbapi.com/?apikey=${ import.meta.env.VITE_API_KEY }&s=${ search }` )
         const data = await resp.json() 
        
         const movies = data.Search;

         return movies?.map((movie) => ({
            id: movie?.imdbID,
            title: movie?.Title,
            year: movie?.Year,
            type: movie?.Type,
            poster: movie?.Poster,
         } ) );

      } catch (error) {
         throw new Error('Error searching movies!');
      }
    } 
}