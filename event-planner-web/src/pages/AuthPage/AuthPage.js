import React, { useState } from "react";
import axios from "axios";
import CryptoJS from "crypto-js";
import "./AuthPage.css";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setFormData({ name: "", email: "", password: "" }); // Clear form data when switching
  };

  // Hash function for deterministic hashing
  const hashPassword = (email, password) => {
    return CryptoJS.SHA256(email + password).toString();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const hashedPassword = hashPassword(formData.email, formData.password);
      if (isLogin) {
        // Login Logic
        const response = await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/login", {
          email: formData.email,
          password: hashedPassword, // Send hash
        });
        alert("Login successful!");
        localStorage.setItem("token", response.data.token);
      } else {
        // Signup Logic
        const response = await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/signup", {
          name: formData.name,
          email: formData.email,
          password: hashedPassword, // Send hash
        });
        alert("Account created successfully!");
      }
    } catch (error) {
      console.error("Error:", error.response?.data?.message || "Something went wrong");
      alert("Error: " + (error.response?.data?.message || "Something went wrong"));
    }
  };

  return (
    <div className="auth-container">
      <h1>{isLogin ? "Log In" : "Sign Up"}</h1>
      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <label>
            Full Name:
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </label>
        )}
        <label>
          Email Address:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
        </label>
        <button type="submit" className="submit-btn">
          {isLogin ? "Log In" : "Sign Up"}
        </button>
      </form>
      <p className="auth-toggle">
        {isLogin
          ? "Don't have an account?"
          : "Already have an account?"}{" "}
        <button onClick={toggleForm} className="toggle-btn">
          {isLogin ? "Sign Up" : "Log In"}
        </button>
      </p>
    </div>
  );
};

export default AuthPage;
