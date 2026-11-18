
const Booking = require("../models/Booking");
const Event = require("../models/Event");
const createBooking = async (req, res) => {
    try {
        const { eventId, numberOfTickets } = req.body;

        // Input Validation
        if (!eventId || !Number.isInteger(numberOfTickets) || numberOfTickets < 1) {
            return res.status(400).json({
                message: "Please provide a valid event ID and ticket count"
            });
        }

        const event = await Event.findOneAndUpdate(
            {
                _id: eventId,
                availableSeats: { $gte: numberOfTickets }
            },
            {
                $inc: { availableSeats: -numberOfTickets }
            },
            { new: true }
        );

        if (!event) {
            return res.status(400).json({
                message: "Event not found or not enough seats available"
            });
        }

        // Cal Total amt
        const totalAmount = event.price * numberOfTickets;

        // Create booking
        const booking = await Booking.create({
            user: req.user._id,
            event: event._id,
            numberOfTickets,
            totalAmount
        });

        res.status(201).json({
            message: "Booking successful",
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Booking failed",
            error: error.message
        });
    }
};


// My Bookings
const getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({
            user: req.user._id
        })
        .populate("event")
        .sort({ createdAt: -1 });

        res.status(200).json({
            count: bookings.length,
            bookings
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch bookings",
            error: error.message
        });
    }
};


// Cancel Booking
const cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user._id,
                status: "confirmed"
            },
            {
                $set: { status: "cancelled" }
            },
            { new: true }
        );

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found or already cancelled"
            });
        }

        // Available seats
        await Event.findByIdAndUpdate(
            booking.event,
            {
                $inc: {
                    availableSeats: booking.numberOfTickets
                }
            }
        );

        res.status(200).json({
            message: "Booking cancelled successfully",
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: "Cancellation failed",
            error: error.message
        });
    }
};



module.exports = { createBooking, getMyBookings, cancelBooking};
