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
      .filter((book) => book.title && book.title.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10);

    if (filteredBooks.length === 0) {
      booksContainer.innerHTML = "<p>No relevant books found.</p>";
      return;
    }

    // Clear loading message and display the books
    booksContainer.innerHTML = "";
    filteredBooks.forEach((book) => {
      const title = book.title || "No Title Available";
      const coverId = book.cover_i;
      const coverUrl = coverId
        ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
        : "https://via.placeholder.com/150?text=No+Image";

      // Highlight query term in the title
      // const highlightedTitle = title.replace(
      //   new RegExp(query, "gi"),
      //   (match) => `<span style="background: yellow;">${match}</span>`
      // );

      booksContainer.insertAdjacentHTML(
        "beforeend",
        `<div class="book-card">
            <div class="book-cover">
              <img src="${coverUrl}" alt="${title}" />
              <p>${title}</p>
            </div>
            <div class="cover-buttons">
              <button>Add to favorites</button>
              <button>Add to read list</button>
            </div>
          </div>`
      );
    });
  } catch (error) {
    console.error("Error:", error);
    booksContainer.innerHTML = `<p>Something went wrong while fetching books. Please try again.</p>`;
  }
};

// Event listener
const searchButton = document.getElementById("search-button");
const booksContainer = document.getElementById("books-container");

searchButton.addEventListener("click", () => {
  const query = document.getElementById("search-bar").value.trim();
  if (query) {
    booksContainer.innerHTML = ""; // Clear previous results
    searchBooks(query); // Call searchBooks with the query
  } else {
    booksContainer.innerHTML = "<p>Please enter a search term.</p>";
  }
});
