
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Register from "./pages/Register";
import Login from "./pages/Login";
import MyBooking from "./pages/MyBooking";
import Footer from "./components/Footer";
import Admin from "./pages/Admin";
import AdminRoute from "./components/AdminRoute";

function App() {
    return (
        <>
            <Navbar />

            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/events" element={<Events />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/my-bookings" element={<MyBooking />} />

                {/* Admin Protected Route */}
                <Route element={<AdminRoute />}>
                    <Route path="/admin" element={<Admin />} />
                </Route>
            </Routes>

            <Footer />
        </>
    );
}

export default App;
