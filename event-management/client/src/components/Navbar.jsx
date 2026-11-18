
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {UserRound, Moon, Sun, LogOut, Ticket, House, CalendarDays, Camera} from "lucide-react";

function Navbar() {
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem("token"));
    const user = JSON.parse(localStorage.getItem("user") || "null");
    const [profileOpen, setProfileOpen] = useState(false);
    const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || "");
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    useEffect(() => {
        document.body.className = theme === "dark" ? "dark-theme" : "";
        localStorage.setItem("theme", theme);
    }, [theme]);

    // Authentication 
    useEffect(() => {
        const updateAuth = () => {
            setToken(localStorage.getItem("token"));
        };

        window.addEventListener("authChange", updateAuth);

        return () => {
            window.removeEventListener("authChange", updateAuth);
        };
    }, []);

    // Logout
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setProfileOpen(false);
        navigate("/login");
    };

    // Theme toggle
    const toggleTheme = () => {
        setTheme(theme === "light" ? "dark" : "light");
    };

    // Profile image upload
    const handleImageUpload = (event) => {
        const file = event.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            alert("Please select an image file.");
            return;
        }

        if (file.size > 2 * 1024 * 1024) {
            alert("Please choose an image smaller than 2 MB.");
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            setProfileImage(reader.result);
            localStorage.setItem("profileImage", reader.result);
        };

        reader.readAsDataURL(file);
    };

    return (
        <nav className="navbar">
            <h2>EventHub</h2>
            <div className="nav-links">
                <Link to="/">
                    <House size={18} /> Home
                </Link>

                <Link to="/events">
                    <CalendarDays size={18} /> Events
                </Link>

                {token ? (
                    <div className="profile-container">

                        <button
                            className="profile-button"
                            onClick={() => setProfileOpen(!profileOpen)}
                        >
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" />
                            ) : (
                                <UserRound size={22} />
                            )}
                        </button>

                        {profileOpen && (
                            <div className="profile-dropdown">

                                <div className="profile-info">
                                    <h3>{user?.name || "User"}</h3>
                                    <p>{user?.email || ""}</p>
                                </div>

                                <label className="upload-profile">
                                    <Camera size={17} />
                                    Change Photo
                                    <input type="file" accept="image/*" onChange={handleImageUpload} hidden />
                                </label>

                                <Link to="/my-bookings" onClick={() => setProfileOpen(false)}>
                                    <Ticket size={17} />
                                    My Bookings
                                </Link>

                                <button onClick={toggleTheme}>
                                    {theme === "light" ? (
                                        <>
                                            <Moon size={17} />
                                            Dark Mode
                                        </>
                                    ) : (
                                        <>
                                            <Sun size={17} />
                                            Light Mode
                                        </>
                                    )}
                                </button>

                                <button onClick={handleLogout}>
                                    <LogOut size={17} />
                                    Logout
                                </button>

                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                )}

            </div>
        </nav>
    );
}

export default Navbar;
