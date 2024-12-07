import React, { useState, useEffect, useCallback } from "react";

import "./Home.css";
import NewBook from "./NewBook";
import BookList from "./BookList";

function Home() {
  const [books, setBooks] = useState([]);
  const BOOK_PATH = "localhost:8000";

  const fetchBooks = useCallback(function () {
    fetch(`http://${BOOK_PATH}/books`, {
      headers: {
        Authorization: "Bearer abc",
      },
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (jsonData) {
        setBooks(jsonData.books);
      });
  }, []);

  useEffect(
    function () {
      fetchBooks();
    },
    [fetchBooks]
  );

  function addBookHandler(book) {
    fetch(`http://${BOOK_PATH}/books`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer abc",
      },
      body: JSON.stringify(book),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (resData) {
        setBooks((prevState) => [...prevState, resData.createdBook]);
      });
  }

  const deleteBookHandler = (id) => {
    fetch(`http://${BOOK_PATH}/books/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          setBooks(books.filter((book) => book._id !== id));
        } else {
          console.error("Error deleting book");
        }
      })
      .catch((error) => console.error("Error deleting book:", error));
  };

  return (
    <div className="App">
      <section>
        <NewBook onAddBook={addBookHandler} />
      </section>
      <section className="list-books">
        <button onClick={fetchBooks}>Fetch Books</button>
        <BookList books={books} onDeleteBook={deleteBookHandler} />
      </section>
    </div>
  );
}

export default Home;
