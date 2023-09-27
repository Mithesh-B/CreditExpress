import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Button, Input, message } from "antd";
import Admin from "../admin/admin";
import "./dashboard.scss"


const Products = () => {
  const navigate = useNavigate();
  const [loan, setLoan] = useState([]);
  const [loanAmount, setLoanAmount] = useState("");
  const [term, setTerm] = useState("");
  const [requestDate, setRequestDate] = useState("2022-02-07");
  const [installments, setInstallments] = useState([]);
    const [loading, setLoading] = useState(true);

  const userId = sessionStorage.getItem("userID");

  useEffect(() => {
    const apiUrl = `http://localhost:3000/loan-status/${userId}`;

    fetch(apiUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setLoan(data);
           setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
           setLoading(false);
      });
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API call to send the loan request data to the backend
      const response = await axios.post(
        `http://localhost:3000/loan/${userId}`,
        {
          loanAmount: parseFloat(loanAmount), // Ensure loan amount is a number
          term: parseInt(term), // Ensure term is an integer
          requestDate: requestDate,
          status: "PENDING", // Set the initial status to PENDING
        }
      );

      // Handle success, e.g., show a success message or redirect to a confirmation page
          message.success("Successfully submitted a loan request, please wait for approval");

      // Clear the form fields after submission
      setLoanAmount("");
      setTerm("");
      setRequestDate("2022-02-07");
    } catch (error) {
        message.error(
          "Cannot create a new loan. Active loan or unpaid loan exists"
        );
      // Handle error, e.g., display an error message to the user
    }
  };

  const onPaymentSubmit = async (paymentAmount, installmentNumber) => {
    try {
      // Make a POST request to your backend API to submit the payment
      const response = await fetch(`http://localhost:3000/repay/${userId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          repaymentAmount: paymentAmount,
          installmentNumber: installmentNumber,
        }),
      });

      if (response.status === 200) {
        message.success("Status updated successfully");
        window.location.reload();
      } else {
        // Handle error responses from the server
        const data = await response.json();
        alert(data.message); // Display an error message to the user
      }
    } catch (error) {
      console.error(error);
      // Handle network or other errors here
      alert("Error submitting payment");
    }
  };

  useEffect(() => {
    if (loan && loan.term) {
      const term = parseInt(loan.term, 10);
      const loanAmount = parseFloat(loan.loanAmount); // Parse as a float

      const installmentAmount = loanAmount / term;

      const dueDates = [];
      for (let i = 0; i < term; i++) {
        const dueDate = new Date(loan.requestDate);
        dueDate.setDate(dueDate.getDate() + 7 * i); // Assuming 1 week term
        dueDates.push(dueDate.toDateString());
      }

      const installmentsData = dueDates.map((dueDate, index) => ({
        installmentNumber: index + 1,
        dueDate,
        amount: installmentAmount.toFixed(2),
      }));

      setInstallments(installmentsData);
    }
  }, [loan]);

  const handlePaymentChange = (index, amount) => {
    const updatedInstallments = [...installments];
    updatedInstallments[index].paymentAmount = amount;
    setInstallments(updatedInstallments);
  };

  const handlePaymentSubmit = (index) => {
    if (installments[index].paymentAmount <= 0) {
      alert("Payment amount must be greater than zero.");
      return;
    }

    onPaymentSubmit(
      installments[index].paymentAmount,
      installments[index].installmentNumber
    );

    // Update the payment status for this installment
  };

  if (loan.loanStatus === "DISABLED" || loan.loanStatus === "PENDING" && !loan.isAdmin) {
    return (
      <div>
        {" "}
        <div className="hero">
          <div>
            <h1 className="h-title">
              Get your loan in <br />2 steps! <br />
              It's that easy
            </h1>
            <div className="form-bg">
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="loanAmount">Loan Amount:</label>
                  <input
                    type="number"
                    id="loanAmount"
                    placeholder="enter your loan amount"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="term">Term (in weeks):</label>
                  <input
                    type="number"
                    id="term"
                    placeholder="enter your term"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="requestDate">Request Date:</label>
                  <input
                    type="date"
                    id="requestDate"
                    value={requestDate}
                    onChange={(e) => setRequestDate(e.target.value)}
                    required
                  />
                </div>
                <div style={{display: "flex", justifyContent: "space-between"}}>
                <button type="submit">Submit Request</button>
                <button onClick={handleLogout}>Logout</button>
                </div>
              </form>
            </div>
          </div>
          <div className="h-img">
            <img src="../cover-image.png" alt="hero" />
            <p className="img-txt">
              Need a quick and hassle-free way to secure a personal loan? Look
              no further! Our App is your go-to solution for all your short-term
              financial needs. With a user-friendly interface and a seamless
              application process, you can request a loan with ease.
            </p>
          </div>
        </div>
      </div>
    );
  } 

  // Get the last object in the installment array
  const lastInstallment = loan?.installment?.slice(-1)[0];

  // Get the installmentNumber of the last installment
  const lastInstallmentNumber = lastInstallment?.installmentNumber || 0;
  console.log(lastInstallmentNumber);

  const columns = [
    {
      title: "Installments",
      dataIndex: "installmentNumber",
      key: "installmentNumber",
      width: 150,
    },
    {
      title: "Due Payment Date",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 250,
    },
    {
      title: "Loan Amount",
      dataIndex: "amount",
      key: "amount",
      width: 250,
      render: (text, record, index) => {
        // Display the loan amount based on installment payment status
        return loan.installment[index] &&
          loan.installment[index].paymentAmount > 0
          ? "$0.00"
          : `$${(
              loan.loanAmount /
              (installments.length - lastInstallmentNumber)
            ).toFixed(2)}`;
      },
    },
    {
      title: "Payment Amount",
      dataIndex: "paymentAmount",
      key: "paymentAmount",
      width: 200,
      render: (text, record, index) => {
        // Display the payment amount from the GET response if it exists
        return loan.installment[index] ? (
          `$${loan.installment[index].paymentAmount.toFixed(2)}`
        ) : (
          <Input
            type="number"
            value={installments[index].paymentAmount}
            onChange={(e) => handlePaymentChange(index, e.target.value)}
          />
        );
      },
    },
    {
      title: "Action",
      key: "action",
      width: 250,
      render: (text, record, index) => {
        if (!record.isPaid) {
          return (
            <Button onClick={() => handlePaymentSubmit(index)}>
              Submit Payment
            </Button>
          );
        }
        return null; // No action button if the installment is already paid
      },
    },
  ];

   if (loading) {
     return <div>Loading...</div>; // You can customize this loading indicator
   }

  return loan.isAdmin ? (
    <Admin />
  ) : (
    <div className="header-container">
      <div className="db-container">
        <div className="db-heading">
          <h1>Your Loan Details</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
        <h3>Loan amount to be paid : ${loan?.loanAmount}</h3>
        <h3>Installment Term: {loan?.term}</h3>
        <h3>Term start: {loan?.requestDate}</h3>
      </div>
      <div className="table-width">
        <Table
          dataSource={installments}
          columns={columns}
          loading={loading}
          size="medium"
          pagination={false}
          rowKey="installmentNumber"
        />
      </div>
    </div>
  );
  
}
export default Products;
