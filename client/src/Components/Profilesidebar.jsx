import { useContext } from "react";
import { NavLink } from "react-router-dom";
import userProfile from "../Context/userProfile";
// import { useNavigate } from "react-router-dom";
import userimage from '../assets/user.jpg';
import '../assets/profile.css';

function ProfileUpdate() {
  const user = useContext(userProfile); // Use context to get the user data
  const userId = user.userdetails.userId; // Extract userId from user details
  const shelterId = user.userdetails.shelterId;
  const isShelter = user.userdetails.isShelter;

  return (
    <>
      <div className="none">
        {user.userdetails.userImg ? (
          <img src={`http://localhost:8080/uploads/${user.userdetails.userImg}`} alt="User Profile" />
        ) : (
          <img src={userimage} alt="Default Profile" />
        )}

        {/* Profile Navigation Links */}
        <NavLink to={`/profile`} className="link">
          View Profile
        </NavLink>
        <NavLink to="/update-profile" className="link">
          Update Profile
        </NavLink>
        {isShelter=="YES"?(<NavLink to={`/submit-adoption-form/${userId}`} className="link">
        My Adoption
        </NavLink> ):(
         "" 
        )}
        {isShelter === 'YES'?(<NavLink to={`/my-feedback/${shelterId}`} className='link'>Ratings</NavLink>):(
          ""
        )}
        {isShelter==="YES"?(<NavLink className='link' to={`/my-shelter-report/${shelterId}`}>Reports</NavLink>):(
          <NavLink className='link' to={`/track-my-report/${userId}`}>My Reports</NavLink>
        )}
        

        {isShelter=="YES"?(""):
        (
         <NavLink to={`/my-event-participation/${userId}`} className="link">
         My Event Participation
         </NavLink>
        )}
       {isShelter=="YES" ? (
          <NavLink to={`/adoption-request/${shelterId}`} className="link">Adoption Request</NavLink>) : (<NavLink to={`/submit-adoption-form/${userId}`} className="link">My Adoption</NavLink>)}
        
       {isShelter=="YES"?(<NavLink to={`/my-pets/${userId}`} className="link">
          My Pets
        </NavLink>):("")}
        
        {isShelter=="YES"?(<NavLink to={`/my-events/${userId}`} className="link">
          My Events
        </NavLink>):("")}
        
        <NavLink to="/update-pass" className="link">
          Change password
        </NavLink>
        <NavLink onClick={() => user.setloggedin(false)} className="link" to="/">
          Sign Out
        </NavLink>
      </div>
    </>
  );
}

export default ProfileUpdate;
