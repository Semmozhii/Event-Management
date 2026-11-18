
import { useEffect, useState } from "react";
import API from "../services/api";
import {
    Ticket,
    CalendarDays,
    MapPin,
    Clock,
    CalendarCheck
} from "lucide-react";

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const fetchBookings = async () => {
        try {
            const response = await API.get("/bookings/my-bookings");
            setBookings(response.data.bookings);
            setMessage("");
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Unable to fetch bookings."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleCancel = async (bookingId) => {
        const confirmCancel = window.confirm(
            "Are you sure you want to cancel this booking?"
        );

        if (!confirmCancel) return;

        try {
            await API.put(`/bookings/cancel/${bookingId}`);
            setMessage("Booking cancelled successfully!");
            fetchBookings();
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Cancellation failed."
            );
        }
    };

    if (loading) {
        return <h2>Loading your bookings...</h2>;
    }

    return (
        <div className="bookings-page">

            <div className="bookings-header">
                <h1>My Bookings</h1>
                <p>All your event tickets in one place.</p>
            </div>

            {message && <p className="booking-message">{message}</p>}

            {bookings.length === 0 ? (
                <div className="empty-bookings">
                    <div className="empty-icon">
                        <Ticket size={55} strokeWidth={1.5} />
                    </div>

                    <h2>No bookings yet!</h2>

                    <p>
                        You haven't booked any events.
                        Explore events and reserve your tickets.
                    </p>
                </div>
            ) : (
                <div className="bookings-container">

                    {bookings.map((booking) => (
                        <div className="booking-card" key={booking._id}>

                            <div className="booking-card-header">
                                <h2>
                                    {booking.event?.title || "Event unavailable"}
                                </h2>

                                <span
                                    className={`booking-status ${booking.status}`}
                                >
                                    {booking.status}
                                </span>
                            </div>

                            {booking.event && (
                                <div className="booking-event-info">

                                    <p>
                                        <CalendarDays size={18} />
                                        Date:{" "}
                                        {new Date(
                                            booking.event.date
                                        ).toLocaleDateString()}
                                    </p>

                                    <p>
                                        <MapPin size={18} />
                                        Venue: {booking.event.venue}
                                    </p>

                                    <p>
                                        <Clock size={18} />
                                        Time: {booking.event.time}
                                    </p>

                                </div>
                            )}

                            <div className="booking-details">
                                <p>
                                    Tickets: <strong>{booking.numberOfTickets}</strong>
                                </p>

                                <p>
                                    Total Amount:{" "}
                                    <strong>₹{booking.totalAmount}</strong>
                                </p>
                            </div>

                            {booking.status === "confirmed" ? (
                                <button
                                    className="cancel-booking-btn"
                                    onClick={() => handleCancel(booking._id)}
                                >
                                    Cancel Booking
                                </button>
                            ) : (
                                <p className="cancelled-text"> This booking has been cancelled. </p>
                            )}

                        </div>
                    ))}

                </div>
            )}

        </div>
    );
}

export default MyBookings;
