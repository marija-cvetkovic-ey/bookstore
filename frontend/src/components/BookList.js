import React from "react";

import "./BookList.css";

function BookList(props) {
  const handleDelete = (id) => {
    props.onDeleteBook(id);
  };

  return (
    <ul>
      {props.books.map((book, index) => (
        <li key={index}>
          <div className="book-card-column">
            <h2>{book.title}</h2>
            <p>Writer: {book.writer}</p>
            <p>Description: {book.description}</p>
            <p className="category">{book.category}</p>
          </div>
          <div className="book-card-column">
            <h2 className="price">{book.price} $</h2>
            <button
              className="delete-button"
              onClick={() => handleDelete(book._id)}
            >
              <i className="fas fa-trash-alt"></i>
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default BookList;
