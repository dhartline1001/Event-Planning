import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import { EventContext } from "../../context/EventContext";
import { TicketContext } from "../../context/TicketContext";

const HomePage = () => {
  const navigate = useNavigate();
  const { events } = useContext(EventContext); // Fetch events from context
  const { addTicket } = useContext(TicketContext);

  const handleEventClick = (event) => {
    navigate(`/event-preview/${event.id}`, { state: event });
  };

  const handleAddTicket = (event) => {
    addTicket(event);
    alert(
      event.ticketCost > 0
        ? `You have paid $${event.ticketCost} for ${event.title}.`
        : `You have successfully added your ticket for ${event.title}.`
    );
  };

  return (
    <div className="home-container">
      <div className="scrolling-bar">
        <p>🎉 Check out the hottest events of the season!</p>
      </div>

      <h1>Current Events</h1>
      {events.length > 0 ? (
        <div className="event-list">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              {event.image && <img src={event.image} alt={event.title} className="event-image" />}
              <h2>{event.title}</h2>
              <p>{event.description}</p>
              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Location:</strong> {event.location}</p>
              <p><strong>Cost:</strong> {event.ticketCost > 0 ? `$${event.ticketCost}` : "Free"}</p>
              <button className="pay-add-btn" onClick={() => handleAddTicket(event)}>
                {event.ticketCost > 0 ? `Pay $${event.ticketCost}` : "Add Ticket"}
              </button>
              <button className="view-details-btn" onClick={() => handleEventClick(event)}>
                View Details
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No events available. Create one!</p>
      )}
    </div>
  );
};

export default HomePage;
