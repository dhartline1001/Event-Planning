import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]); // Local state for events
  const [loading, setLoading] = useState(true);

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events");
        setEvents(response.data.events);
      } catch (error) {
        console.error("Error fetching events:", error);
        alert("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventClick = (event) => {
    navigate(`/event-preview/${event._id}`); // Pass event ID in the URL
  };
  

  return (
    <div className="home-container">
      <div className="scrolling-bar">
        <p>🎉 Check out the hottest events of the season!</p>
      </div>

      <h1>Current Events</h1>
      {loading ? (
        <p>Loading events...</p>
      ) : events.length > 0 ? (
        <div className="event-list">
          {events.map((event) => (
            <div
              key={event._id}
              className="event-card"
              onClick={() => handleEventClick(event)}
            >
              {event.image && (
                <>
                  <img src={event.image} alt={event.title} />
                  <div className="price-overlay">
                    {event.ticketCost > 0 ? `$${event.ticketCost}` : "Free"}
                  </div>
                </>
              )}
              <h2>{event.title}</h2>
              <p>{event.description}</p>
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
