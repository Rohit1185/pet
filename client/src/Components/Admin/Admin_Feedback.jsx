import { useEffect, useState } from "react";
import axios from "axios";
import "../assets/adminFeedback.css";

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("shelter");
  const [filterOption, setFilterOption] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const feedbackResponse = await axios.get("http://localhost:8080/feedback");
        console.log(feedbackResponse.data.feedbacks)
        setFeedbacks(feedbackResponse.data.feedbacks);

        const reportsResponse = await axios.get("http://localhost:8080/reports");
        console.log("User data Of Reports",reportsResponse.data.users)
        setReports(reportsResponse.data.reports);
        setUsers(reportsResponse.data.users);
        setShelters(reportsResponse.data.shelters);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  let selectedData = [];

  if (activeTab === "shelter") {
    selectedData = feedbacks.filter((fb) => fb.giverRole === "USER");
  } else if (activeTab === "user") {
    selectedData = feedbacks.filter((fb) => fb.giverRole === "SHELTER");
  } else if (activeTab === "reports") {
    selectedData = reports.map((report) => {
      const user = users.find((u) => u._id === report.userId);
      const shelter = shelters.find((s) => s._id === report.shelterId);
      return {
        ...report,
        reportedBy: user ? user.userFname : shelter ? shelter.shelterName : "Unknown",
        email: user ? user.userEmail : "N/A",
        contact: user ? user.userContact : "N/A",
      };
    });
  }

  const filteredData = selectedData.filter((item) =>
    filterOption ? item.status === filterOption || item.rating?.toString() === filterOption : true
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="admin-feedback-container">
      <h2>Admin Dashboard</h2>
      <div className="toggle-buttons">
        <button className={activeTab === "shelter" ? "active" : ""} onClick={() => setActiveTab("shelter")}>Shelter Feedback</button>
        <button className={activeTab === "user" ? "active" : ""} onClick={() => setActiveTab("user")}>User Feedback</button>
        <button className={activeTab === "reports" ? "active" : ""} onClick={() => setActiveTab("reports")}>Issue Reports</button>
      </div>

      <div className="search-filter">
        <select value={filterOption} onChange={(e) => setFilterOption(e.target.value)}>
          <option value="">All</option>
          {activeTab === "reports" ? (
            <>
              <option value="Pending">Pending</option>
              <option value="Solved">Solved</option>
            </>
          ) : (
            <>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </>
          )}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="feedback-section">
          <h3>{activeTab === "shelter" ? "Shelter Feedback" : activeTab === "user" ? "User Feedback" : "Issue Reports"}</h3>
          <table>
            <thead>
              <tr>
                {activeTab === "reports" ? (
                  <>
                    <th>Title</th>
                    <th>Description</th>
                    <th>Solution</th>
                    <th>Reported By</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Status</th>
                  </>
                ) : (
                  <>
                    <th>Receiver Name</th>
                    <th>Email</th>
                    <th>Contact</th>
                    <th>Rating</th>
                    <th>Feedback</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  {activeTab === "reports" ? (
                    <>
                      <td>{item.reason}</td>
                      <td>{item.details}</td>
                      <td>{item.solution || "N/A"}</td>
                      <td>{users.map((e)=>(e.userFname))}</td>
                      <td>{users.map((e)=>(e.userEmail))}</td>
                      <td>{users.map((e)=>(e.userContact))}</td>
                      <td>{item.status}</td>
                    </>
                  ) : (
                    <>
                      <td>{item.receiver?.name || "N/A"}</td>
                      <td>{item.receiver?.email || "N/A"}</td>
                      <td>{item.receiver?.contact || "N/A"}</td>
                      <td>{item.rating ? item.rating.toFixed(1) + " ⭐" : "N/A"}</td>
                      <td>{item.message}</td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Pagination Controls */}
          <div className="pagination">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage} of {totalPages}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFeedback;