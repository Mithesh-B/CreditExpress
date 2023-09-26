import React from 'react'
import { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

const Products = () => {
  
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);

  const userId = sessionStorage.getItem("userID");

  useEffect(() => {
    const apiUrl = `http://localhost:3000/loan/${userId}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setLoans(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []); 

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/")
        window.location.reload();
  };
  return (
    <div>
      <h1>Loan List</h1>
      <h3>{loans?.loanAmount || loans?.message}</h3>
      <h3>{loans?.term}</h3>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}


export default Products
