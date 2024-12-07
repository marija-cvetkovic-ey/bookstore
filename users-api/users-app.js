const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");
const fs = require("fs");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});

const DATA_FILE = path.join(__dirname, "data", "users.json");

const readUsers = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, "utf8");
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Error reading users file:", error);
    return [];
  }
};

const writeUsers = (users) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error("Error writing users file:", error);
  }
};

app.post("/signup", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (
    !password ||
    password.trim().length === 0 ||
    !email ||
    email.trim().length === 0
  ) {
    return res
      .status(422)
      .json({ message: "An email and password needs to be specified!" });
  }

  try {
    const hashedPW = await axios.get(
      `http://${process.env.AUTH_ADDRESS}/hashed-password/` + password
    );

    const users = readUsers();
    if (users.find((u) => u.email === email)) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }
    users.push({ email, password });
    writeUsers(users);

    res.status(201).json({ message: "User created!" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Creating the user failed - please try again later." });
  }
});

app.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (
    !password ||
    password.trim().length === 0 ||
    !email ||
    email.trim().length === 0
  ) {
    return res
      .status(422)
      .json({ message: "An email and password needs to be specified!" });
  }

  const hashedPassword = password + "_hash";

  const response = await axios.get(
    `http://${process.env.AUTH_SERVICE_SERVICE_HOST}/token/` +
      hashedPassword +
      "/" +
      password
  );

  const users = readUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (user && response.status === 200) {
    return res.status(200).json({ token: response.data.token });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }
});

app.listen(8080, () => {
  console.log(`Server is running on port 8085`);
});
