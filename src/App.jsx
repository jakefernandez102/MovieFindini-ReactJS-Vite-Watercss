import './App.css';

import debounce from 'just-debounce-it';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Movies } from './components/Movies';
import { useMovie } from './hooks/useMovies';

function useSearch() {
  const [search, setSearch] = useState('')
  const [ error, setError ] = useState( null );
  const isFirstInput = useRef( true );
  
  useEffect( () => {
    if ( isFirstInput.current ) {
      isFirstInput.current = search === ''
      return;
    }

    if ( search === '' ) {
      setError( 'Search field is required' );
      return;
    }
  
    if ( search.match( /^\d+$/ ) ) {
      setError( 'The search can not start with a number' );
      return;
    }
  
    if ( search.length < 3 ) {
      setError( 'The title must have more than 3 characters' );
      return;
    }
    setError(null)
  }, [ search ] )
  return { search, setSearch, error };
}

function App() {
  
  const [ sort, setSort ] = useState( '' );
  const [ selectValue, setSelectValue ] = useState( '' );
  const [ bgImage, setBgImage ] = useState( 0 );
  const [ movieFake, setMovieFake ] = useState( [] );
  const { search, setSearch, error } = useSearch();
  const { movies, getMovies, loading } = useMovie( { search, sort } );
  useEffect( () => {
    if (movies.length===0) {
      setMovieFake([ {
        poster: '../public/wizard.png',
      } ] )
      
    } else {
      
      const timer = setTimeout(() => {
        bgImage <= movies?.length-1 ? setBgImage(bgImage + 1) : setBgImage(0); 
      }, 5000 );
      console.log(bgImage);
      return () => clearTimeout( timer );
    } 
  },[bgImage,movies])

  const debouncedMovies = useCallback(
    debounce( search => {
      // if (search === prevSearch) return;
      if (search === '') return;
      if ( movies?.length === 0 ) return;
    console.log( { search } );
    console.log( 'me ejecuto' );
    getMovies( { search } )
  },500),[]);

  function handleSubmit( e ) {
    e.preventDefault();
    
    if ( search?.length === 0 ) return;
    // const {query} = Object.fromEntries(new window.FormData(e.target))
    getMovies({search})
  }

  function handleSort(option) {
    setSelectValue(option)
    setSort( option )
  }

  function handleChange( e ) {
    const newQuery = e.target.value;
    const newSearch = e.target.value;
    if ( newQuery.startsWith( ' ' ) ) return
    
    setSearch( newQuery );
    debouncedMovies(newSearch);

  }
  let images =[];
  function fillImages () {
    if (movies?.length === 0 || images === undefined) {
      images =Array.from(new Array(10).fill('a'))
      return images;
    } else {
      images = movies?.map((movie) => movie?.poster);
      return images;
    }
  }
  movies?.length !==0 ? fillImages() : null;

  const bgImageStyle= {
    backgroundImage: `linear-gradient(to top, rgb(0 0 0 /.8),rgb(0 0 0 /1)),url(${movies?.length===0 ? movieFake[0]?.poster : images[bgImage] })`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }
  return (
    <>
        <header
          className="header"
          style={bgImageStyle}
        >
          <div>
            <h1
              className={
                movies?.length <= 0
                  ? "heading heading--mobile"
                  : error
                  ? "heading  isError"
                  : " heading noError"
              }
            >
              Movies Findini
            </h1>
          </div>
          <form
            className="form"
            onSubmit={(e) => handleSubmit(e)}
          >
            <input
              type="text"
              placeholder="Spider Man, Avengers, Fast & Furious"
              name="query"
              value={search}
              onChange={handleChange}
              style={{
                border: "1px solid transparent",
                borderColor: error ? "red" : "transparent",
              }}
            />
            <select
              name="sortYear"
              id="sortYear"
              onChange={(e) => handleSort(e.target.value)}
              value={movies?.length === 0 ? "0" : selectValue}
              disabled={
                movies?.length === 0
                  ? true
                  : !movies
                  ? true
                  : error
                  ? true
                  : false
              }
            >
              <option
                value="0"
                disabled
              >
                -- Sort by --
              </option>
              <option value="1">Year</option>
              <option value="2">Name</option>
            </select>
            <button type="submit">Search</button>
          </form>
          {error && (
            <h2
              className="error"
              style={{
                fontSize: "15px",
                backgroundColor: "lightcoral",
                borderRadius: "5px",
                textAlign: "center",
                padding: "5px",
                border: "1px solid red",
                color: "red",
                fontWeight: "bold",
                textTransform: "uppercase",
                display: "inline-block",
              }}
            >
              {error}
            </h2>
          )}
        </header>
      <div className="page">
        <main>
          {loading ? (
            <div className="spinner">
              <div className="dot1"></div>
              <div className="dot2"></div>
            </div>
          ) : (
            <Movies
              movies={movies ?? []}
              search={search}
            />
          )}
        </main>
      </div>
    </>
  );
}

export default App;
