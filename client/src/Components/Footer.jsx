import { useState } from "react";
import { NavLink } from "react-router-dom";
import "../assets/footer.css";

function Footer() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile:'',
    message: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const onSubmit = async (event) => {
    event.preventDefault();

    const { name, email, message ,mobile} = formData;

    // Validation checks
    if (!name || !email || !message || !mobile) {
      setError("All fields are required.");
      setSuccess("");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      setSuccess("");
      return;
    }

    setError(""); // Clear previous errors

    const payload = {
      ...formData,
      access_key: "4f3e705a-29c5-4dbd-ac9a-57db97728c7a",
    };

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    }).then((res) => res.json());

    if (res.success) {
      setSuccess("Form submitted successfully!");
      setError(""); // Clear error message
      setFormData({ name: "", email: "", message: "" ,mobile:''}); // Reset form fields
    } else {
      setError("Failed to submit the form. Please try again.");
      setSuccess(""); // Clear success message
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <div className="main-footer">
        <div className="footer">
          <NavLink to="/" id="f-link">Home</NavLink>
          <NavLink to="/" id="f-link">Events & Drives</NavLink>
          <NavLink to="/" id="f-link">Found Pet</NavLink>
          <NavLink to="/" id="f-link">Resources</NavLink>
          <NavLink to="/" id="f-link">Donation</NavLink>
        </div>
        <div className="footer-contact">
          <h1>Contact us</h1>
          <form onSubmit={onSubmit}>
            {success && <p className="success-message">{success}</p>}
            {error && <p className="error-message">{error}</p>}
            
            <label htmlFor="name">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            
            <label htmlFor="name">Mobile No</label>
            <input
              type="text"
              name="name"
              value={formData.mobile}
              onChange={handleChange}
            />
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
            
            <label htmlFor="message">Enter Your Message</label>
            <br />
            <textarea
              name="message"
              cols={10}
              rows={5}
              value={formData.message}
              onChange={handleChange}
            ></textarea>
            
            <button type="submit">Submit Form</button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Footer;