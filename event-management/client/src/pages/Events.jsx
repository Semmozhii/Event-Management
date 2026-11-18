
import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import {
    CalendarDays,
    Clock,
    MapPin,
    IndianRupee,
    Users,
    Ticket,
    CheckCircle
} from "lucide-react";

function Events() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [bookingEvent, setBookingEvent] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [ticketCount, setTicketCount] = useState(1);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const navigate = useNavigate();

    // Fetch events
    const fetchEvents = async () => {
        try {
            const response = await API.get("/events");
            setEvents(response.data.events);
        } catch (error) {
            console.error("Error fetching events:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Open ticket selection popup
    const openBookingModal = (event) => {
        setSelectedEvent(event);
        setTicketCount(1);
        setMessage("");
    };

    // Confirm booking
    const handleBooking = async () => {
        if (!selectedEvent) return;

        try {
            setBookingEvent(selectedEvent._id);
            setMessage("");

            await API.post("/bookings", {
                eventId: selectedEvent._id,
                numberOfTickets: ticketCount
            });

            setSelectedEvent(null);
            setShowSuccessModal(true);

            await fetchEvents();

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Booking failed. Please try again."
            );
        } finally {
            setBookingEvent(null);
        }
    };

    if (loading) {
        return <h2>Loading events...</h2>;
    }

    return (
        <div className="events-page">

            <h1>Upcoming Events</h1>
            <p>Explore and discover exciting events.</p>

            {message && <p>{message}</p>}

            <div className="events-container">

                {events.length === 0 ? (
                    <p>No events available right now.</p>
                ) : (
                    events.map((event) => (
                        <div className="event-card" key={event._id}>

                            <h2>{event.title}</h2>

                            <p>{event.description}</p>

                            <p className="event-info">
                                <Ticket size={18} />
                                Category: {event.category}
                            </p>

                            <p className="event-info">
                                <CalendarDays size={18} />
                                Date: {new Date(event.date).toLocaleDateString()}
                            </p>

                            <p className="event-info">
                                <Clock size={18} />
                                Time: {event.time}
                            </p>

                            <p className="event-info">
                                <MapPin size={18} />
                                Venue: {event.venue}
                            </p>

                            <p className="event-info">
                                <IndianRupee size={18} />
                                Price: ₹{event.price} per ticket
                            </p>

                            <p className="event-info">
                                <Users size={18} />
                                Available Seats: {event.availableSeats}
                            </p>

                            <button onClick={() => openBookingModal(event)} disabled={event.availableSeats < 1}
                            >
                                {event.availableSeats < 1
                                    ? "Sold Out"
                                    : "Book Now"}
                            </button>

                        </div>
                    ))
                )}

            </div>

            {/* Ticket Selection Popup */}
            {selectedEvent && (
                <div className="modal-overlay">

                    <div className="success-modal">

                        <h2>Book Your Tickets</h2>

                        <p>{selectedEvent.title}</p>

                        <label>Select Number of Tickets</label>

                        <input type="number" min="1" max={selectedEvent.availableSeats} value={ticketCount} onChange={(e) => {
                                const value = Number(e.target.value);
                                if (
                                    value >= 1 &&
                                    value <= selectedEvent.availableSeats
                                ) {
                                    setTicketCount(value);
                                }
                            }}
                        />

                        <h3>
                            Total Amount: ₹
                            {selectedEvent.price * ticketCount}
                        </h3>

                        <button onClick={handleBooking} disabled={bookingEvent !== null} >
                            {bookingEvent
                                ? "Booking..."
                                : "Confirm Booking"}
                        </button>

                        <button className="continue-button" onClick={() => setSelectedEvent(null)} disabled={bookingEvent !== null} >
                            Cancel
                        </button>

                    </div>

                </div>
            )}

            {/* Booking Success Popup */}
            {showSuccessModal && (
                <div className="modal-overlay">

                    <div className="success-modal">

                        <div className="success-icon">
                            <CheckCircle size={45} />
                        </div>

                        <h2>Booking Confirmed!</h2>

                        <p>
                            Your event tickets have been booked successfully.
                        </p>

                        <button
                            onClick={() => navigate("/my-bookings")}
                        >
                            View My Bookings
                        </button>

                        <button
                            className="continue-button"
                            onClick={() => setShowSuccessModal(false)}
                        >
                            Continue Browsing
                        </button>

                    </div>

                </div>
            )}

        </div>
    );
}

export default Events;
