
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Home() {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);

    const sliderRef = useRef(null);

    // Fetch events from MongoDB through backend API
    useEffect(() => {
        API.get("/events")
            .then((response) => {
                setEvents(response.data.events || []);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching events:", error);
                setLoading(false);
            });
    }, []);

    // Automatic slider
    useEffect(() => {
        if (events.length <= 1) return;

        const interval = setInterval(() => {
            if (sliderRef.current) {
                const slider = sliderRef.current;

                if (
                    slider.scrollLeft + slider.clientWidth >=
                    slider.scrollWidth - 10
                ) {
                    slider.scrollTo({
                        left: 0,
                        behavior: "smooth"
                    });
                } else {
                    slider.scrollBy({
                        left: 300,
                        behavior: "smooth"
                    });
                }
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [events]);

    // Manual slider arrows
    const slide = (direction) => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({
                left: direction === "right" ? 320 : -320,
                behavior: "smooth"
            });
        }
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="hero">
                <h1>Every Event Has a Story. Be Part of It.</h1>

                <p>
                    Discover unforgettable experiences, explore exciting
                    events and make every moment count.
                </p>

                <Link to="/events">
                    <button>Explore Events</button>
                </Link>
            </section>

            {/* Upcoming Events Section */}
            <section className="home-events-section">

                <div className="home-events-heading">
                    <div>
                        <h2>Find Your Next Experience</h2>

                        <p>
                            From live entertainment to inspiring gatherings,
                            discover events worth looking forward to.
                        </p>
                    </div>

                
                </div>

                {/* Loading */}
                {loading ? (
                    <p>Loading events...</p>
                ) : events.length === 0 ? (
                    <p>No events available right now.</p>
                ) : (

                    /* Event Slider */
                    <div className="home-slider-wrapper">

                        <button
                            className="slider-arrow"
                            onClick={() => slide("left")}
                        >
                            <ChevronLeft />
                        </button>

                        <div
                            className="home-events-slider"
                            ref={sliderRef}
                        >
                            {events.map((event) => (
                                <Link
                                    to="/events"
                                    className="home-event-card"
                                    key={event._id}
                                >
                                    <span className="event-category">
                                        {event.category}
                                    </span>

                                    <h3>{event.title}</h3>

                                    <p>{event.description}</p>

                                    <div className="home-event-details">

                                        <span>
                                            {new Date(
                                                event.date
                                            ).toLocaleDateString()}
                                        </span>

                                        <span>{event.venue}</span>

                                        <strong>₹{event.price}</strong>

                                    </div>

                                    <span className="card-book-link">
                                        Explore Event 
                                    </span>
                                </Link>
                            ))}
                        </div>

                        <button className="slider-arrow" onClick={() => slide("right")}>
                            <ChevronRight />
                        </button>

                    </div>
                )}
            </section>
        </div>
    );
}

export default Home;
