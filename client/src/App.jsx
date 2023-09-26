import Login from "./loginAPI/login.jsx";
import Products from "./dashboard/dashboard.jsx";
import RegisterPage from "./register/register.jsx";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
 const signIn = sessionStorage.getItem("isLoggedIn");

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={signIn ? <Products /> : <Login />}></Route>
 
          <Route path="/register" element={<RegisterPage />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
