import { NavLink } from "react-router-dom";
import { useContext, useState } from "react";
import userProfile from "../Context/userProfile";
import "../assets/navigation.css"; 
import dogLogo from "../assets/dog3.png";
import userimg from "../assets/user.jpg";

export default function Navigation() {
    const user = useContext(userProfile);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    return (
        <nav className="navbar">
            {/* Logo & Platform Name */}
            <div className="navbar-brand">
                <NavLink to="/" className="navbar-logo">
                    <img src={dogLogo} alt="Logo" />
                </NavLink>
                <span className="platform-name">PET ADOPTION PLATFORM</span>
            </div>

            <ul className="navbar-links">
                <li><NavLink to="/" className="navbar-item">Home</NavLink></li>
                <li><NavLink to="/found-pet" className="navbar-item">Found Pet</NavLink></li>
                <li><NavLink to="/adopt-pet" className="navbar-item">Adopt Pet</NavLink></li>
                <li><NavLink to="/events-drives" className="navbar-item">Events & Drives</NavLink></li>

                {/* Dropdown Menu */}
                <li 
                    className="navbar-dropdown"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                >
                    <span className="dropdown-title">Resources</span>
                    {dropdownOpen && (
                        <ul className="dropdown-menu">
                            <li><NavLink to="/resource/food" className="dropdown-item">Food</NavLink></li>
                            <li><NavLink to="/resource/training" className="dropdown-item">Training</NavLink></li>
                            <li><NavLink to="/resource/health" className="dropdown-item">Health</NavLink></li>
                        </ul>
                    )}
                </li>

                <li><NavLink to="/donation" className="navbar-item">Donation</NavLink></li>

                {/* Login/Register or Profile */}
                {user.isloggedin ? (
                    <li className="navbar-profile">
                        <NavLink to="/profile">
                            <img 
                                src={user.userdetails.userImg ? `http://localhost:8080/uploads/${user.userdetails.userImg}` : userimg} 
                                alt="User Profile" 
                                className="profile-img" 
                            />
                        </NavLink>
                    </li>
                ) : (
                    <>
                        <li><NavLink to="/register" className="navbar-item">Register</NavLink></li>
                        <li><NavLink to="/login" className="navbar-item">Login</NavLink></li>
                    </>
                )}
            </ul>
        </nav>
    );
}
