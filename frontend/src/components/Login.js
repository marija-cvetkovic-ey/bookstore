import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import Cookies from "js-cookie";
import "./Login.css";
const Login = () => {
  const USER_PATH = "localhost:8080";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const loginHandler = async (email, password) => {
    const response = await fetch(`http://${USER_PATH}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: email, password: password }),
    });
    const data = await response.json();

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await loginHandler(email, password);
    console.log(data);
    if (data && data.token) {
      Cookies.set("userToken", data.token, { expires: 1 });
      history.push("/home");
    } else {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
