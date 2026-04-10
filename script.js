const API_KEY = "950726300c0085cae525f81415141462";
const BASE_URL = "https://api.themoviedb.org/3";

// Variables
let page = 1;
let isLoading = false;
let isSearchMode = false;
let currentQuery = "";
let allLoadedMovies = [];

const genreMap = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western"
};

// DOM Elements
const moviesDiv = document.getElementById("movies");
const genreFilter = document.getElementById("genreFilter");
const badge = document.getElementById("activeFilterBadge");
const searchInput = document.getElementById("searchInput");
const searchDropdown = document.getElementById("searchDropdown");
const searchBtn = document.getElementById("searchBtn");
const sortSelect = document.getElementById("sortSelect");
const sidebar = document.getElementById("watchlistSidebar");
const toggleBtn = document.getElementById("toggleWatchlist");
const closeSidebarBtn = document.getElementById("closeSidebar");

function getDataUrl() {
  if (isSearchMode && currentQuery) {
    return `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(currentQuery)}&page=${page}`;
  }
  return `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`;
}

async function getData() {
  if (isLoading || page > 500) return;
  isLoading = true;
  showLoadingIndicator();

  try {
    const response = await fetch(getDataUrl());
    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      if (page === 1) moviesDiv.innerHTML = `<p class="no-results">No movies found.</p>`;
      return;
    }

    data.results.forEach(movie => {
      if (!allLoadedMovies.some(m => m.id === movie.id)) {
        allLoadedMovies.push(movie);
      }
      renderMovieCard(movie);
    });

  } catch (err) {
    console.error("Error fetching movies:", err);
  } finally {
    isLoading = false;
    removeLoadingIndicator();
  }
}

function showLoadingIndicator() {
  let loader = document.getElementById("loader");
  if (!loader) {
    loader = document.createElement("div");
    loader.id = "loader";
    loader.className = "loader";
    loader.innerHTML = `<div class="spinner"></div><p>Loading more movies...</p>`;
    moviesDiv.appendChild(loader);
  }
}

function removeLoadingIndicator() {
  const loader = document.getElementById("loader");
  if (loader) loader.remove();
}

// FIXED renderMovieCard
function renderMovieCard(movie) {
  const poster = movie.poster_path 
    ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` 
    : "https://via.placeholder.com/200x300?text=No+Image";

  const genres = movie.genre_ids
    .map(id => genreMap[id] || "Unknown")
    .join(", ");

  const movieCard = document.createElement("div");
  movieCard.className = "movieCard";

  movieCard.innerHTML = `
    <img src="${poster}" class="movieImage" alt="${movie.title}" loading="lazy"/>
    <div class="movieDetails">
      <a href="https://www.themoviedb.org/movie/${movie.id}" 
         target="_blank" 
         class="movieTitle"
         onclick="event.stopImmediatePropagation()">
        ${movie.title}
      </a>
      <p class="movieRating">⭐ ${movie.vote_average.toFixed(1)}</p>
      <p class="movieGenres">${genres}</p>
      <button class="watchBtn" data-id="${movie.id}">+ Watchlist</button>
    </div>
  `;

  moviesDiv.appendChild(movieCard);

  // Watchlist button
  const watchBtn = movieCard.querySelector(".watchBtn");
  watchBtn.addEventListener("click", (e) => {
    e.stopImmediatePropagation();
    addToWatchlist(movie);
  });

  // Make entire card clickable
  movieCard.style.cursor = "pointer";
  movieCard.addEventListener("click", (e) => {
    if (e.target.closest(".watchBtn")) return;
    window.open(`https://www.themoviedb.org/movie/${movie.id}`, "_blank");
  });
}

// Watchlist Functions
function getWatchlist() {
  return JSON.parse(localStorage.getItem("watchlist")) || [];
}

function saveWatchlist(list) {
  localStorage.setItem("watchlist", JSON.stringify(list));
}

function renderWatchlist() {
  const list = getWatchlist();
  const container = document.getElementById("watchlistItems");
  container.innerHTML = "";

  if (list.length === 0) {
    container.innerHTML = `<p class="empty-watchlist">No movies added yet 😢</p>`;
    return;
  }

  list.forEach(movie => {
    const item = document.createElement("div");
    item.className = "watchItem";

    const poster = movie.poster_path 
      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}` 
      : "";

    item.innerHTML = `
      <img src="${poster}" alt="${movie.title}"/>
      <p>${movie.title}</p>
      <button class="removeBtn">❌</button>
    `;

    item.querySelector(".removeBtn").addEventListener("click", () => {
      removeFromWatchlist(movie.id);
    });

    container.appendChild(item);
  });
}

function addToWatchlist(movie) {
  let list = getWatchlist();
  if (list.some(item => item.id === movie.id)) {
    showToast("Already in Watchlist 😊");
    return;
  }

  list.push(movie);
  saveWatchlist(list);
  renderWatchlist();
  showToast("Added to Watchlist ❤️");
}

function removeFromWatchlist(id) {
  let list = getWatchlist().filter(movie => movie.id !== id);
  saveWatchlist(list);
  renderWatchlist();
  showToast("Removed from Watchlist");
}

function pickRandomMovie() {
  const watchlist = getWatchlist();
  if (watchlist.length === 0) {
    showToast("Add some movies to your watchlist first!");
    return;
  }
  const randomIndex = Math.floor(Math.random() * watchlist.length);
  const randomMovie = watchlist[randomIndex];

  showToast(`🎲 Random Movie Night: ${randomMovie.title}`);
  setTimeout(() => {
    window.open(`https://www.themoviedb.org/movie/${randomMovie.id}`, "_blank");
  }, 1500);
}

function showToast(message) {
  let toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 400);
  }, 2500);
}

// Genre Filter, Search, Sort, Infinite Scroll, Sidebar... (rest remains same)
genreFilter.addEventListener("change", () => {
  const selectedGenreId = Number(genreFilter.value);
  const selectedGenreName = genreFilter.options[genreFilter.selectedIndex].text;

  moviesDiv.innerHTML = "";

  let filtered = allLoadedMovies;
  if (selectedGenreId) {
    filtered = allLoadedMovies.filter(movie => movie.genre_ids.includes(selectedGenreId));
    badge.textContent = `Showing: ${selectedGenreName} (${filtered.length})`;
    badge.style.display = "block";
  } else {
    badge.style.display = "none";
  }

  if (filtered.length === 0) {
    moviesDiv.innerHTML = `<p class="no-results">No movies found for this genre.<br>Scroll down to load more!</p>`;
    return;
  }

  filtered.forEach(movie => renderMovieCard(movie));
});

let debounceTimer;
searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  clearTimeout(debounceTimer);

  if (query.length < 2) {
    searchDropdown.style.display = "none";
    return;
  }

  debounceTimer = setTimeout(() => fetchSuggestions(query), 350);
});

async function fetchSuggestions(query) {
  try {
    const url = `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=1`;
    const res = await fetch(url);
    const data = await res.json();

    const suggestions = data.results.slice(0, 6);

    searchDropdown.innerHTML = suggestions.map(movie => {
      const poster = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` 
        : "https://via.placeholder.com/32x46?text=N/A";

      return `
        <div class="dropdown-item" data-title="${movie.title}">
          <img src="${poster}" alt="${movie.title}"/>
          <span>${movie.title}</span>
        </div>`;
    }).join("");

    searchDropdown.style.display = "block";

    searchDropdown.querySelectorAll(".dropdown-item").forEach(item => {
      item.addEventListener("click", () => {
        searchInput.value = item.dataset.title;
        searchDropdown.style.display = "none";
        searchBtn.click();
      });
    });
  } catch (e) {
    console.error("Suggestion error:", e);
  }
}

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();
  if (!query) return;

  isSearchMode = true;
  currentQuery = query;
  page = 1;
  allLoadedMovies = [];
  moviesDiv.innerHTML = "";
  badge.style.display = "none";

  getData();
});

sortSelect.addEventListener("change", () => {
  const type = sortSelect.value;
  if (!type) return;

  let sorted = [...allLoadedMovies];

  if (type === "rating") {
    sorted.sort((a, b) => b.vote_average - a.vote_average);
  } else if (type === "title") {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  }

  moviesDiv.innerHTML = "";
  sorted.forEach(movie => renderMovieCard(movie));
});

window.addEventListener("scroll", () => {
  if (isLoading) return;

  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 600) {
    page++;
    getData();
  }
});

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("active");
});

closeSidebarBtn.addEventListener("click", () => {
  sidebar.classList.remove("active");
});

document.getElementById("clearWatchlist").addEventListener("click", () => {
  if (confirm("Clear entire watchlist?")) {
    localStorage.removeItem("watchlist");
    renderWatchlist();
  }
});

function createRandomMovieButton() {
  const randomBtn = document.createElement("button");
  randomBtn.id = "randomMovieBtn";
  randomBtn.innerHTML = `🎲 Random Movie Night`;
  randomBtn.style.cssText = `
    position: fixed;
    right: 110px;
    bottom: 30px;
    padding: 12px 24px;
    background: #1f1f1f;
    color: white;
    border: 2px solid #e50914;
    border-radius: 30px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    z-index: 2000;
    transition: all 0.3s ease;
    white-space: nowrap;
  `;

  randomBtn.addEventListener("click", pickRandomMovie);

  randomBtn.addEventListener("mouseenter", () => {
    randomBtn.style.background = "#e50914";
    randomBtn.style.color = "#fff";
  });
  randomBtn.addEventListener("mouseleave", () => {
    randomBtn.style.background = "#1f1f1f";
    randomBtn.style.color = "#fff";
  });

  document.body.appendChild(randomBtn);
}

// Initialize
renderWatchlist();
getData();
createRandomMovieButton();