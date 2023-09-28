import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import "./login.scss";

const Login = () => {
  const Navigate = useNavigate();
  const [formValues, handleForm] = useState({
    email: "",
    password: "",
  });

  //handle form
  const handleChange = (event) => {
    const { name, value } = event.target;
    handleForm({
      ...formValues,
      [name]: value,
    });
  };

  //API that sends email and password to backend for validation.(bcrypt is used for hashing)
  const login = (e) => {
    e.preventDefault();
    axios
      .post("http://localhost:3000/login", formValues)
      .then((res) => {
        if (res.data.message === "Wrong Credentials!") {
          alert(res.data.message);
        } else {
          window.sessionStorage.setItem("isLoggedIn", true);
          window.sessionStorage.setItem("userID", res.data?.userId);
          window.location.reload();
          Navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
          <h1 className="right-title">Sign-in</h1>
          <p className="right-subtitle">Sign in to your account</p>
          <form className="login-form" onSubmit={login}>
            <div className="form-container">
              <label className="form-label">Enter your e-mail:</label>
              <input
                className="input-field"
                value={formValues.email}
                name="email"
                onChange={handleChange}
                type="email"
                placeholder="Your email"
              ></input>
              <label className="form-label">Enter your password:</label>
              <input
                className="input-field"
                value={formValues.password}
                name="password"
                onChange={handleChange}
                type="password"
                placeholder="Your password"
              ></input>
              <button className="login-button" type="submit">
                Sign-In
              </button>
            </div>
          </form>
          <p className="new-customer">
            New customer?
            <Link to="/register" className="new-customer-link">
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
