// Admin Dashboard

import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminDashboard.css";
import SideBar from "../../../components/SideBar/SideBar";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_orders: 0,
    total_books: 0,
    total_customers: 0,
    pending_orders: 0,
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/dashboard/"
        );
        setStats(response.data);
      } catch (err) {
        setError("Failed to fetch data.");
        console.error(err);
      }
    };

    fetchDashboardData();
  }, []);

  const chartData = {
    labels: [
      "Total Orders",
      "Total Books",
      "Total Customers",
      "Pending Orders",
    ],
    datasets: [
      {
        label: "Counts",
        data: [
          stats.total_orders,
          stats.total_books,
          stats.total_customers,
          stats.pending_orders,
        ],
        fill: false,
        backgroundColor: "#66FF66",
        borderColor: "#66FF66",
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Dashboard Overview",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="dashboard-page">
      <div className="admin-dashboard">
        {/* Sidebar */}
        <SideBar />

        {/* Main Content */}
        <main className="dashboard-content">
          <h1 className="dashboard-heading">Overview</h1>

          {/* Stats Grid */}
          <div className="stats-grid">
            <div className="stat-card">
              Total Orders <span>{stats.total_orders}</span>
            </div>
            <div className="stat-card">
              Total Books <span>{stats.total_books}</span>
            </div>
            <div className="stat-card">
              Total Customers <span>{stats.total_customers}</span>
            </div>
            <div className="stat-card">
              Pending Orders <span>{stats.pending_orders}</span>
            </div>
          </div>

          {/* Line Chart */}
          <div className="chart-container">
            <Line data={chartData} options={chartOptions} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
