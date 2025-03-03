import { useContext, useRef, useState } from "react";
import axios from "axios";
import UserContext from "../Context/userProfile";
import ProfileSidebar from "./Profilesidebar";
import "../assets/changePassword.css";

const ChangePassword = () => {
  const userData = useContext(UserContext);

  const oldPasswordRef = useRef(null);
  const newPasswordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const oldPassword = oldPasswordRef.current.value;
    const newPassword = newPasswordRef.current.value;
    const confirmPassword = confirmPasswordRef.current.value;

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.");
      setMessage("");
      return;
    }
    if (newPassword.length <= 6) {
      setError("New password must be greater than 6 characters.");
      setMessage("");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      setMessage("");
      return;
    }

    try {
      let userdata = userData.userdetails;
      let userid = userdata._id;
      let data = { userId: userid, newPassword: newPassword };

      const response = await axios.put("http://localhost:8080/update-pass", data);

      if (response.data.success) {
        setMessage(response.data.message || "Password updated successfully!");
        setError("");
        oldPasswordRef.current.value = "";
        newPasswordRef.current.value = "";
        confirmPasswordRef.current.value = "";
      } else {
        setError(response.data.message || "Failed to update the password.");
        setMessage("");
      }
    } catch (err) {
      setError("An error occurred while updating the password.");
      setMessage("");
      console.error(err);
    }
  };

  const handleReset = () => {
    oldPasswordRef.current.value = "";
    newPasswordRef.current.value = "";
    confirmPasswordRef.current.value = "";
    setError("");
    setMessage("");
  };

  return (
    <div className="password-container">
      <ProfileSidebar />
      <div className="password-form-wrapper">
        <form onSubmit={handleSubmit} className="password-form">
          <h2 className="password-heading">Update Password</h2>

          {message && <p className="password-success">{message}</p>}
          {error && <p className="password-error">{error}</p>}

          <div className="password-field">
            <label htmlFor="oldPassword">Old Password</label>
            <input
              type="password"
              id="oldPassword"
              ref={oldPasswordRef}
              className="password-input"
              onChange={() => setError("")}
            />
          </div>

          <div className="password-field">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              ref={newPasswordRef}
              className="password-input"
              onChange={() => setError("")}
            />
          </div>

          <div className="password-field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              ref={confirmPasswordRef}
              className="password-input"
              onChange={() => setError("")}
            />
          </div>

          <div className="password-buttons">
            <button type="submit" className="password-submit">
              Submit
            </button>
            <button type="button" onClick={handleReset} className="password-reset">
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
