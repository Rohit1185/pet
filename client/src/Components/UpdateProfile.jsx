import "../assets/profile.css";
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import userProfile from "../Context/userProfile";
import ProfileUpdate from "./Profilesidebar";

function UpdateProfile() {
  const [fname, setFname] = useState(""); // State to hold the first name
  const userdata = useContext(userProfile);

  // Input refs
  const fnameref = useRef();
  const lnameref = useRef();
  const emailref = useRef();
  const contactref = useRef();
  const imgref = useRef();
  const shelterNameref = useRef();
  const shelterContactref = useRef();
  const shelterAddressref = useRef();
  const shelterId = useRef();

  // Set initial values in form fields from userdata
  useEffect(() => {
    const olddata = userdata.userdetails;
    if (olddata) {
      fnameref.current.value = olddata.userFname || "";
      lnameref.current.value = olddata.userLname || "";
      emailref.current.value = olddata.userEmail || "";
      contactref.current.value = olddata.userContact || "";
      shelterNameref.current.value = olddata.shelterName || "";
      shelterContactref.current.value = olddata.shelterContact || "";
      shelterAddressref.current.value = olddata.shelterAddress || "";
      shelterId.current.value = olddata.shelterId || "";
      setFname(olddata.userFname || "");
    }
  }, [userdata.userdetails]);

  // Function to handle profile update
  const addProfile = async () => {
    const olddata = userdata.userdetails;

    // Validations
    const namePattern = /^[A-Za-z]+$/;
    const contactPattern = /^[0-9]{10}$/;

    if (!fnameref.current.value.match(namePattern)) {
      alert("First Name is required and should contain only letters.");
      return;
    }
    if (lnameref.current.value && !lnameref.current.value.match(namePattern)) {
      alert("Last Name should contain only letters.");
      return;
    }
    if (!contactref.current.value.match(contactPattern)) {
      alert("Contact number should be exactly 10 digits.");
      return;
    }

    const userData = new FormData();
    userData.append("userId", olddata._id);
    userData.append("userFname", fnameref.current.value);
    userData.append("userLname", lnameref.current.value);
    userData.append("userEmail", emailref.current.value);
    userData.append("userContact", contactref.current.value);
    userData.append("shelterName", shelterNameref.current.value);
    userData.append("shelterContact", shelterContactref.current.value);
    userData.append("shelterAddress", shelterAddressref.current.value);
    userData.append("shelterId", shelterId.current.value);
    if (imgref.current.files[0]) {
      userData.append("userImg", imgref.current.files[0]);
    }
    console.log("Sending Data to API:", Object.fromEntries(userData.entries()));
    const config = { headers: { "Content-Type": "multipart/form-data" } };

    axios
      .put("http://localhost:8080/update-profile", userData, config)
      .then((d) => {
        console.log("Data of API", d.data);
        userdata.setuserdetails(d.data[0]);
        alert("User Updated Successfully");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <h1>{fname ? `Welcome, ${fname}!` : "Welcome!"}</h1>
      <div className="profile-main">
        <div>
          <ProfileUpdate />
        </div>
        <form action="" className="form-info">
          <p>
            <input type="file" ref={imgref} name="img" />
          </p>
          <p>
            <label>First Name</label>
            <br />
            <input type="text" ref={fnameref} onChange={(e) => setFname(e.target.value)} />
          </p>
          <p>
            <label>Last Name</label>
            <br />
            <input type="text" ref={lnameref} />
          </p>
          <p>
            <label>Email</label>
            <br />
            <input type="email" ref={emailref} readOnly />
          </p>
          <p>
            <label>Contact No</label>
            <br />
            <input type="number" ref={contactref} />
          </p>
          <p>
            <label>Shelter Name</label>
            <br />
            {userdata.userdetails.isShelter === "YES" ? (
              <input type="text" ref={shelterNameref} />
            ) : (
              <input type="text" ref={shelterNameref} disabled />
            )}
          </p>
          <p>
            <label>Shelter id</label>
            <br />
            <input type="text" name="" id="" ref={shelterId} disabled />
          </p>
          <p>
            <label>Shelter Contact No</label>
            <br />
            {userdata.userdetails.isShelter === "YES" ? (
              <input type="text" ref={shelterContactref} />
            ) : (
              <input type="text" ref={shelterContactref} disabled />
            )}
          </p>
          <p>
            <label>Shelter Address</label>
            <br />
            {userdata.userdetails.isShelter === "YES" ? (
              <input type="text" ref={shelterAddressref} />
            ) : (
              <input type="text" ref={shelterAddressref} disabled />
            )}
          </p>
          <input type="button" value="Update" onClick={addProfile} />
        </form>
      </div>
    </>
  );
}

export default UpdateProfile;
