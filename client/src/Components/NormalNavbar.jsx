import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import userProfile from "../Context/userProfile";
import "../assets/shelterNavbar.css";
import dogLogo from "../assets/dog3.png";
import userimg from "../assets/user.jpg";

function NormalNavbar() {
    const user = useContext(userProfile);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    
    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <NavLink to="/" className="navbar-logo">
                    <img src={dogLogo} alt="Logo" />
                </NavLink>
                <span className="shelter-title">PET ADOPTION PLATFORM</span>
            </div>

            <ul className="navbar-links">
                <li><NavLink to="/" className="navbar-item">Home</NavLink></li>
                <li><NavLink to="/adoption-pet" className="navbar-item">Browse Pet</NavLink></li>
                <li><NavLink to="/view-events" className="navbar-item">Events & Drives</NavLink></li>

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

                <li><NavLink to="/donation" className="navbar-item">Donation</NavLink></li>

                {/* Profile Image */}
                <li className="navbar-profile">
                    <NavLink to="/profile" className="navbar-profile-link">
                        <img 
                            src={user.userdetails.userImg ? `http://localhost:8080/uploads/${user.userdetails.userImg}` : userimg} 
                            alt="User Profile" 
                            className="profile-img" 
                        />
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
}

export default NormalNavbar;
