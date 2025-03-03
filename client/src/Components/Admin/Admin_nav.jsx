import { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaUsers, FaPaw, FaClipboardList, FaChartBar, FaGift, FaCalendarAlt, FaSignOutAlt, FaBell, FaHome } from "react-icons/fa";
import Dashboard from "./Admin_Dashboard";
import ManageUsers from "./ManageUsers";
import ManagePets from "./ManagePets";
import AdoptionRequests from "./AdoptionRequests";
import Reports from "./Reports";
import ManageEvents from "./ManageEvents";  // New Component
import ManageDonations from "./ManageDonations";  // New Component
import ManageShelter from './ManageShelter'
import usercontext from '../../Context/userContext';
import userimg from '../../assets/user.jpg'
import "../../assets/admin.css";
import Admin_Feedback from "./Admin_Feedback";

export default function AdminDashboard() {

  let user = useContext(usercontext);
  let navigaet = useNavigate();

  function signOut(){
    user.setloggedin(false);
    navigaet('/')
  }
  
  const [activeTab, setActiveTab] = useState("dashboard");

  // Function to render the correct component
  const renderComponent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "users":
        return <ManageUsers />;
      case "shelter":
        return <ManageShelter />
      case "pets":
        return <ManagePets />;
      case "requests":
        return <AdoptionRequests />;
      case "reports":
        return <Reports />;
      case "events":
        return <ManageEvents />;
      case "donations":
        return <ManageDonations />;
      case "feedback":
        return <Admin_Feedback/>;
      
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">🐾 Admin Panel</h2>
        <ul className="nav-links">
          <li className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
            <FaChartBar /> Dashboard
          </li>
          <li className={activeTab === "users" ? "active" : ""} onClick={() => setActiveTab("users")}>
            <FaUsers /> Manage Users
          </li>
          <li className={activeTab === "shelter" ? "active" : ""} onClick={() => setActiveTab("shelter")}>
            <FaHome /> Manage Shelters
          </li>
          <li className={activeTab === "pets" ? "active" : ""} onClick={() => setActiveTab("pets")}>
            <FaPaw /> Manage Pets
          </li>
          <li className={activeTab === "requests" ? "active" : ""} onClick={() => setActiveTab("requests")}>
            <FaClipboardList /> Adoption Requests
          </li>
          <li className={activeTab === "events" ? "active" : ""} onClick={() => setActiveTab("events")}>
            <FaCalendarAlt /> Manage Events
          </li>
          <li className={activeTab === "donations" ? "active" : ""} onClick={() => setActiveTab("donations")}>
            <FaGift /> Manage Donations
          </li>
          <li className={activeTab === "reports" ? "active" : ""} onClick={() => setActiveTab("reports")}>
            <FaChartBar /> Reports
          </li>
          <li className={activeTab === "feedback" ? "active" : ""} onClick={() => setActiveTab("feedback")}>
            <FaChartBar /> Feedbacks
          </li>

        </ul>
        <button className="logout" onClick={() => signOut()}>
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="admin-header">
          <h2>{activeTab.replace(/([A-Z])/g, " $1")}</h2>
          <div className="admin-actions">
            <FaBell className="icon" />
            <img src={userimg} alt="Admin" className="admin-avatar" />
          </div>
        </header>

        {/* Dynamic Content Rendering */}
        <section className="content">{renderComponent()}</section>
      </main>
    </div>
  );
}
