import React, { useContext } from "react";
import { useLocation } from "react-router-dom";
import "./EventPreviewPage.css";
import { TicketContext } from "../../context/TicketContext";

const EventPreviewPage = () => {
  const location = useLocation();
  const event = location.state;
  const { addTicket } = useContext(TicketContext);

  if (!event) {
    return <p>No event details available.</p>;
  }

  const handleAddTicket = () => {
    addTicket(event);
    alert(
      event.ticketCost > 0
        ? `You have paid $${event.ticketCost} for ${event.title}.`
        : `You have successfully added your ticket for ${event.title}.`
    );
  };

  return (
    <div className="event-preview-container">
      <h1>{event.title}</h1>
      {event.image && <img src={event.image} alt={event.title} className="event-preview-image" />}
      <p><strong>Description:</strong> {event.description}</p>
      <p><strong>Date:</strong> {event.date}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Cost:</strong> {event.ticketCost > 0 ? `$${event.ticketCost}` : "Free"}</p>
      <button className="pay-add-btn" onClick={handleAddTicket}>
        {event.ticketCost > 0 ? `Pay $${event.ticketCost}` : "Add Ticket"}
      </button>
    </div>
  );
};

export default EventPreviewPage;
