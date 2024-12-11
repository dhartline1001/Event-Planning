// routes/tickets.js

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Ticket = require("../models/Ticket"); // Adjust the path if necessary
const Event = require("../models/Event"); // Adjust the path if necessary
const authMiddleware = require("../authMiddleware"); // Adjust the path if necessary

// POST /api/tickets - Create a new ticket
router.post("/", authMiddleware, async (req, res) => {
  const { eventId, quantity } = req.body;

  try {
    // Validate input
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required." });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1." });
    }

    // Check if the event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found." });
    }

    // Optional: Check if there are enough tickets available based on event capacity
    if (event.capacity) {
      // Calculate total tickets sold for this event
      const ticketsSoldAgg = await Ticket.aggregate([
        { $match: { eventId: mongoose.Types.ObjectId(eventId) } },
        { $group: { _id: null, totalSold: { $sum: "$quantity" } } },
      ]);

      const ticketsSold = ticketsSoldAgg[0]?.totalSold || 0;
      if (ticketsSold + quantity > event.capacity) {
        return res.status(400).json({ message: "Not enough tickets available." });
      }
    }

    // Check if the user already has a ticket for this event
    let ticket = await Ticket.findOne({
      userId: req.userId,
      eventId: eventId,
    });

    if (ticket) {
      // If ticket exists, update the quantity
      ticket.quantity += quantity;
      await ticket.save();
    } else {
      // If no ticket exists, create a new one
      ticket = new Ticket({
        userId: req.userId,
        eventId,
        quantity,
      });
      await ticket.save();
    }

    return res.status(201).json({
      message: "Ticket successfully created.",
      ticket: {
        id: ticket._id,
        eventId: ticket.eventId,
        quantity: ticket.quantity,
        purchaseDate: ticket.purchaseDate,
      },
    });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return res.status(500).json({ message: "Server error. Failed to create ticket." });
  }
});

// GET /api/tickets - Retrieve all tickets for the authenticated user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({ message: "User ID not found in request." });
    }

    // Fetch all tickets belonging to the user, populate event details
    const tickets = await Ticket.find({ userId })
      .populate("eventId", "title date location ticketCost image") // Adjust fields as needed
      .sort({ purchaseDate: -1 }); // Sort by most recent purchases

    // Format the tickets for response
    const formattedTickets = tickets.map((ticket) => ({
      ticketId: ticket._id,
      event: {
        id: ticket.eventId._id,
        title: ticket.eventId.title,
        date: ticket.eventId.date,
        location: ticket.eventId.location,
        ticketCost: ticket.eventId.ticketCost,
        image: ticket.eventId.image,
      },
      quantity: ticket.quantity,
      purchaseDate: ticket.purchaseDate,
    }));

    return res.status(200).json({ tickets: formattedTickets });
  } catch (error) {
    console.error("Error fetching user's tickets:", error);
    return res.status(500).json({ message: "Server error. Failed to fetch tickets." });
  }
});

// GET /api/tickets/:eventId - Get ticket quantity for a specific event
router.get("/:eventId", authMiddleware, async (req, res) => {
  const { eventId } = req.params;

  try {
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required." });
    }

    const ticket = await Ticket.findOne({
      userId: req.userId, // Extracted from token by authMiddleware
      eventId: eventId,
    });

    const quantity = ticket ? ticket.quantity : 0;

    return res.status(200).json({ quantity });
  } catch (error) {
    console.error("Error fetching ticket:", error);
    return res.status(500).json({ message: "Server error. Failed to fetch tickets." });
  }
});

module.exports = router;
