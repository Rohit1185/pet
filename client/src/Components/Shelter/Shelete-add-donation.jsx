import { useState, useContext } from "react";
import axios from "axios";
import "../../assets/AddDonationForm.css";
import userProfile from "../../Context/userProfile";

const AddDonationForm = () => {
  let userdata = useContext(userProfile);

  const [mobile, setMobile] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [shelterName, setShelterName] = useState(userdata.userdetails.shelterName || "");
  const [shelterContact, setShelterContact] = useState(userdata.userdetails.shelterContact || "");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Validation errors
  const [errors, setErrors] = useState({
    mobile: "",
    name: "",
    email: "",
    amount: "",
  });

  // Validation functions
  const validateMobile = (value) => /^[0-9]{10}$/.test(value);
  const validateName = (value) => /^[A-Za-z\s]{1,30}$/.test(value);
  const validateEmail = (value) => /^[^\d][\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(value);
  const validateAmount = (value) => /^[1-9]\d*$/.test(value);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateMobile(mobile)) {
      setErrors((prev) => ({ ...prev, mobile: "Mobile number must be 10 digits." }));
      return;
    }
    if (!validateName(name)) {
      setErrors((prev) => ({ ...prev, name: "Name should only contain letters (1-30 chars)." }));
      return;
    }
    if (!validateEmail(email)) {
      setErrors((prev) => ({ ...prev, email: "Enter a valid email (cannot start with a number)." }));
      return;
    }
    if (!validateAmount(amount)) {
      setErrors((prev) => ({ ...prev, amount: "Amount should be a positive number." }));
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/add-donation", {
        mobile,
        name,
        email,
        shelterName,
        shelterContact,
        amount: Number(amount),
      });

      setMessage(response.data.message);
      setError("");
      setMobile("");
      setName("");
      setEmail("");
      setShelterName("");
      setAmount("");
      setErrors({ mobile: "", name: "", email: "", amount: "" }); // Clear errors
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong!");
      setMessage("");
    }
  };

  return (
    <div className="donation-form">
      <h2>Add a Donation</h2>
      <form onSubmit={handleSubmit}>

        {/* Mobile Number */}
        <div className="form-row">
          <div className="form-column">
            <label>Mobile Number:</label>
            <input
              type="text"
              className="input-field"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              onBlur={() =>
                setErrors((prev) => ({
                  ...prev,
                  mobile: validateMobile(mobile) ? "" : "Mobile number must be 10 digits.",
                }))
              }
              required
              placeholder="Enter Mobile Number"
            />
            {errors.mobile && <p className="error-message">{errors.mobile}</p>}
          </div>
        </div>

        {/* Name & Email ID */}
        <div className="form-row">
          <div className="form-column">
            <label>Name:</label>
            <input
              type="text"
              className="input-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() =>
                setErrors((prev) => ({
                  ...prev,
                  name: validateName(name) ? "" : "Name should only contain letters (1-30 chars).",
                }))
              }
              required
              placeholder="Enter Name"
            />
            {errors.name && <p className="error-message">{errors.name}</p>}
          </div>
          <div className="form-column">
            <label>Email ID:</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() =>
                setErrors((prev) => ({
                  ...prev,
                  email: validateEmail(email) ? "" : "Enter a valid email (cannot start with a number).",
                }))
              }
              required
              placeholder="Enter Email"
            />
            {errors.email && <p className="error-message">{errors.email}</p>}
          </div>
        </div>

        {/* Shelter Name & Shelter Contact */}
        <div className="form-row">
          <div className="form-column">
            <label>Shelter Name:</label>
            <input
              type="text"
              className="input-field"
              value={shelterName}
              onChange={(e) => setShelterName(e.target.value)}
              required
              placeholder="Enter Shelter Name"
              disabled
            />
          </div>
          <div className="form-column">
            <label>Shelter Contact:</label>
            <input
              type="text"
              className="input-field"
              value={shelterContact}
              onChange={(e) => setShelterContact(e.target.value)}
              required
              placeholder="Enter Shelter Contact"
              disabled
            />
          </div>
        </div>

        {/* Donation Amount */}
        <div className="form-row">
          <div className="form-column">
            <label>Donation Amount (₹):</label>
            <input
              type="text"
              className="input-field"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              onBlur={() =>
                setErrors((prev) => ({
                  ...prev,
                  amount: validateAmount(amount) ? "" : "Amount should be a positive number.",
                }))
              }
              required
              placeholder="Enter Donation Amount"
            />
            {errors.amount && <p className="error-message">{errors.amount}</p>}
          </div>
        </div>

        <button type="submit">Submit Donation</button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default AddDonationForm;
