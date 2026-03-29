const api="https://api.themoviedb.org/3/movie/popular?api_key=950726300c0085cae525f81415141462&page=1"
//Variables
let page=1
//functions
async function getData(){
    const response=await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=950726300c0085cae525f81415141462&page=${page}`)
    const data=await response.json()
    const movieDiv=document.getElementById("movies")
    data.results.forEach((movie)=>{
        const poster = "https://image.tmdb.org/t/p/w200" + movie.poster_path;
        const movieCard=document.createElement("div")
        const movieId=movie.id
        movieCard.className="movieCard"
        movieCard.innerHTML=`
        <img src="${poster}" class="movieImage" alt="${movie.title}"/>
        <div class="movieDetails">
        <a class="movieTitle" href="https://www.themoviedb.org/movie/${movie.id}" target="_blank">${movie.title}</a>
        <p class="movieRating">Rating⭐: ${movie.vote_average}</p>
        </div>`
      movieDiv.appendChild(movieCard)
      async function getmovieGenre(movieId){
      let response=await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=950726300c0085cae525f81415141462`)
      let data=await response.json()
      const genres=data.genres.map((g)=>g.name).join(",")
      movieCard.innerHTML+=`
      <p class="movieGenre">Genre: ${genres}</p>`
    }
    getmovieGenre(movieId)
    })
 
}

//Event Listners
//Infinite scroll Feature
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
    page++;
    getData();
  }
});
getData()
