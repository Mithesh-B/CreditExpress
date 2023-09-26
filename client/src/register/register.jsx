import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function RegisterPage() {
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    isAdmin: true, 
  });


  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const register = () => {
    const { username, email, password, confirmPassword } = formValues;

    if (username && email && password && password === confirmPassword) {

      const formData = {
        username,
        email,
        password,
        isAdmin: formValues.isAdmin,
      };

      axios
        .post("http://localhost:3000/register", formData)
        .then((res) => {
          alert(res.data.message);
          navigate("/");
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      alert("please check your password and try again");
    }
  };

  return (
    <div>
      <h1>Credit Express</h1>
      <h1>Register</h1>
      <div>
        <label>Enter your name:</label>
        <input
          name="username"
          value={formValues.username}
          onChange={handleChange}
          type="text"
          placeholder="Your username"
        ></input>
        <label>Enter your e-mail:</label>
        <input
          name="email"
          value={formValues.email}
          onChange={handleChange}
          type="email"
          placeholder="Your email"
        ></input>
        <label>Enter your password:</label>
        <input
          name="password"
          value={formValues.password}
          onChange={handleChange}
          type="password"
          placeholder="Your password"
        ></input>
        <label>Re-enter your password:</label>
        <input
          name="confirmPassword"
          value={formValues.confirmPassword}
          onChange={handleChange}
          type="password"
          placeholder="confirm password"
        ></input>
        <button onClick={register}>Register</button>
      </div>
      <p>
        Back to <Link to="/">Sign-In</Link>
      </p>
    </div>
  );
}

export default RegisterPage;
