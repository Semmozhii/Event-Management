
const Event = require("../models/Event");
const createEvent = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            date,
            time,
            venue,
            price,
            totalSeats,
            image
        } = req.body;

        if (
            !title || !description || !category ||
            !date || !time || !venue ||
            price === undefined || totalSeats === undefined
        ) {
            return res.status(400).json({
                message: "Please provide all required fields"
            });
        }

        if (
            Number(price) < 0 ||
            !Number.isInteger(Number(totalSeats)) ||
            Number(totalSeats) < 1
        ) {
            return res.status(400).json({
                message: "Invalid price or seat capacity"
            });
        }

        const event = await Event.create({
            title,
            description,
            category,
            date,
            time,
            venue,
            price,
            totalSeats,
            availableSeats: totalSeats,
            image
        });

        res.status(201).json({
            message: "Event created successfully",
            event
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create event",
            error: error.message
        });
    }
};

const getEvents = async (req, res) => {
    try {
        const events = await Event.find().sort({ date: 1 });

        res.status(200).json({
            count: events.length,
            events
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch events",
            error: error.message
        });
    }
};


const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json(event);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch event",
            error: error.message
        });
    }
};

const updateEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json({
            message: "Event updated successfully",
            event
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update event",
            error: error.message
        });
    }
};


const deleteEvent = async (req, res) => {
    try {
        const event = await Event.findByIdAndDelete(req.params.id);

        if (!event) {
            return res.status(404).json({
                message: "Event not found"
            });
        }

        res.status(200).json({
            message: "Event deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete event",
            error: error.message
        });
    }
};


module.exports = {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    deleteEvent
};
