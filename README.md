# 🎬 Movie Watchlist Web App

## 📌 Project Overview

The **Movie Watchlist Web App** is a web-based application that allows users to search for movies, view their details, and maintain a personalized watchlist. The goal of this project is to create a user-friendly platform where users can easily discover movies and organize what they want to watch later.

This project focuses on implementing core web development concepts such as API integration, DOM manipulation, filtering, and local storage using **HTML, CSS, and JavaScript**.

---

## 🎯 Purpose of the Project

* To help users **search and explore movies**
* To allow users to **save and manage a watchlist**
* To practice **real-world web development skills**
* To build an interactive UI similar to modern streaming platforms

---

## 🔌 API Used

### OMDb API (Open Movie Database)

* API Link: https://www.omdbapi.com/
* The API provides:

  * Movie titles
  * Posters
  * Release year
  * Genre
  * IMDb ratings
  * Plot and other details

The API will be used to fetch movie data based on user search queries.

---

## 🚀 Planned Features

### 🔍 Search Functionality

* Users can search for movies using a search bar
* Results are fetched from the OMDb API and displayed dynamically

### 🎬 Movie Display

* Movies will be shown in card format
* Each card includes:

  * Poster
  * Title
  * Year
  * Rating

### ⭐ Watchlist Feature

* Users can add movies to their watchlist
* Movies can be removed from the watchlist
* Watchlist will be stored using **localStorage**

### 🎯 Filtering Options

* Filter movies by:

  * Genre
  * IMDb Rating
  * Year
* Filtering will be implemented on the client side using JavaScript

### 📭 Empty States

* Display messages when:

  * No search results are found
  * Watchlist is empty

### 🎲 Random Movie Feature (Optional)

* Selects a random movie from the watchlist for users to watch

---

## 🎨 UI/UX Design

* Dark theme inspired by platforms like Netflix and Disney+
* Clean and responsive layout
* Sticky sidebar for watchlist display
* Interactive buttons and smooth user experience

---

## 🛠️ Technologies Used

* **HTML** – Structure of the web page
* **CSS** – Styling and layout
* **JavaScript** – Functionality and API integration
* **OMDb API** – Fetching movie data
* **LocalStorage** – Saving user watchlist

---

## ⚙️ Setup Instructions

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/movie-watchlist.git
   ```

2. Navigate to the project folder:

   ```bash
   cd movie-watchlist
   ```

3. Open `index.html` in your browser

4. Add your OMDb API key in `script.js`:

   ```js
   const apiKey = "YOUR_API_KEY";
   ```

---

## 📈 Future Enhancements

* Add movie details page (plot, actors, runtime)
* Implement sorting (A-Z, rating, year)
* Add live search with debounce
* Improve UI animations and transitions
* Integrate additional APIs (like TMDB)

---

## ✅ Conclusion

This project demonstrates the ability to build a functional and interactive web application using core web technologies. It highlights skills such as API handling, dynamic UI updates, and user data management.

---

## 👤 Author

* Naman Saini

---
