import React, { useState, useEffect } from "react";
import { Table, Button, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../dashboard/dashboard.scss";

const Admin = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Make an API GET call to fetch data when the component mounts
    axios
      .get("http://localhost:3000/all-loans") // Replace with your actual GET API endpoint
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleActionClick = (loanId) => {
    // Make an API POST request to update the status
    axios
      .post(`http://localhost:3000/approve-loan/${loanId}`) // Replace with your actual POST API endpoint
      .then((response) => {
        // Handle the success response here
        message.success("Status updated successfully");
        window.location.reload();
        // You can also update the status locally in your data state if needed
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        message.error("status is already active");
      });
  };

  const columns = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Loan Amount",
      dataIndex: "loan",
      key: "loanAmount",
      render: (text, record) => record.loan.loanAmount,
    },
    {
      title: "Term",
      dataIndex: "loan",
      key: "term",
      render: (text, record) => record.loan.term,
    },
    {
      title: "Request Date",
      dataIndex: "loan",
      key: "requestDate",
      render: (text, record) => record.loan.requestDate,
    },
    {
      title: "Status",
      dataIndex: "loan",
      key: "status",
      render: (text, record) => record.loan.status,
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Button onClick={() => handleActionClick(record._id)}>
          Update Status
        </Button>
      ),
    },
  ];

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/");
    window.location.reload();
  };

  return (
    <div className="header-container">
      <div className="db-container">
        <div className="db-heading">
          <h1>Admin Panel</h1>
          <Button onClick={handleLogout}>Logout</Button>
        </div>
      </div>
      <div className="table-width">
        <Table
          dataSource={data}
          columns={columns}
          loading={loading}
          size="medium"
          rowKey={(record) => record._id}
        />
      </div>
    </div>
  );
};

export default Admin;