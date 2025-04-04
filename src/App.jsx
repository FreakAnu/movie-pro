import { useEffect, useState } from "react"
import Search from "./components/Search"
import Spinner from "./components/spinner";
import Moviecard from "./components/Moviecard";
import {useDebounce} from "react-use"
import { updateSearchCount } from "./appwrite";


const API_BASE_URL="https://api.themoviedb.org/3"
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method:'GET',
  headers:{
    accept:'application/json',
    Authorization:`Bearer ${API_KEY}`
  }
}

function App() {

  const[searchTerm, setSearchTerm] = useState("")
  const[errorMessage,setErrorMessage] = useState("")
  const[movieList,setMovieList] = useState([])
  const [loading,setLoading] = useState(false)
  const [debounceSearcheTerm,setDebounceSearchTerm] = useState("")

// Fetching the movies

  useDebounce( () => setDebounceSearchTerm(searchTerm),2000,[searchTerm])

 const fetchMovies = async(query ='') =>{
  setLoading(true)
  setErrorMessage("")
    try{
      const endpoint = query 
      ?`${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` 
      :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`

      const response = await fetch(endpoint,API_OPTIONS);

      if (!response.ok){
        throw new Error("Failed to fetch the movies")
      }
      const data = await response.json()

      if(data.response === 'False'){
        setErrorMessage( data.error || "Failed to fetch movies")
        setMovieList([])
        return
      }
      console.log(data)
      setMovieList(data.results || [])

      if(query && data.results.length>0) {
        await updateSearchCount(query, data.results[0])
      }
     

    }catch(error){
      console.error(`Error fetching the movies:${error}`);
      setErrorMessage("Error fetching the movies . please try again later");
    }finally {
      setLoading(false)
    }
 }



  useEffect(() =>{
    fetchMovies(debounceSearcheTerm)
  },[debounceSearcheTerm])

  return (
    <main >
        <div className="pattern"/>

          <div className="wrapper">

              <header>
                <img src="./hero.png" alt="Hero banner" />
                 <h1>Find <span className="text-gradient">Movies </span> You'll Enjoy Without the Hassel</h1>
              </header>
              <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm}/>



              <section className="all-movies">
                 <h2 className="mt-[40px]" >All movies</h2>
               {
                   loading ? (<Spinner />) : errorMessage? (<p className="text-red-500">{errorMessage}</p>) :
                   (
                <ul>
                    {movieList.map((movie) => (
                        <Moviecard key={movie.id} movie = {movie} />
                    ))}
                </ul>
                   )   
                }
              </section>


          </div>


     
    </main>
  )
}

export default App
