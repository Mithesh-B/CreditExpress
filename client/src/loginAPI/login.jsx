import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { message, Tooltip, Button } from "antd";
import axios from "axios";
import { useState } from "react";
import "./login.scss";


const Login = () => {
  const Navigate = useNavigate();
  const [buttonText, setButtonText] = useState("Sign-In");
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

    if (!formValues.email || !formValues.password) {
      message.error("Please fill in all fields");
      return;
    }
    setButtonText("Preparing your portal..");

    axios
      .post(`${import.meta.env.VITE_API}/login`, formValues)
      .then((res) => {
        if (res.data.message === "Invalid credentials") {
        } else {
          window.sessionStorage.setItem("isLoggedIn", true);
          window.sessionStorage.setItem("userID", res.data?.userId);
          window.location.reload();
          Navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
        setButtonText("errr..or! :(");
        message.error("please check your email or password and try again");
      });
  };

  const multilineContent = (
    <div>
      Note: Login might take few minutes beacuse server will be inactive due to use of free deployment on render.com <br /><br />
      Admin account- <br /> 
      email: admin@mail.com <br /> password: 123 <br />
      <br />
      Customer account- <br />
      email: test2@mail.com <br /> password: 123 <br />
    </div>
  );

  return (
    <div className="login-container">
      <div className="left">
        <h1 className="left-title">
          Credit <br /> Express
        </h1>
      </div>
      <div className="right">
        <div className="right-container">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "normal",
            }}
          >
            <h1 className="right-title">Sign-in</h1>
            <Tooltip title={multilineContent}>
              <Button>Hover me</Button>
            </Tooltip>
          </div>

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
              <button
                className="login-button"
                type="submit"
         
              >
                {buttonText}
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
