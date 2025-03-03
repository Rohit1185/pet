import { useState } from "react";
import axios from "axios";
import "../assets/forgotpass.css"; // Import the CSS file

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/forgot-password", { email });
      setMessage(response.data.message || "Check your email for the code.");
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data?.message || "An error occurred");
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/verify-code", { email, code });
      setMessage(response.data.message || "Code verified. Set a new password.");
      setStep(3);
      console.log("✅ Code is set:", code); // Debugging
    } catch (error) {
      setMessage(error.response?.data?.message || "Invalid or expired code.");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    console.log("🔹 Sending Reset Password Request...");
    console.log("🔹 Email:", email);
    console.log("🔹 Code:", code); // Ensure this is not empty
    console.log("🔹 New Password:", newPassword);

    if (!code) {
      setMessage("Error: Verification code is missing.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/reset-password", {
        email,
        code,  // ✅ Ensure code is sent correctly
        newPassword,
      });

      console.log("✅ Response:", response.data);
      setMessage(response.data.message || "Password reset successfully.");
      setStep(1);
      setEmail(""); 
      setCode(""); 
      setNewPassword("");
    } catch (error) {
      console.error("❌ Error resetting password:", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "Error resetting password.");
    }
  };

  return (
    <div id="forgot-password-container">
      <div className="form-box">
        <h2 className="form-title">
          {step === 1 ? "Forgot Password" : step === 2 ? "Verify Code" : "Reset Password"}
        </h2>

        {message && <p className="message-box">{message}</p>}

        {step === 1 && (
          <form className="forgot-form" onSubmit={handleEmailSubmit}>
            <input
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className="form-button">Send Code</button>
          </form>
        )}

        {step === 2 && (
          <form className="forgot-form" onSubmit={handleCodeSubmit}>
            <input
              type="text"
              className="form-input"
              placeholder="Enter the code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
            <button type="submit" className="form-button">Verify Code</button>
          </form>
        )}

        {step === 3 && (
          <form className="forgot-form" onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              className="form-input"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
            <button type="submit" className="form-button">Reset Password</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
