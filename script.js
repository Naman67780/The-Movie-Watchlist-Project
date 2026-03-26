const api="https://api.themoviedb.org/3/movie/popular?api_key=950726300c0085cae525f81415141462"
//functions
async function getData(api){
    const response=await fetch(api)
    const data=await response.json()
    const movieDiv=document.getElementById("movies")
    data.results.forEach((movie)=>{
        const poster = "https://image.tmdb.org/t/p/w200" + movie.poster_path;
        const movieCard=document.createElement("div")
        movieCard.innerHTML=`
        <img src="${poster}"/>`
        movieDiv.appendChild(movieCard)
    })
}
getData(api)
