import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import userProfile from "../Context/userProfile";
import "../assets/shelterNavbar.css";
import logo from "../assets/dog3.png";
import defaultUser from "../assets/user.jpg";

function ShelterNavbar() {
    const user = useContext(userProfile);
    const shelterId = user.userdetails.shelterId;
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <NavLink to="/" className="navbar-logo">
                    <img src={logo} alt="Shelter Logo" />
                </NavLink>
                <span className="shelter-title">Pet Adoption Platform</span>
            </div>

            <ul className="navbar-links">
                <li><NavLink to={`/shelter-dashboard/${shelterId}`} className="navbar-item">Dashboard</NavLink></li>
                <li><NavLink to="/shelter-list-page" className="navbar-item">Add Pets</NavLink></li>
                <li><NavLink to="/adoption-pet" className="navbar-item">Adopt Pet</NavLink></li>
                <li><NavLink to="/shelter-add-events" className="navbar-item">Add Events & Drives</NavLink></li>

                {/* Dropdown Menu */}
                <li 
                    className="navbar-dropdown"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                >
                    <span className="dropdown-title">Resources</span>
                    {dropdownOpen && (
                        <ul className="dropdown-menu">
                            <li><NavLink to="/food-page" className="dropdown-item">Food</NavLink></li>
                            <li><NavLink to="/training-page" className="dropdown-item">Training</NavLink></li>
                            <li><NavLink to="/health-page" className="dropdown-item">Health</NavLink></li>
                        </ul>
                    )}
                </li>

                <li><NavLink to="/add-donation" className="navbar-item">Add Donation</NavLink></li>

                {/* Profile Image */}
                <li className="navbar-profile">
                    <NavLink to="/profile" className="navbar-profile-link">
                        <img 
                            src={user.userdetails.userImg ? `http://localhost:8080/uploads/${user.userdetails.userImg}` : defaultUser} 
                            alt="User Profile" 
                            className="profile-img" 
                        />
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}
export default ShelterNavbar