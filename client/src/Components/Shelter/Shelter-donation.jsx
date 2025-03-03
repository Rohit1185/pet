import { useState } from "react";
import axios from "axios";
import "../../assets/Donations.css";

const DonationRecords = () => {
  const [mobile, setMobile] = useState("");
  const [donations, setDonations] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  // Fetch donations
  const handleFetchDonations = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const response = await axios.get(`http://localhost:8080/add-donation/${mobile}`);
      setDonations(response.data);
    } catch (error) {
      setErrorMessage("No donation record found.");
      console.error(error);
      setDonations([]);
    }
  };

  // Format date to DD-MM-YYYY
  const formatDate = (date) => {
    const newDate = new Date(date);
    const day = newDate.getDate().toString().padStart(2, "0");
    const month = (newDate.getMonth() + 1).toString().padStart(2, "0");
    const year = newDate.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Download receipt based on mobile number
  const handleDownloadReceipt = () => {
    if (!mobile) {
      alert("Please enter a mobile number to download the receipt.");
      return;
    }
    window.open(`http://localhost:8080/add-donation/${mobile}?download=true`, "_blank");
  };

  return (
    <div className="donation-records-container">
      <h2>Check Donation Details</h2>

      <form onSubmit={handleFetchDonations}>
        <div className="donation-records-form-row">
          <div className="donation-records-column">
            <label>Mobile Number:</label>
            <input
              type="text"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              placeholder="Enter Mobile Number"
              className="donation-records-input"
            />
          </div>
          <div className="donation-records-column">
            <button type="submit" className="donation-records-button">
              Get Details
            </button>
          </div>
        </div>
      </form>

      {errorMessage && <p className="donation-records-error">{errorMessage}</p>}

      {donations.length > 0 && (
        <div className="donation-records-info">
          <h3>Donation Records</h3>
          <table className="donation-records-table">
            <thead>
              <tr>
                <th>Donation ID</th>
                <th>Name</th>
                <th>Amount</th>
                <th>Shelter Name</th>
                <th>Shelter Contact</th>
                <th>Date</th>
                <th>Receipt</th>
              </tr>
            </thead>
            <tbody>
              {donations.map((donation, index) => (
                <tr key={index}>
                  <td>{donation._id}</td> {/* ObjectId as Donation ID */}
                  <td>{donation.name}</td>
                  <td>₹{donation.amount}</td>
                  <td>{donation.shelterName}</td>
                  <td>{donation.shelterContact}</td>
                  <td>{formatDate(donation.date)}</td> {/* Date in DD-MM-YYYY */}
                  <td>
                    <button onClick={handleDownloadReceipt} className="donation-records-download">
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DonationRecords;