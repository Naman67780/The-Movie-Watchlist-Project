const api="https://api.themoviedb.org/3/movie/popular?api_key=950726300c0085cae525f81415141462&page=1"
//Variables
let page=1
//functions
async function getData(api){
    const response=await fetch(api)
    const data=await response.json()
    const movieDiv=document.getElementById("movies")
    data.results.forEach((movie)=>{
        const poster = "https://image.tmdb.org/t/p/w200" + movie.poster_path;
        const movieCard=document.createElement("div")
        movieCard.className="movieCard"
        movieCard.innerHTML=`
        <img src="${poster}" class="movieImage" alt="${movie.title}"/>
        <div class="movieDetails">
        <a class="movieTitle" href="https://www.themoviedb.org/movie/${movie.id}" target="_blank">${movie.title}</a>
        <p class="movieRating">Rating⭐: ${movie.vote_average}</p>
        </div>`
        movieDiv.appendChild(movieCard)
    })
}
//Event Listners
getData(api)
