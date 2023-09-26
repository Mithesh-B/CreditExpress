import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from 'react';
import "./login.scss"

const Login = () => {

     let Navigate = useNavigate();
     let [formValues, handleForm] = useState({
       email: "",
       password: "",
     });
    let handleChange = (event) => {
      let { name, value } = event.target;
      handleForm({
        ...formValues,
        [name]: value,
      });
    };

    let login = (e) => {
          e.preventDefault()
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
    <div>
      <h1 >Credit Express</h1>
      <h1>Log-in</h1>
      <div >
        <label>Enter your e-mail:</label>
        <input
          value={formValues.email}
          name="email"
          onChange={handleChange}
          type="email"
          placeholder="Your email"
        ></input>
        <label>Enter your password:</label>
        <input
          value={formValues.password}
          name="password"
          onChange={handleChange}
          type="password"
          placeholder="Your password"
        ></input>
        <button onClick={login}>Log-In</button>
      </div>
      <p>
        New customer?<Link to="/register">Register Here</Link>
      </p>
    </div>
  );
}

export default Login
