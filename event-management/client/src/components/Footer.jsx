
import { Link } from "react-router-dom";
import {CalendarDays, Mail, MapPin} from "lucide-react";
function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-about">
                    <h2>
                        <CalendarDays size={24} />
                            EventHub
                    </h2>

                    <p>
                        Discover unforgettable experiences, explore exciting
                        events and make every moment count.
                    </p>
                </div>

                <div className="footer-links">
                    <h3>Quick Links</h3>
                    <Link to="/">Home</Link>
                    <Link to="/events">Explore Events</Link>
                    <Link to="/my-bookings">My Bookings</Link>
                </div>

                <div className="footer-contact">
                    <h3>Contact Us</h3>
                    <p>
                        <Mail size={17} />
                        support@eventhub.com
                    </p>
                    <p>
                        <MapPin size={17} />
                        India
                    </p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} EventHub. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
