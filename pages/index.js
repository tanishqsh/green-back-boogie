import axios from 'axios';
import Image from 'next/image';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

/**
 * Compononent for a single movie card
 * @param {*} title – pass the title of the movie
 * @param {*} poster - pass the Poster Image URL of the movie
 * @param {*} year - pass the movie year
 * @returns a component of a movie card
 */
const MovieCard = ({ title, poster, year, movieNominated }) => (
  <motion.div
    animate={{ opacity: 1, x: 0 }}
    initial={{ opacity: 0, y: 0, x: -150 }}
    key={title}
    className="mx-auto my-5 cursor-pointer max-w-200 md:my-0"
  >
    <Image layout="intrinsic" height="300px" width="200px" src={poster == 'N/A' ? '/placeholder.jpg' : poster} />
    <div className="mt-3 space-y-2 text-center">
      <h1 className="w-full text-xs text-transparent bg-gradient-to-br from-green-200 to-green-600 bg-clip-text font-inter"> {title} </h1>
      <p className="text-xs text-white font-inter"> {year} </p>
      <button
        onClick={() => movieNominated(title, poster, year)}
        className="px-3 py-1 my-2 text-xs text-white rounded-md outline-none bg-gradient-to-br from-green-200 to-green-600 font-inter focus:outline-none"
      >
        {' '}
        Nominate{' '}
      </button>
    </div>
  </motion.div>
);

const NominatedCard = ({ title, poster, year, removeNomination, nominationList }) => (
  <motion.div
    animate={{ opacity: 1, y: 0, x: 0 }}
    initial={{ opacity: 0, y: 0, x: 150 }}
    key={title}
    className={`p-6 border-2 border-green-500 rounded-md cursor-pointer mx-auto my-5 md:my-0 max-w-200 ${
      nominationList.length == 5 ? 'bg-gray-800' : ''
    }`}
  >
    <div className="shadow-lg ">
      <Image height="300px" width="200px" src={poster == 'N/A' ? '/placeholder.jpg' : poster} />
    </div>
    <div className="mt-3 space-y-2 text-center">
      <h1 className="w-full text-xs text-white font-inter"> {title} </h1>
      <p className="text-xs text-white font-inter"> {year} </p>
      <button
        onClick={() => removeNomination(title)}
        className="px-3 py-1 my-2 text-xs text-white rounded-md outline-none bg-gradient-to-br from-red-200 to-red-600 font-inter focus:outline-none"
      >
        {' '}
        Remove Nomination{' '}
      </button>
    </div>
  </motion.div>
);

/**
 * Error Message Component
 */
const ErrorMessage = ({ message }) => <p className="px-6 py-2 text-gray-600 bg-gray-300 rounded-md text-md">{message} </p>;

/**
 *
 * @returns Banner on completion of nomination
 */

const Banner = () => (
  <div className="text-3xl font-medium text-white font-inter">Congratulations! You have successfully selected your nominations. 🏆</div>
);

export default function Home() {
  // movies state to contain the movie array
  const [movies, setMovies] = useState();
  const [searchTerm, setSearchTerm] = useState('car');
  const baseURL = 'https://www.omdbapi.com/?apikey=';
  const apiKey = process.env.OMDB_API;
  const type = 'movie';
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  /**
   * Nomination list
   */
  const [nominationList, setNominationList] = useState([]);

  /**
   * This function updates the error to be displayed when the movies do not load
   * @param {h} error – Boolean True / False
   * @param {*} errorMessage  - Custom message to be displayed
   */
  function updateError(error, errorMessage) {
    setError(error);
    setErrorMessage(errorMessage);
  }

  /**
   * Adds a remove to the nomination list
   */
  function movieNominated(title, poster, year) {
    let nomination = {
      title,
      poster,
      year,
    };
    setNominationList([...nominationList, nomination]);
    localStorage.setItem('nominationList', JSON.stringify([...nominationList, nomination]));
  }

  /**
   * Searches the nomination list for the removed title and returns a filtered array
   */
  function removeNomination(title) {
    var newList = nominationList.filter((nomination) => nomination.title != title);
    setNominationList(newList);
    localStorage.setItem('nominationList', newList);
  }

  /**
   * Removes movies from movies array if they have been already added to the nomination list
   */

  function removeAlreadyNominated(newMovies) {
    let tempArray = newMovies;
    for (const key in nominationList) {
      const title = nominationList[key].title;
      tempArray = tempArray.filter((item) => item.Title != title);
    }
    return tempArray;
  }

  /**
   * This function runs everytime the search term is changed. It fetches the movies
   * based on the new search term and displays them in the grid after mandatory checks.
   */
  useEffect(() => {
    if (searchTerm.length < 3) {
      updateError(true, 'Please enter atleast 3 characters to refine search.');
      return;
    }
    updateError(false, '');
    // axios method too fetch the data from the API
    axios.get(baseURL + apiKey + '&s=' + searchTerm.trim() + '&type=' + type).then((res) => {
      if (res.data.Response) {
        // To display only top-5 search results in movies
        if (res.data.Search && nominationList.length != 5) {
          const filteredMovies = removeAlreadyNominated(res.data.Search);
          if (filteredMovies.length > 5) {
            setMovies(filteredMovies.slice(0, 5 - nominationList.length));
            return;
          }
          // if the results are already less than 5, set the entire library to movie state
          setMovies(filteredMovies);
        } else {
          updateError(true, 'No Movies Found!');
        }
      }
    });
  }, [searchTerm, nominationList]);

  /**
   * Get the nomination list from localStorage if any
   */

  return (
    <div>
      <Head>
        <title>Green Bag Boogie – Shoppies</title>
        <meta name="description" content="Nominate your favourite movie for Shopify Awards!" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;400&display=swap" rel="stylesheet"></link>
      </Head>
      <main>
        <div
          className={`flex flex-col items-center transition-all p-5 duration-500 justify-center min-h-screen bg-gray-800 space-y-14 ${
            nominationList.length == 5 ? 'bg-green-400' : ''
          }`}
        >
          <div className="space-y-2 text-center">
            {nominationList.length == 5 ? (
              <Banner />
            ) : (
              <h1 className="text-4xl font-bold text-transparent lowercase font-inter bg-gradient-to-br from-green-200 to-green-700 bg-clip-text">
                the shoppies
              </h1>
            )}
            {/* <p className="text-sm text-white lowercase"> Your favourite movie needs YOU!</p> */}
          </div>
          {error && nominationList.length < 1 ? (
            <div className="flex flex-wrap space-x-4">
              <ErrorMessage message={errorMessage} />
            </div>
          ) : (
            <>
              <div id="movie-container" className="flex flex-wrap lg:space-x-4">
                {nominationList &&
                  nominationList.map((nomination) => (
                    <NominatedCard
                      title={nomination.title}
                      poster={nomination.poster}
                      year={nomination.year}
                      nominationList={nominationList}
                      removeNomination={removeNomination}
                    />
                  ))}
                {error
                  ? ''
                  : movies &&
                    movies.map((movie) => <MovieCard movieNominated={movieNominated} title={movie.Title} poster={movie.Poster} year={movie.Year} />)}
              </div>
            </>
          )}
          {nominationList.length == 5 ? (
            ''
          ) : (
            <div className="space-y-2">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full m-5 md:m-0 px-2 py-2 text-sm text-white transition-all duration-150 bg-gray-800 mb-10 rounded-sm outline-none ring-offset-2 ring-white ring-offset-transparent ring-1 ${
                  error ? 'focus:ring-red-400' : 'focus:ring-green-400'
                } focus:outline-none focus:ring-1`}
                name="search"
                placeholder="Search Movies"
                type="text"
              />
              <p className="py-1 text-xs tracking-wide text-gray-500 capitalize"> Search Your Favourite Movies Here </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
