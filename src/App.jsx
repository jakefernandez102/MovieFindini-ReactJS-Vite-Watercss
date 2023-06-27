import './App.css';

import { useEffect, useRef, useState } from 'react';

import { Movies } from './components/Movies';
import { userMovie } from './hooks/useMovies';

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
  
  const { search, setSearch, error } = useSearch();
  const { movies, getMovies } = userMovie({search});
  


  function handleSubmit( e ) {
    e.preventDefault();
    // const {query} = Object.fromEntries(new window.FormData(e.target))
    getMovies()
  }

  function handleChange( e ) {
    const newQuery = e.target.value;
    if(newQuery.startsWith(' '))return
    setSearch( newQuery );
    
    
  }
  return (
    <div className="page">
      <header className="header">
        <div>
          <h1 className={error ? "heading isError" : " heading noError"}>
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
      <main>
        <Movies
          movies={movies}
          search={search}
        />
      </main>
    </div>
  );
}

export default App;
