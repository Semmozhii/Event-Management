
import { useEffect, useState } from "react";
import API from "../services/api";
import {Plus, Pencil, Trash2, CalendarDays, MapPin, IndianRupee, Users, X} from "lucide-react";

function Admin() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const initialForm = {
        title: "",
        description: "",
        category: "",
        date: "",
        time: "",
        venue: "",
        price: "",
        totalSeats:""
    };

    const [formData, setFormData] = useState(initialForm);

    // Fetch all events
    const fetchEvents = async () => {
        try {
            const response = await API.get("/events");
            setEvents(response.data.events || []);
        } catch (error) {
            setMessage("Unable to load events.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    // Handle form inputs
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Open create form
    const handleCreate = () => {
        setEditingId(null);
        setFormData(initialForm);
        setMessage("");
        setShowForm(true);
    };

    // Open edit form
    const handleEdit = (event) => {
        setEditingId(event._id);

        setFormData({
            title: event.title || "",
            description: event.description || "",
            category: event.category || "",
            date: event.date
                ? new Date(event.date).toISOString().split("T")[0]
                : "",
            time: event.time || "",
            venue: event.venue || "",
            price: event.price ?? "",
            totalSeats: event.totalSeats ?? event.availableSeats ?? ""
        });

        setMessage("");
        setShowForm(true);
    };

    // Create or update event
    const handleSubmit = async (e) => {
        e.preventDefault();

        const eventData = {
            ...formData,
            price: Number(formData.price),
            totalSeats: Number(formData.totalSeats)
        };

        try {
            if (editingId) {
                await API.put(`/events/${editingId}`, eventData);
                setMessage("Event updated successfully!");
            } else {
                await API.post("/events", eventData);
                setMessage("Event created successfully!");
            }

            setShowForm(false);
            setEditingId(null);
            setFormData(initialForm);
            await fetchEvents();

        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        }
    };

    // Delete event
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this event?"
        );

        if (!confirmDelete) return;

        try {
            await API.delete(`/events/${id}`);
            setMessage("Event deleted successfully!");
            await fetchEvents();
        } catch (error) {
            setMessage(
                error.response?.data?.message ||
                "Unable to delete event."
            );
        }
    };

    return (
        <div className="admin-page">

            <div className="admin-header">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p>Manage your events in one place.</p>
                </div>

                <button className="add-event-btn" onClick={handleCreate}>
                    <Plus size={18} />
                    Add New Event
                </button>
            </div>

            {message && (
                <p className="admin-message">{message}</p>
            )}

            <div className="admin-stats">
                <div className="admin-stat-card">
                    <CalendarDays size={25} />
                    <div>
                        <h2>{events.length}</h2>
                        <p>Total Events</p>
                    </div>
                </div>
            </div>

            {/* Create / Edit Form */}
            {showForm && (
                <div className="admin-form-container">
                    <div className="admin-form-heading">
                        <h2>
                            {editingId ? "Edit Event" : "Create New Event"}
                        </h2>

                        <button type="button" className="close-form-btn" onClick={() => setShowForm(false)} >
                            <X size={22} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="admin-form">

                        <div className="admin-form-grid">

                            <div className="admin-input-group">
                                <label>Event Title</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} placeholder="Enter event title" required />
                            </div>

                            <div className="admin-input-group">
                                <label>Category</label>
                                <input type="text" name="category" value={formData.category} onChange={handleChange} placeholder="Music, Technology, Sports..." required />
                            </div>

                            <div className="admin-input-group">
                                <label>Date</label>
                                <input type="date" name="date" value={formData.date} onChange={handleChange} required />
                            </div>

                            <div className="admin-input-group">
                                <label>Time</label>
                                <input type="time" name="time" value={formData.time} onChange={handleChange} required />
                            </div>

                            <div className="admin-input-group">
                                <label>Venue</label>
                                <input type="text" name="venue" value={formData.venue} onChange={handleChange} placeholder="Enter venue" required />
                            </div>

                            <div className="admin-input-group">
                                <label>Ticket Price (₹)</label>
                                <input type="number" name="price" min="0" value={formData.price} onChange={handleChange} placeholder="Enter price" required />
                            </div>

                            <div className="admin-input-group">
                                <label>Total Seat Capacity</label>
                                <input type="number" name="totalSeats" min="1" value={formData.totalSeats} onChange={handleChange} placeholder="Enter total seats" required />
                            </div>

                        </div>

                        <div className="admin-input-group">
                            <label>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Describe the event" rows="4" required />
                        </div>

                        <div className="admin-form-actions">
                            <button type="submit">
                                {editingId ? "Update Event" : "Create Event"}
                            </button>

                            <button
                                type="button"
                                className="cancel-form-btn"
                                onClick={() => setShowForm(false)}
                            >
                                Cancel
                            </button>
                        </div>

                    </form>
                </div>
            )}

            {/* Events List */}
            <div className="admin-events-section">
                <h2>Manage Events</h2>

                {loading ? (
                    <p>Loading events...</p>
                ) : events.length === 0 ? (
                    <p>No events available. Create your first event!</p>
                ) : (
                    <div className="admin-events-grid">

                        {events.map((event) => (
                            <div className="admin-event-card" key={event._id}>

                                <div className="admin-event-card-header">
                                    <span>{event.category}</span>

                                    <div className="admin-event-actions">
                                        <button
                                            onClick={() => handleEdit(event)}
                                            title="Edit Event"
                                        >
                                            <Pencil size={18} />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(event._id)}
                                            title="Delete Event"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <h3>{event.title}</h3>
                                <p>{event.description}</p>

                                <div className="admin-event-info">
                                    <span>
                                        <CalendarDays size={16} />
                                        {new Date(event.date).toLocaleDateString()}
                                    </span>

                                    <span>
                                        <MapPin size={16} />
                                        {event.venue}
                                    </span>

                                    <span>
                                        <IndianRupee size={16} />
                                        {event.price}
                                    </span>

                                    <span>
                                        <Users size={16} />
                                        {event.availableSeats} seats
                                    </span>
                                </div>

                            </div>
                        ))}

                    </div>
                )}
            </div>

        </div>
    );
}

export default Admin;
