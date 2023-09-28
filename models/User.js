//user schema

const mongoose = require("mongoose");

const installmentPaymentSchema = new mongoose.Schema({
  installmentNumber: { type: Number, required: true },
  paymentAmount: { type: Number, required: true },
});

const loanSchema = new mongoose.Schema({
  loanAmount: { type: Number },
  term: { type: Number },
  requestDate: { type: String },
  status: { type: String },
  paidAmount: { type: Number, default: 0 }, 
  isPaid: { type: Boolean, default: false }, 
  installmentPayments: [installmentPaymentSchema],
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  loan: {
    type: loanSchema,
    default: { loanAmount: null, term: null, requestDate: null, status : "DISABLED"},
  },
});

module.exports = mongoose.model("User", userSchema);

