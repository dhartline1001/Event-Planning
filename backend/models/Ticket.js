// models/Ticket.js

const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // References the User model
    required: true,
    index: true, // For faster queries
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event", // References the Event model
    required: true,
    index: true, // For faster queries
  },
  quantity: {
    type: Number,
    default: 1, // Default to 1 ticket
    min: 1,
  },
  purchaseDate: {
    type: Date,
    default: Date.now, // Automatically set to the current timestamp
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

module.exports = Ticket;
