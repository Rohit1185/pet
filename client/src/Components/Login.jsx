import '../assets/login.css';
import dog from '../assets/dog3.png';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { useContext, useRef, useState } from 'react';
import userContext from '../Context/userContext';
import { useNavigate } from 'react-router-dom';
import userProfile from '../Context/userProfile';

function Login() {
    let user = useContext(userContext);
    let userDemo = useContext(userContext)
    let userProfileData = useContext(userProfile);
    let emailref = useRef("");
    let pwdref = useRef("");
    const [msg, setmsg] = useState("");
    const [errors, setErrors] = useState({});
    let navigate = useNavigate();
    const validate = () => {
        let errorObj = {};
        let email = emailref.current.value;
        let password = pwdref.current.value;
        
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailStartPattern = /^[0-9]/; // 🔹 Prevent email from starting with a number
    
        if (!email) {
            errorObj.email = "Email is required.";
        } else if (!emailPattern.test(email)) {
            errorObj.email = "Invalid email format.";
        } else if (emailStartPattern.test(email)) {
            errorObj.email = "Email cannot start with a number."; // 🔹 New validation rule
        }
        
        if (!password) {
            errorObj.password = "Password is required.";
        } else if (password.length <= 3) {
            errorObj.password = "Password must be greater than 3 characters.";
        }
        
        setErrors(errorObj);
        return Object.keys(errorObj).length === 0;
    };
    
    
    const loginUser = async () => {
        console.log("sdkfhk")
        if (!validate()) return;
        let data = {
            email: emailref.current.value,
            pass: pwdref.current.value,
        };

        try {
            
            const response = await axios.post("http://localhost:8080/login", data);
            const { success, message, userdata } = await response.data;
            if (message.status === 403) {
                alert("User account is disabled. Please contact admin.");
                return;
            }
            console.log(response.data)
            if (success) {
                setmsg(message);
                console.log("User Data",userdata[0]);
                userProfileData.setuserdetails(userdata[0])
                user.setloggedin(true);
                userDemo.setloggedin(true)
                console.log("Shelter ",userdata[0].isShelter)
                if (userdata[0].isShelter === 'YES') {
                    navigate(`/profile`);
                }
                else if(userdata[0].isAdmin===true){
                    navigate('/login/admin-dashboard')
                }
                else{
                    navigate('/')
                }
            } else {
                setmsg(message);
                user.setloggedin(false);
            }
        } catch (error) {
            if (error.response && error.response.status === 403) {
                alert("User account is disabled. Please contact admin.");
            } else {
                setmsg("An error occurred while logging in.");
            }
            user.setloggedin(false);
            console.log(error)
        }
    };

    return (
        <div className="log-main">
            <div className="log-main2">
                <div className="log-dog-photo">
                    <img src={dog} alt="PHOTO" className="right_img" />
                </div>
                <div className="log_box_white">
                    <form className="logform2">
                        <h1 className="login"> Login</h1>
                        <label className="log-label"> Email:</label>
                        <br />
                        <input type="email" name="email" ref={emailref} placeholder='Enter Your Email'/>
                        {errors.email && <span className="error">{errors.email}</span>}
                        <br />
                        <label className="log-label"> Password: </label>
                        <br />
                        <input type="password" name="pass" ref={pwdref} placeholder='Enter Your Password' />
                        {errors.password && <span className="error">{errors.password}</span>}
                        <br />
                        <input
                            type="button"
                            value="Login"
                            className="button-login"
                            onClick={loginUser}
                        />
                        {msg && <p className="response-message">{msg}</p>}
                        <NavLink className='forgot-pass' to='/forgotpass'>Forgot Password?</NavLink>
                        <p className="log-in-link">
                            Dont have an account? <NavLink to="/register">Register here</NavLink>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Login;
