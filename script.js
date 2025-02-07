let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

const saveFavorites = () => {
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

// Function to render favorite book

const renderFavorites = () => {
  const favBookContainer = document.getElementById("fav-books-container");
  if (!favBookContainer) return;
  favBookContainer.innerHTML = "";

  if (favorites.length === 0) {
    favBookContainer.innerHTML = "<p>No favorite books yet.</p>";
    return;
  }

  favorites.forEach((book, index) => {
    favBookContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="book-card">
          <div class="book-cover">
            <img src="${book.coverUrl}" alt="${book.title}" />
            <p>${book.title}</p>
          </div>
          <div class="cover-buttons">
            <button class="remove-favorite" data-index="${index}">Remove</button>
          </div>
        </div>`
    );
  });

  document.querySelectorAll(".remove-favorite").forEach((button) => {
    button.addEventListener("click", (e) => {
      const index = e.target.getAttribute("data-index");
      favorites.splice(index, 1);
      saveFavorites();
      renderFavorites();
    });
  });
};

// Function to render books
const renderBooks = (books) => {
  booksContainer.innerHTML = ""; // Clear previous results

  books.forEach((book) => {
    const title = book.title || "No Title Available";
    const coverId = book.cover_i;
    const coverUrl = coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
      : "https://via.placeholder.com/150?text=No+Image";

    // Create book card with a favorite button
    booksContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="book-card">
          <div class="book-cover">
            <img src="${coverUrl}" alt="${title}" />
            <p>${title}</p>
          </div>
          <div class="cover-buttons">
            <button class="favorite-button" data-title="${title}" data-cover="${coverUrl}">
              Add to Favorites
            </button>
            <button>Add to Read List</button>
          </div>
        </div>`
    );
  });
  const favoritesButton = document.querySelectorAll(".favorite-button");

  favoritesButton.forEach((button) => {
    button.addEventListener("click", (e) => {
      const title = e.target.getAttribute("data-title");
      const coverUrl = e.target.getAttribute("data-cover");

      const isAlreadyFavorite = favorites.some((fav) => fav.title === title);

      if (!isAlreadyFavorite) {
        favorites.push({ title, coverUrl });
        saveFavorites();
        e.target.textContent = "Added to favorites";
        e.target.disabled = true;
        renderFavorites();
        console.log(favorites);
      } else {
        alert("This book is already in your favorites!");
      }
    });
  });
};

const searchBooks = async (query) => {
  try {
    if (!query) {
      booksContainer.innerHTML = "<p>Please enter a valid search term.</p>";
      return;
    }

    booksContainer.innerHTML = "<p>Loading...</p>"; // Show loading message

    const response = await fetch(
      `https://openlibrary.org/search.json?q=${query}`
    );

    if (!response.ok) throw new Error("Failed to fetch books");
    const data = await response.json();

    // Filter books with a defined title and matching query
    const filteredBooks = data.docs
      .filter(
        (book) =>
          book.title && book.title.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 10);

    if (filteredBooks.length === 0) {
      booksContainer.innerHTML = "<p>No relevant books found.</p>";
      return;
    }

    renderBooks(filteredBooks);
  } catch (error) {
    console.error("Error:", error);
    booksContainer.innerHTML = `<p>Something went wrong while fetching books. Please try again.</p>`;
  }
};

const booksContainer = document.getElementById("books-container");
const searchButton = document.getElementById("search-button");

document.addEventListener("DOMContentLoaded", () => {
  console.log("JavaScript loaded");

  if (searchButton) {
    searchButton.addEventListener("click", () => {
      const query = document.getElementById("search-bar").value.trim();
      if (query) {
        booksContainer.innerHTML = "";
        searchBooks(query);
      } else {
        booksContainer.innerHTML = "<p>Please enter a search term.</p>";
      }
    });
  } else {
    console.warn("searchButton not found. Skipping event listener setup.");
  }

  renderFavorites();
});
