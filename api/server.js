require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const cors = require("cors");
const jsonwebtoken = require("jsonwebtoken");
var { expressjwt: jwt } = require("express-jwt");
const { rateLimit } = require("express-rate-limit");

const app = express();
const PORT = process.env.PORT || 3000;
const JWTSecret = process.env.JWT_SECRET;
//prevent cors error
app.use(cors());

//connect mongoDB (update to .env later)
mongoose
  .connect(process.env.MONGO_URI || 3000, {
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

// Define rate limiting options
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Maximum 100 requests per 15 minutes
});

// Register a new user
app.post("/register", limiter, async (req, res) => {
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
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isAdmin,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// post request to login
app.post("/login", limiter, async (req, res) => {
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
    const token = generateToken(user);
    res.status(200).json({ message: "Login successful", userId: user._id, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

// Middleware for generating JWT token
function generateToken(user) {
  return jsonwebtoken.sign(
    { _id: user._id, isAdmin: user.isAdmin },
    JWTSecret,
    { expiresIn: "1d" } // Token expiration time (1 day)
  );
}

// Middleware for JWT token validation
const requireAuth = jwt({
  secret: JWTSecret,
  algorithms: ["HS256"],
});

//post request to avail a loan
app.post("/loan/:userId", requireAuth, limiter, async (req, res) => {
  try {
    const { loanAmount, term, requestDate, status } = req.body;
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user has an active loan or if the previous loan is paid
    if (!user.loan || user.loan.isPaid || user.loan.status === "DISABLED") {
      // Create a new loan object for the user
      user.loan = {
        loanAmount,
        term,
        requestDate,
        status,
        paidAmount: 0,
        isPaid: false,
        installmentPayments: [],
      };
    } else {
      return res.status(400).json({
        message: "Cannot create a new loan. Active loan or unpaid loan exists.",
      });
    }

    await user.save();

    res.status(200).json({ message: "New loan created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

//post request for loan repayment
app.post("/repay/:userId", requireAuth, limiter, async (req, res) => {
  try {
    const { repaymentAmount, installmentNumber } = req.body;
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const repaymentAmountNumber = parseFloat(repaymentAmount);

    // Check if the loan is active and not paid yet
    if (user.loan.status === "ACTIVE" && !user.loan.isPaid) {
      // Check if the installment is already paid
      if (
        user.loan.installmentPayments.some(
          (payment) => payment.installmentNumber === installmentNumber
        )
      ) {
        return res.status(400).json({ message: "Installment already paid" });
      }

      // Update the paid amount and deduct it from the remaining loan amount
      user.loan.paidAmount += repaymentAmountNumber;
      user.loan.loanAmount -= repaymentAmountNumber;

      // Check if the loan is fully paid
      if (user.loan.loanAmount <= 0) {
        user.loan.isPaid = true;
        user.loan.status = "DISABLED";
      }

      // Add the payment to the installmentPayments array
      user.loan.installmentPayments.push({
        installmentNumber,
        paymentAmount: repaymentAmountNumber,
      });

      await user.save();

      res.status(200).json(user.loan);
    } else {
      res.status(400).json({ message: "Loan is not active or already paid" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

//get loan status for specific user
app.get("/loan-status/:userId", limiter, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the loan status and other loan details
    const loanStatus = user.loan.status;
    const isLoanPaid = user.loan.isPaid;
    const loanAmount = user.loan.loanAmount;
    const term = user.loan.term;
    const requestDate = user.loan.requestDate;
    const installment = user.loan.installmentPayments;
    const isAdmin = user.isAdmin;

    res.status(200).json({
      loanStatus,
      isLoanPaid,
      loanAmount,
      term,
      requestDate,
      installment,
      isAdmin,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
//get all users loan details
app.get("/all-loans", limiter, async (req, res) => {
  try {
    // Find all users with their loan objects
    const users = await User.find({}, { username: 1, loan: 1 });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});
//post req to update loan status by admin
app.post("/approve-loan/:userId", requireAuth, limiter, async (req, res) => {
  try {
    const userId = req.params.userId;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user's loan status is "PENDING"
    if (user.loan.status === "PENDING") {
      // Change the loan status to "ACTIVE"
      user.loan.status = "ACTIVE";
      await user.save();

      res
        .status(200)
        .json({ message: "Loan approved and status changed to ACTIVE" });
    } else {
      res.status(400).json({ message: "Loan is not in PENDING status" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running`);
});
