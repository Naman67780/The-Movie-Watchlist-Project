const api="https://api.themoviedb.org/3/movie/popular?api_key=950726300c0085cae525f81415141462&page=1"
//Variables
let page=1
let isLoading=false
const genreMap = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western"
};

//functions
async function getData() {
  if (isLoading || page>500) return;
  isLoading = true;
  try {
    const response = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=950726300c0085cae525f81415141462&page=${page}`);
    const data = await response.json();
    const movieDiv = document.getElementById("movies");
    data.results.forEach((movie) => {
      const poster = movie.poster_path
        ? "https://image.tmdb.org/t/p/w200" + movie.poster_path
        : "";
      const genres = movie.genre_ids
        .map(id => genreMap[id] || "Unknown")
        .join(", ");

      const movieCard = document.createElement("div");
      movieCard.className = "movieCard";
      movieCard.innerHTML = `
        <img src="${poster}" class="movieImage" alt="${movie.title}"/>
        <div class="movieDetails">
          <a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank" class="movieTitle">
            ${movie.title}
          </a>
          <p class="movieRating">⭐ ${movie.vote_average}</p>
          <p class="movieGenres">${genres}</p>
        </div>
      `;

      movieDiv.appendChild(movieCard);
    });

  } catch (err) {
    console.log("Error:", err);
  } finally {
    isLoading = false;
  }
}

//Event Listners
//Infinite scroll Feature
window.addEventListener("scroll", () => {
  console.log("scrolling...");
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    page++;
    getData()
  }
});
getData()