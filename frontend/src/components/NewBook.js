import React, { useState } from "react";

import "./NewBook.css";

function NewBook(props) {
  const [enteredTitle, setEnteredTitle] = useState("");
  const [enteredWriter, setEnteredWriter] = useState("");
  const [enteredDescription, setEnteredDescription] = useState("");
  const [enteredCategory, setEnteredCategory] = useState("");
  const [enteredPrice, setEnteredPrice] = useState("");

  const [categories] = useState([
    "Fiction",
    "Non-Fiction",
    "Science Fiction",
    "Fantasy",
    "Mystery",
    "Biography",
  ]);

  function submitForm(event) {
    event.preventDefault();
    if (
      enteredTitle &&
      enteredTitle.trim().length > 0 &&
      enteredWriter &&
      enteredWriter.trim().length > 0 &&
      enteredDescription &&
      enteredDescription.trim().length > 0 &&
      enteredCategory &&
      enteredCategory.trim().length > 0 &&
      enteredPrice &&
      enteredPrice.trim().length > 0
    ) {
      props.onAddBook({
        title: enteredTitle,
        writer: enteredWriter,
        description: enteredDescription,
        category: enteredCategory,
        price: enteredPrice,
      });
      setEnteredTitle("");
      setEnteredWriter("");
      setEnteredDescription("");
      setEnteredCategory("");
      setEnteredPrice("");
    }
  }

  return (
    <form onSubmit={submitForm}>
      <div className="form-control">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          onChange={(event) => setEnteredTitle(event.target.value)}
          value={enteredTitle}
        ></input>
      </div>
      <div className="form-control">
        <label htmlFor="writer">Writer</label>
        <input
          type="text"
          id="writer"
          onChange={(event) => setEnteredWriter(event.target.value)}
          value={enteredWriter}
        ></input>
      </div>
      <div className="form-control">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          onChange={(event) => setEnteredDescription(event.target.value)}
          value={enteredDescription}
        ></input>
      </div>

      <select
        value={enteredCategory}
        onChange={(event) => setEnteredCategory(event.target.value)}
      >
        <option value="" disabled>
          Select a category
        </option>
        {categories.map((category, index) => (
          <option key={index} value={category}>
            {category}
          </option>
        ))}
      </select>
      <div className="form-control">
        <label htmlFor="price">Price</label>
        <input
          type="number"
          id="price"
          onChange={(event) => setEnteredPrice(event.target.value)}
          value={enteredPrice}
        ></input>
      </div>
      <button type="submit">Add Book</button>
    </form>
  );
}

export default NewBook;
