import { useEffect, useState } from "react"
import Search from "./components/Search"


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

 const fetchMovies = async() =>{
    try{
      const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`
      const response = await fetch(endpoint,API_OPTIONS);
      console.log(response)

    }catch(error){
      console.error(`Error fetching the movies:${error}`);
      setErrorMessage("Error fetching the movies . please try again later");
    }
 }

  useEffect(() =>{
    fetchMovies()
  },[])

  return (
    <main >
      <div className="pattern"/>

      <div className="wrapper">

      <header>
      <img src="./hero.png" alt="Hero banner" />
        <h1>Find <span className="text-gradient">Movies </span> You'll Enjoy Without the Hassel</h1>
      </header>
      <Search searchtext={searchTerm} setSearchText={setSearchTerm}/>
      </div>
      <section className="all-movies">
        <h2>All movies</h2>
        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      </section>
     
    </main>
  )
}

export default App
