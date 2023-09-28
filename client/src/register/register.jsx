import React, { useState } from "react";
import { Link } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import "../loginAPI/login.scss";

function RegisterPage() {
  const [formValues, setFormValues] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    isAdmin: false,
  });
  //handle form
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  //register a new user
  const register = (e) => {
    e.preventDefault();
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
          message.success("Sucessfully registered. Please sign-in");
        })
        .catch((err) => {
          console.log(err);
          message.error("email is already registered");
        });
    } else {
      message.error("please check your password and try again");
    }
  };

  return (
    <div className="login-container">
      <div className="left">
        <h1 className="left-title">
          Credit <br /> Express
        </h1>
      </div>
      <div className="right">
        <div className="right-container">
          <h1 className="right-title">Register</h1>
          <p className="right-subtitle">Register your account</p>
          <form className="login-form" onSubmit={register}>
            <div className="form-container">
              <label className="form-label">Your name</label>
              <input
                className="input-field"
                name="username"
                value={formValues.username}
                onChange={handleChange}
                type="text"
                placeholder="Your username"
              ></input>
              <label className="form-label">Email address</label>
              <input
                className="input-field"
                value={formValues.email}
                name="email"
                onChange={handleChange}
                type="email"
                placeholder="Your email"
              ></input>
              <label className="form-label">Password</label>
              <input
                className="input-field"
                value={formValues.password}
                name="password"
                onChange={handleChange}
                type="password"
                placeholder="Your password"
              ></input>
              <label className="form-label">Confirm password</label>
              <input
                className="input-field"
                name="confirmPassword"
                value={formValues.confirmPassword}
                onChange={handleChange}
                type="password"
                placeholder="confirm password"
              ></input>
              <button className="login-button" type="submit">
                Register
              </button>
            </div>
          </form>
          <p className="new-customer">
            Back to
            <Link to="/" className="new-customer-link">
              Sign-In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );

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
