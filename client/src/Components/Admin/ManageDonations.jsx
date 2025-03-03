
import { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import jsPDF from "jspdf";

export default function ManageDonations() {
  const [donations, setDonations] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Search Query
  const [currentPage, setCurrentPage] = useState(1); // ✅ Pagination
  const donationsPerPage = 5; // ✅ Show 5 donations per page

  const [editingDonationId, setEditingDonationId] = useState(null);
  const [editableDonation, setEditableDonation] = useState(null);

  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await axios.get("http://localhost:8080/add-donation");
        setDonations(response.data);
      } catch (error) {
        console.error("Error fetching donations:", error);
        alert("Failed to fetch donations.");
      }
    };

    fetchDonations();
  }, []);

  // ✅ Delete Donation
  const deleteDonation = async (_id) => {
    if (window.confirm("Are you sure you want to delete this donation?")) {
      try {
        await axios.delete(`http://localhost:8080/add-donation/${_id}`);
        setDonations(donations.filter(donation => donation._id !== _id));
        alert("Donation deleted successfully!");
      } catch (error) {
        console.error("Error deleting donation:", error);
        alert("Failed to delete donation.");
      }
    }
  };

  // ✅ Enable Editing Mode
  const startEditing = (donation) => {
    setEditingDonationId(donation._id);
    setEditableDonation({ ...donation });
  };

  // ✅ Handle Input Changes
  const handleChange = (e, field) => {
    setEditableDonation({ ...editableDonation, [field]: e.target.value });
  };

  // ✅ Save Updated Donation
  const saveDonation = async () => {
    try {
      await axios.put(`http://localhost:8080/add-donation/${editableDonation._id}`, editableDonation);
      setDonations(donations.map(donation => (donation._id === editableDonation._id ? editableDonation : donation)));
      alert("Donation updated successfully!");
      setEditingDonationId(null);
      setEditableDonation(null);
    } catch (error) {
      console.error("Error updating donation:", error);
      alert("Failed to update donation.");
    }
  };

  // ✅ Generate and Download Receipt as PDF
  const downloadReceipt = (donation) => {
    const pdf = new jsPDF();

    pdf.setFontSize(20);
    pdf.text("Donation Receipt", 80, 20);

    pdf.setFontSize(14);
    pdf.text(`Donor Name: ${donation.name}`, 20, 40);
    pdf.text(`Amount: $${donation.amount}`, 20, 50);
    pdf.text(`Shelter Name: ${donation.shelterName}`, 20, 60);
    pdf.text(`Donation Date: ${moment(donation.createdAt).format("DD-MM-YYYY")}`, 20, 70);

    pdf.setFontSize(12);
    pdf.text("Thank you for your generous donation!", 20, 90);

    pdf.save(`Donation_Receipt_${donation._id}.pdf`);
  };

  // ✅ Filter & Search Donations
  const filteredDonations = donations.filter(donation =>
    donation.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    donation.amount.toString().includes(searchQuery)
  );

  // ✅ Pagination Logic
  const indexOfLastDonation = currentPage * donationsPerPage;
  const indexOfFirstDonation = indexOfLastDonation - donationsPerPage;
  const currentDonations = filteredDonations.slice(indexOfFirstDonation, indexOfLastDonation);
  const totalPages = Math.ceil(filteredDonations.length / donationsPerPage);

  return (
    <div id="manage-section">
      <div className="manage-header">
        <h2 id="manage-title">💰 Manage Donations</h2>
        <input
          type="text"
          placeholder="Search Donations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
      </div>

      <table id="admin-table">
        <thead>
          <tr>
            <th>Donor Name</th>
            <th>Amount</th>
            <th>Shelter Name</th>
            <th>Donation Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentDonations.map(donation => (
            <tr key={donation._id}>
              <td>
                {editingDonationId === donation._id ? (
                  <input type="text" value={editableDonation.name} onChange={(e) => handleChange(e, "name")} />
                ) : (
                  donation.name
                )}
              </td>
              <td>
                {editingDonationId === donation._id ? (
                  <input type="number" value={editableDonation.amount} onChange={(e) => handleChange(e, "amount")} />
                ) : (
                  `$${donation.amount}`
                )}
              </td>
              <td>{donation.shelterName}</td>
              <td>{moment(donation.createdAt).format("DD-MM-YYYY")}</td>
              <td>
                {editingDonationId === donation._id ? (
                  <>
                    <button id="save-btn" onClick={saveDonation}>Save</button>
                    <button id="cancel-btn" onClick={() => setEditingDonationId(null)}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button id="download-btn" onClick={() => downloadReceipt(donation)}>Download Receipt</button>
                    <button id="update-btn" onClick={() => startEditing(donation)}>Update</button>
                    <button id="delete-btn" onClick={() => deleteDonation(donation._id)}>Delete</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Pagination Buttons */}
      <div className="pagination">
        <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i} className={currentPage === i + 1 ? "active-page" : ""} onClick={() => setCurrentPage(i + 1)}>
            {i + 1}
          </button>
        ))}
        <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
      </div>
    </div>
  );
}
