
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await API.post("/auth/login", formData);

            localStorage.setItem("token", response.data.token);
            window.dispatchEvent(new Event("authChange"));
            // Store logged-in user details
            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            setMessage("Login successful!");

            setTimeout(() => {
                navigate("/");
            }, 1000);

        } catch (error) {
            setMessage(
                error.response?.data?.message || "Login failed!"
            );
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Welcome Back</h1>
                <p>Login to explore and book exciting events.</p>

                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />

                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

                <button type="submit">Login</button>

                {message && <p>{message}</p>}

                <p> Don't have an account? <Link to="/register">Register</Link></p>
            </form>
        </div>
    );
}

export default Login;
