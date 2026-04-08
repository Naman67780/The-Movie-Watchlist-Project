const api="https://api.themoviedb.org/3/movie/popular?api_key=950726300c0085cae525f81415141462&page=1"
//Variables
renderWatchlist();
let page=1
let isLoading=false
let isSearchMode = false;
let currentQuery = "";
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
     let url;

if (isSearchMode) {
  url = `https://api.themoviedb.org/3/search/movie?api_key=950726300c0085cae525f81415141462&query=${currentQuery}&page=${page}`;
} else {
  url = `https://api.themoviedb.org/3/movie/popular?api_key=950726300c0085cae525f81415141462&page=${page}`;
}

const response = await fetch(url);
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
          <button class="watchBtn" data-id="${movie.id}">
      + Watchlist
    </button>
        </div>
      `;

      movieDiv.appendChild(movieCard);
    const btn = movieCard.querySelector(".watchBtn");

  btn.addEventListener("click", () => {
  addToWatchlist(movie);
});
    });

  } catch (err) {
    console.log("Error:", err);
  } finally {
    isLoading = false;
  }
}
function getWatchlist() {
  return JSON.parse(localStorage.getItem("watchlist")) || [];
}

function saveWatchlist(list) {
  localStorage.setItem("watchlist", JSON.stringify(list));
}

function addToWatchlist(movie) {
  let list = getWatchlist();

  // prevent duplicates
  if (list.some(item => item.id === movie.id)) {
    alert("Already in watchlist 😄");
    return;
  }

  list.push(movie);
  saveWatchlist(list);

  alert("Added to watchlist ✅");
}

//Event Listners
//Infinite scroll Feature
// ---- SEARCH DROPDOWN WITH DEBOUNCE ----

const searchInput = document.getElementById("searchInput");
const searchDropdown = document.getElementById("searchDropdown");
let debounceTimer;

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();

  // Clear previous timer on every keystroke (debounce)
  clearTimeout(debounceTimer);

  if (query === "") {
    searchDropdown.style.display = "none";
    searchDropdown.innerHTML = "";
    return;
  }

  // Wait 400ms after user stops typing before calling API
  debounceTimer = setTimeout(() => {
    fetchSuggestions(query);
  }, 400);
});

async function fetchSuggestions(query) {
  const url = `https://api.themoviedb.org/3/search/movie?api_key=950726300c0085cae525f81415141462&query=${query}&page=1`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Take only the top 6 results for the dropdown
    const suggestions = data.results.slice(0, 6);

    if (suggestions.length === 0) {
      searchDropdown.style.display = "none";
      return;
    }

    // Build dropdown HTML
    searchDropdown.innerHTML = suggestions
      .map(movie => {
        const poster = movie.poster_path
          ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
          : "https://via.placeholder.com/32x46?text=N/A";

        return `
          <div class="dropdown-item" data-title="${movie.title}">
            <img src="${poster}" alt="${movie.title}" />
            <span>${movie.title}</span>
          </div>
        `;
      })
      .join("");

    searchDropdown.style.display = "block";

    // Clicking a suggestion fills input and triggers search
    searchDropdown.querySelectorAll(".dropdown-item").forEach(item => {
      item.addEventListener("click", () => {
        searchInput.value = item.dataset.title;
        searchDropdown.style.display = "none";
        document.getElementById("searchBtn").click(); // trigger search
      });
    });

  } catch (err) {
    console.log("Dropdown error:", err);
  }
}

// Hide dropdown when clicking anywhere outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-wrapper")) {
    searchDropdown.style.display = "none";
  }
});
document.getElementById("searchBtn").addEventListener("click", () => {
  const input = document.getElementById("searchInput").value.trim();
  if (input === "") return;
  isSearchMode = true;
  currentQuery = input;
  page = 1;
  document.getElementById("movies").innerHTML = "";

  getData();
});
const sidebar = document.getElementById("watchlistSidebar");
const toggleBtn = document.getElementById("toggleWatchlist");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});
function renderWatchlist() {
  const list = getWatchlist();
  const container = document.getElementById("watchlistItems");

  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = "<p>No movies added 😢</p>";
    return;
  }

  list.forEach(movie => {
    const item = document.createElement("div");
    item.className = "watchItem";

    const poster = movie.poster_path
      ? "https://image.tmdb.org/t/p/w200" + movie.poster_path
      : "";

    item.innerHTML = `
      <img src="${poster}" />
      <p>${movie.title}</p>
    `;

    container.appendChild(item);
  });
}
function addToWatchlist(movie) {
  let list = getWatchlist();

  if (list.some(item => item.id === movie.id)) {
    alert("Already added 😄");
    return;
  }

  list.push(movie);
  saveWatchlist(list);

  renderWatchlist(); 
}
window.addEventListener("scroll", () => {
  console.log("scrolling...");
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 500) {
    page++;
    getData()
  }
});
getData()