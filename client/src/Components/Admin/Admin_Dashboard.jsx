import { useState, useEffect } from "react";
import '../../assets/dashboard.css'
import axios from "axios";

export default function Admin_Dashboard() {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalShelters, setTotalShelters] = useState(0);
  const [totalNormaluser,setTotalNormalUser] = useState(0);
  const [totalEvents, setTotalEvents] = useState(0);
  const [totalDonations, setTotalDonations] = useState(0);
  const [petsAvailable, setPetsAvailable] = useState(0);
  const [pendingRequests, setPendingRequests] = useState(0);

  useEffect(() => {
    // Fetch Users
    axios.get("http://localhost:8080/registerusers")
      .then(response => {
        setTotalUsers(response.data.length);
        setTotalShelters(response.data.filter(user => user.isShelter === "YES").length);
        setTotalNormalUser(response.data.filter(user =>user.isShelter === "NO").length);
      })
      .catch(error => console.error("Error fetching users:", error));

    // Fetch Events
    axios.get("http://localhost:8080/shelter-add-events")
      .then(response => setTotalEvents(response.data.length))
      .catch(error => console.error("Error fetching events:", error));

    // Fetch Donations
    axios.get("http://localhost:8080/add-donation")
      .then(response => setTotalDonations(response.data.length))
      .catch(error => console.error("Error fetching donations:", error));

    // Fetch Pets
    axios.get("http://localhost:8080/shelter-list-page")
      .then(response => setPetsAvailable(response.data.length))
      .catch(error => console.error("Error fetching pets:", error));

    // Fetch Pending Requests
    axios.get("http://localhost:8080/submit-adoption-form")
      .then(response => setPendingRequests(response.data.filter(req => req.status === "Pending").length))
      .catch(error => console.error("Error fetching requests:", error));

  }, []);

  return (
    <section className="content">
      <div className="dashboard-content">
      <div className="dashboard-overview">
        <div className="stat-card">👥 Total Users: <strong>{totalUsers}</strong></div>
        <div className="stat-card">🏠 Total Shelters: <strong>{totalShelters}</strong></div>
        <div className="stat-card">👥 Total Normal Users: <strong>{totalNormaluser}</strong></div>
      </div>
      <div className="dashboard-overview">
        <div className="stat-card">📅 Total Events: <strong>{totalEvents}</strong></div>
        <div className="stat-card">💰 Total Donations: <strong>{totalDonations}</strong></div>
        <div className="stat-card">🐾 Pets Available: <strong>{petsAvailable}</strong></div>
        </div>
        <div className="dashboard-overview">
        <div className="stat-card">📋 Pending Requests: <strong>{pendingRequests}</strong></div>
        </div>
        </div>
    </section>
  );
}
