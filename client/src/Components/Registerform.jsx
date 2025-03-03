import { NavLink, useNavigate } from 'react-router-dom';
import '../assets/app.css';
import dog from '../assets/dog3.png';
import axios from 'axios';
import { useRef, useState } from 'react';

function Registerform() {
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [radioError, setRadioError] = useState(false);
  const [shelterError, setShelterError] = useState(false);
  const [isShelter, setIsShelter] = useState(false); // Track "YES" or "NO" selection

  const nameRef = useRef();
  const emailRef = useRef();
  const mobileRef = useRef();
  const passwordRef = useRef();
  const shelterNameRef = useRef();
  const formRef = useRef(null);
  const navigate = useNavigate(); // Redirect user

  // Validation function
  const validation = () => {
    let isValid = true;

    // Reset errors
    setNameError(false);
    setEmailError(false);
    setMobileError(false);
    setPasswordError(false);
    setRadioError(false);
    setShelterError(false);

    // Name validation (only letters allowed)
    const nameValue = nameRef.current.value.trim();
    if (!nameValue) {
      setNameError("Please enter your full name.");
      isValid = false;
    } else if (!/^[A-Za-z\s]+$/.test(nameValue)) {
      setNameError("Only alphabets are allowed in name.");
      isValid = false;
    }

    // Email validation
    const emailValue = emailRef.current.value.trim();
    if (!emailValue || !/\S+@\S+\.\S+/.test(emailValue)) {
      setEmailError("Please enter a valid email address.");
      isValid = false;
    }

    // Mobile validation (exactly 10 digits)
    const mobileValue = mobileRef.current.value.trim();
    if (!mobileValue || !/^[0-9]{10}$/.test(mobileValue)) {
      setMobileError("Please enter a valid 10-digit mobile number.");
      isValid = false;
    }

    // Password validation (min length 6)
    const passwordValue = passwordRef.current.value.trim();
    if (!passwordValue || passwordValue.length < 6) {
      setPasswordError("Password must be at least 6 characters long.");
      isValid = false;
    }

    // Radio button validation
    const radioValue = formRef.current.querySelector('input[name="yn"]:checked');
    if (!radioValue) {
      setRadioError("Please select whether you are a shelter or not.");
      isValid = false;
    }

    // Shelter name validation (if shelter is "YES")
    if (isShelter && !shelterNameRef.current.value.trim()) {
      setShelterError("Shelter name is required if you are a shelter.");
      isValid = false;
    }

    return isValid;
  };

  const addData = async () => {
    if (!validation()) return; // Stop if validation fails

    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const mobile = mobileRef.current.value;
    const password = passwordRef.current.value;
    const shelterName = shelterNameRef.current.value;
    const radioValue = formRef.current.querySelector('input[name="yn"]:checked')?.value;

    const data = {
      userFname: name,
      userEmail: email,
      userContact: mobile,
      password: password,
      isShelter: radioValue,
      shelterName: isShelter ? shelterName : "", // Empty if "NO" is selected
    };

    console.log(data);

    try {
      const response = await axios.post("http://localhost:8080/register", data);
      alert("Registration Successful!");

      // Clear all input fields after success
      formRef.current.reset();
      setIsShelter(false); // Reset shelter state

      // Redirect to login page
      navigate("/login");

      console.log(response.data);
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Registration failed. Please try again.");
    }
  };

  const handleRadioChange = (e) => {
    setIsShelter(e.target.value === "YES");
  };

  return (
    <div className="main">
      <div className="main2">
        <div className="box_white">
          <form ref={formRef} className="reg-form">
            <h1 className="register">Register</h1>

            <label>Full Name:</label>
            <br />
            <input type="text" name="name" ref={nameRef} /><br />
            {nameError && <span className="register-error">{nameError}</span>}
            <br />

            <label>Email:</label>
            <br />
            <input type="email" name="email" ref={emailRef} /><br />
            {emailError && <span className="register-error">{emailError}</span>}
            <br />

            <label>Mobile No:</label>
            <br />
            <input type="number" name="mobile" ref={mobileRef} /><br />
            {mobileError && <span className="register-error">{mobileError}</span>}
            <br />

            <label>Password:</label>
            <br />
            <input type="password" name="password" ref={passwordRef} /><br />
            {passwordError && <span className="register-error">{passwordError}</span>}
            <br />

            <label>You are Shelter:</label>
            <input type="radio" name="yn" id="yes" value="YES" onChange={handleRadioChange} />
            <label htmlFor="yes" className="radio">YES</label>
            <input type="radio" name="yn" id="no" value="NO" onChange={handleRadioChange} />
            <label htmlFor="no" className="radio">NO</label><br />
            {radioError && <span className="register-error radio-error">{radioError}</span>}
            <br />

            <label>Shelter Name:</label> <br />
            <input type="text" name="shelter" ref={shelterNameRef} disabled={!isShelter} /><br />
            {shelterError && <span className="register-error">{shelterError}</span>}
            <br />

            <br />
            <input type="button" value="Register" className="button" onClick={addData} />
            <p className="sign-in-link">
              Already have an account? <NavLink to="/login">Sign in here</NavLink>
            </p>
          </form>
        </div>
        <div className="reg-dog-photo">
          <img src={dog} alt="PHOTO" className="right_img" />
        </div>
      </div>
    </div>
  );
}

export default Registerform;
