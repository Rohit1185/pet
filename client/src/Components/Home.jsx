import { FaSearch } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import foot from '../assets/foot.png';
import FAQ from './Faq';
import dog from '../assets/dog1.jpg'
import cat from '../assets/cat1.jpg'
import '../assets/home.css';

function Home() {
    return (
        <>
            {/* 🏠 Hero Section */}
            <div className="home-hero">
                <div className="hero-content">
                    <h1>Find Your Perfect Pet Companion</h1>
                    <p>Join thousands of adopters and find the perfect pet that suits your lifestyle.</p>
                    <div className="hero-buttons">
                        <button className="hero-btn">
                            <FaSearch />
                            <NavLink to="/aoption-pet" className="hero-btn-link">I want to adopt a pet</NavLink>
                        </button>
                        <button className="hero-btn">
                            <img src={foot} alt="Event Icon" className="foot-img" />
                            <NavLink to="/view-events" className="hero-btn-link">Events & Drives</NavLink>
                        </button>
                    </div>
                </div>
            </div>

            {/* 🐾 How It Works Section */}
            <div className="how-it-works">
                <h2>How It Works</h2>
                <div className="steps">
                    <div className="step">
                        <h3>1. Browse Pets</h3>
                        <p>Explore our list of adorable pets looking for a loving home.</p>
                    </div>
                    <div className="step">
                        <h3>2. Apply for Adoption</h3>
                        <p>Fill out a simple adoption form to express your interest.</p>
                    </div>
                    <div className="step">
                        <h3>3. Meet Your Pet</h3>
                        <p>Schedule a visit to meet your future furry companion.</p>
                    </div>
                    <div className="step">
                        <h3>4. Bring Them Home</h3>
                        <p>Complete the adoption process and welcome your pet home.</p>
                    </div>
                </div>
            </div>

            {/* ❤️ Success Stories */}
            <div className="success-stories">
                <h2>Success Stories</h2>
                <div className="stories">
                    <div className="story">
                        <img src={dog} alt="" />
                        <h3>Lucky’s New Home</h3>
                        <p>&#34;Adopting Lucky changed our lives. He is the happiest pup!&ldquo; – Rahul & Priya</p>
                    </div>
                    <div className="story">
                        <img src={cat} alt="" />
                        <h3>Bella Finds a Family</h3>
                        <p>&ldquo;Bella fit right into our home. We couldn’t be happier!&ldquo; – Ananya</p>
                    </div>
                </div>
            </div>

            {/* 🌟 Testimonials Section */}
            <div className="testimonials">
                <h2>What Our Adopters Say</h2>
                <div className="testimonial-box">
                    <p>&ldquo;The process was smooth, and now I have a best friend for life!&ldquo;</p>
                    <h4>- Arjun</h4>
                </div>
                <div className="testimonial-box">
                    <p>&#34;Amazing platform for pet adoption! Highly recommended.&ldquo;</p>
                    <h4>- Sneha</h4>
                </div>
            </div>

            {/* 🎉 Register Section */}
            <div className="register-section">
                <div className="register-info">
                    <h2>Join PetRehomer Today!</h2>
                    <p>Create your free account and connect with thousands of adopters and pet rehomers.</p>
                    <NavLink to="/register" className="register-btn">Register Now</NavLink>
                </div>
            </div>

            {/* 📖 FAQ Section */}
            <div className="faq-section">
                <FAQ />
            </div>
        </>
    );
}

export default Home;
