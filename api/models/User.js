// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  loan: {
    loanId: { type: mongoose.Schema.Types.ObjectId, ref: "Loan" },
    loanAmount: { type: Number },
    term: { type: Number },
  },
});

module.exports = mongoose.model("User", userSchema);
