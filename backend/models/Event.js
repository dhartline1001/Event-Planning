
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  capacity: { type: Number },
  ticketCost: { type: Number },
  image: { type: String }, // Base64 string
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;