import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./HomePage.css";

const HomePage = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]); // Local state for all events
  const [filteredEvents, setFilteredEvents] = useState([]); // State for filtered events based on search
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search bar input

  // Fetch events from backend
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        if (!backendUrl) {
          throw new Error("REACT_APP_BACKEND_URL is not defined");
        }

        const response = await axios.get(`${backendUrl}/api/events`);
        console.log("Fetched events:", response.data.events);

        if (response.data && Array.isArray(response.data.events)) {
          setEvents(response.data.events);
          setFilteredEvents(response.data.events); // Initially set filtered events to all events
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        alert("Failed to load events.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Event click handler
  const handleEventClick = (event) => {
    if (event && event._id) {
      navigate(`/event-preview/${event._id}`); // Navigate to the event preview page
    } else {
      console.error("Invalid event data:", event);
      alert("Invalid event data.");
    }
  };

  // Search handler
  const handleSearch = (query) => {
    const filtered = events.filter((event) =>
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase()) ||
      event.location.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEvents(filtered); // Update filtered events with the results
  };

  // Keydown handler to trigger search on "Enter"
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch(searchQuery); // Search only when Enter is pressed
    }
  };

  // Search button click handler
  const handleSearchButtonClick = () => {
    handleSearch(searchQuery); // Trigger the search when the button is clicked
  };

  return (
    <div className="home-container">
      <div className="scrolling-bar">
        <p>🎉 Check out the hottest events of the season! 🎉</p>
      </div>

      <div className="search-bar-container">
        {/* Search Bar */}
        <input
          className="search-input"
          type="text"
          placeholder="Search for events..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query as user types
          onKeyDown={handleKeyDown} // Trigger search on Enter key press
        />
        {/* Search Button with Image */}
        <button className="search-button" onClick={handleSearchButtonClick}>
          <img src="/search.png" alt="Search" className="search-icon" />
        </button>
      </div>

      {loading ? (
        <div className="spinner"></div>
      ) : filteredEvents.length > 0 ? (
        <div className="event-list">
          {filteredEvents.map((event) => {
            console.log("Rendering event:", event);
            return (
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
            );
          })}
        </div>
      ) : (
        <p>No events available. Create one!</p>
      )}
    </div>
  );
};

export default HomePage;
