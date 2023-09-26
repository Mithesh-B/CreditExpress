
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const cors = require("cors");

const app = express();
app.use(cors());



mongoose
  .connect("mongodb://127.0.0.1/creditExpress", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: " + err.message);
  });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Register a new user
app.post("/register", async (req, res) => {
  try {
    const { username, email, password, isAdmin } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user
    const newUser = new User({ username, email, password: hashedPassword, isAdmin });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the stored hash
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // If the login is successful, send the user's ID in the response
    res.status(200).json({ message: "Login successful", userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/loan/:userId", async (req, res) => {
  try {
    const { loanAmount, term } = req.body;
    const userId = req.params.userId; // Get the user ID from the URL parameter

    // Find the user by ID (you should validate it)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Store the loan data for the user
    user.loan.loanAmount = loanAmount;
    user.loan.term = term;

    await user.save();

    res.status(200).json({ message: "Loan data stored successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/loan/:userId", async (req, res) => {
  try {
    const userId = req.params.userId; // Get the user ID from the URL parameter

    // Find the user by ID (you should validate it)
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has loan data
    if (!user.loan || !user.loan.loanAmount || !user.loan.term) {
      return res
        .status(404)
        .json({ message: "Loan data not found for this user" });
    }

    // Retrieve loan data for the user
    const loanAmount = user.loan.loanAmount;
    const term = user.loan.term;

    res.status(200).json({ loanAmount, term });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});









app.listen(3000, () => {
  console.log(`Server is running`);
});


