import React, { useState } from "react";
import axios from "axios";
import API_URL from "../../config";

const SignupCard = ({ onClose , onSignup }) => {
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    username: "",
    phonenumber: "",
    email: "",
    password: "",
    role: "user", // default role
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`${API_URL}/api/auth/signup`, formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));

      setSuccess("Signup successful! You can now log in.");
      onClose();
      alert("Signup successful!");
      onSignup(data); // Pass user data to parent component
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
      setSuccess("");
    }
  };

  return (
    <div className="login-overlay">
      <div className="login-card">
        <h2>Signup</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "lightgreen" }}>{success}</p>}
        <form onSubmit={handleSignup}>
          <input type="text" name="firstname" placeholder="First Name" onChange={handleChange} required />
          <input type="text" name="lastname" placeholder="Last Name" onChange={handleChange} required />
          <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
          <input type="text" name="phonenumber" placeholder="Phone Number" onChange={handleChange} required />
          <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit" className="login-btn">Signup</button>
        </form>
        <button onClick={onClose} className="cancel-btn">Cancel</button>
      </div>
    </div>
  );
};

export default SignupCard;
