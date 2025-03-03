import "../assets/profile.css";
import { useContext } from "react";
import userProfile from "../Context/userProfile";
import ProfileUpdate from "./Profilesidebar";
import { NavLink } from "react-router-dom";

function Profile() {

  let userdata = useContext(userProfile);
  let fname = userdata.userdetails.userFname;
  let lname = userdata.userdetails.userLname;
  let email = userdata.userdetails.userEmail;
  let contact = userdata.userdetails.userContact;
  let shelter = userdata.userdetails.isShelter;
  return (
    <>
      <h1>{fname ? `Welcome, ${userdata.userdetails.userFname}!` : "Welcome!"}</h1>
      <div className="profile-main">
        <div className="profile-sidebar">
          <ProfileUpdate />
        </div>
        <form action="" className="form-info">
          <p>
            <label htmlFor="">First Name</label>
            <br />
            <input
              type="text"
              value={fname}
            />
          </p>
          <p>
            <label htmlFor="">Last Name</label>
            <br />
            <input type="text"  value={lname}/>
          </p>
          <p>
            <label htmlFor="">Email</label>
            <br />
            <input type="email" value={email} readOnly />
          </p>
          <p>
            <label htmlFor="">Contact No</label>
            <br />
            <input type="number" value={contact}/>
          </p>
          <p>
            <label htmlFor="">Shelter</label>
            <br />
            {userdata.userdetails.isShelter === "Yes"?(<input type="text" value={shelter}/>):(<input type="text" value={shelter} disabled/>)}
          </p>
          <p id="navlink">
            <NavLink to='/update-profile' id="navlink-edit">Edit Profile</NavLink>
          </p>
        </form>
      </div>
    </>
  );
}

export default Profile;
