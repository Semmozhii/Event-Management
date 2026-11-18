
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
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
            const response = await API.post("/auth/register", formData);

            setMessage(response.data.message || "Registration successful!");

            setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            setMessage(
                error.response?.data?.message || "Registration failed!"
            );
        }
    };

    return (
        <div className="auth-page">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h1>Create Account</h1>
                <p>Join EventHub and discover exciting events.</p>

                <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />

                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />

                <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />

                <button type="submit">Register</button>

                {message && <p>{message}</p>}

                <p>
                    Already have an account? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}

export default Register;
