import React, { useState, useEffect } from "react";
import { Table, Button, message } from "antd";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../dashboard/dashboard.scss";

const token = localStorage.getItem("token");

const Admin = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Make an API GET call
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API}/all-loans`)
      .then((response) => {
        // Filter out users with loan status equal to "ADMIN"
        const filteredData = response.data.filter(
          (user) => user.loan.status !== "ADMIN"
        );

        setData(filteredData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);
  // Make an API POST request to update the status
  const handleActionClick = (loanId) => {
    axios
      .post(
        `${import.meta.env.VITE_API}/approve-loan/${loanId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token
          },
        }
      )
      .then((response) => {
        // Handle the success response here
        message.success("Status updated successfully");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error updating status:", error);
        message.error("status is already active");
      });
  };
  //table component is handled using ANTDesign table
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
      render: (text, record) => `$${record.loan.loanAmount}`,
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
