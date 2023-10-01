import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Table, Button, Input, message } from "antd";
import Admin from "../admin/admin";
import "./dashboard.scss";


const Dashboard = () => {
  const navigate = useNavigate();
  const [loan, setLoan] = useState([]);
  const [loanAmount, setLoanAmount] = useState("");
  const [term, setTerm] = useState("");
  const [requestDate, setRequestDate] = useState("2023-02-07");
  const [installments, setInstallments] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = sessionStorage.getItem("userID");

  //gets current user data on login
  useEffect(() => {
    const apiUrl = `${import.meta.env.VITE_API}/loan-status/${userId}`;

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

  //logs out the user
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
    window.location.reload();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API call to send the loan request data
      const response = await axios.post(
        `${import.meta.env.VITE_API}/loan/${userId}`,
        {
          loanAmount: parseFloat(loanAmount),
          term: parseInt(term),
          requestDate: requestDate,
          status: "PENDING",
        }
      );

      // Handle success
      message.success(
        "Successfully submitted a loan request, please wait for approval"
      );

      // Clear the form fields after submission
      setLoanAmount("");
      setTerm("");
      setRequestDate("2023-02-07");
    } catch (error) {
      message.error(
        "Cannot create a new loan. Active loan or unpaid loan exists"
      );
    }
  };

  const onPaymentSubmit = async (paymentAmount, installmentNumber) => {
    try {
      // Make a POST request to submit installments
      const response = await fetch(
        `${import.meta.env.VITE_API}/repay/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            repaymentAmount: paymentAmount,
            installmentNumber: installmentNumber,
          }),
        }
      );

      if (response.status === 200) {
        message.success("Status updated successfully");
        window.location.reload();
      } else {
        // Handle error response
        const data = await response.json();
        message.error("Installment already paid");
      }
    } catch (error) {
      console.error(error);

      message.error("Error submitting payment");
    }
  };

  //get required payment installment
  const lastInstallment = loan?.installment?.slice(-1)[0];
  const lastInstallmentNumber = lastInstallment?.installmentNumber || 0;
  const pendingInstallments =
    loan.loanAmount / (installments.length - lastInstallmentNumber);

  console.log(pendingInstallments);

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
    if (installments[index].paymentAmount <= pendingInstallments - 1) {
      message.error("Payment amount must be greater than installment amount.");
      return;
    }

    onPaymentSubmit(
      installments[index].paymentAmount,
      installments[index].installmentNumber
    );
  };
  //user landing page
  if (
    loan.loanStatus === "DISABLED" ||
    (loan.loanStatus === "PENDING" && !loan.isAdmin)
  ) {
    return (
      <div>
        {" "}
        <div className="hero">
          <div className="h-left">
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
                  <label htmlFor="requestDate">Term start date:</label>
                  <input
                    type="date"
                    id="requestDate"
                    value={requestDate}
                    onChange={(e) => setRequestDate(e.target.value)}
                    required
                  />
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
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
  //table component is handled using ANTDesign table
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
          : `$${pendingInstallments}`;
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
        return null;
      },
    },
  ];

  //loader
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-circle"></div>
      </div>
    );
  }

  return  loan.isAdmin? (
    <Admin />
  ) : (
    <div className="header-container">
      <div className="db-container">
        <div className="db-heading">
          <h1>Your Loan Details</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
        <h3 className="db-subheading">
          Loan amount to be paid : ${loan?.loanAmount}
        </h3>
        <h3 className="db-subheading">Installment Term: {loan?.term}</h3>
        <h3 className="db-subheading">Term start: {loan?.requestDate}</h3>
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
};
export default Dashboard;
