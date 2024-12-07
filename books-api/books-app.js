const path = require("path");
const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

//const filePath = path.join(__dirname, process.env.BOOKS_FOLDER, 'books.txt');
//const filePath = path.join(__dirname, "books", "books.txt");

const app = express();

const mongoose = require("mongoose");

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/mybooks";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

const extractAndVerifyToken = async (headers) => {
  if (!headers.authorization) {
    throw new Error("No token provided.");
  }
  const token = headers.authorization.split(" ")[1]; // expects Bearer TOKEN

  //const response = await axios.get(`http://localhost:82/verify-token/` + token);
  const response = await axios.get(`http://${process.env.AUTH_ADDRESS}/verify-token/`+ token);
  return response.data.uid;
};


const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  writer: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
});
const Book = mongoose.model("Book", bookSchema);

app.get("/books", async (req, res) => {
  try {
    const uid = await extractAndVerifyToken(req.headers);
    Book.find({})
    .then((books) => {
      res.status(200).json({ message: 'Books loaded.', books: books });
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
   
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ message: err.message || "Failed to load books." });
  }
});

app.post("/books", async (req, res) => {
  try {
    const uid = await extractAndVerifyToken(req.headers); 
    const newBook = new Book(req.body);

    newBook
      .save()
      .then((book) => {
        res.status(201).json({ message: 'Book stored.', createdBook: book });
      })
      .catch((err) => {
        res.status(400).json({ error: err.message });
      });


  } catch (err) {
    return res.status(401).json({ message: "Could not verify token." });
  }
});

app.delete('/books/:id', (req, res) => {
  const bookId = req.params.id;

  Book.findByIdAndDelete(bookId)
  .then((book) => {
    if (book) {
      res.status(200).json({ message: 'Book deleted', book });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  })
  .catch((err) => {
    res.status(500).json({ error: err.message });
  });
});
//app.listen(8001);
app.listen(8000);
