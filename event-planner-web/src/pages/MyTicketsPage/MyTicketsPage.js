// src/components/MyTicketsPage.js

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyTicketsPage.css";

const MyTicketsPage = () => {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]); // Local state for tickets
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch tickets from backend
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view your tickets.");
          setLoading(false);
          return;
        }

        const response = await axios.get(process.env.REACT_APP_BACKEND_URL + "api/tickets", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setTickets(response.data.tickets);
        console.log("Fetched Tickets:", response.data.tickets); // For debugging
      } catch (error) {
        console.error("Error fetching tickets:", error);
        setError("Failed to load tickets.");
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Function to delete a ticket
  const deleteTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to delete a ticket.");
        return;
      }

      await axios.delete(`http://localhost:5000/api/tickets/${ticketId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Remove the deleted ticket from the state
      setTickets((prevTickets) =>
        prevTickets.filter((ticket) => ticket.ticketId !== ticketId)
      );
    } catch (error) {
      console.error("Error deleting ticket:", error);
      setError("Failed to delete ticket.");
    }
  };

  // Handle click on the event card to navigate to event preview
  const handleEventClick = (ticket) => {
    // Determine the correct event ID path based on your data structure
    const eventId = ticket.event?._id || ticket.eventId || ticket.event?.id;

    if (eventId) {
      navigate(`/event-preview/${eventId}`);
    } else {
      alert("Event information is missing for this ticket.");
      console.error("Missing event ID for ticket:", ticket);
    }
  };

  if (loading) {
    return (
      <div className="my-tickets-container">
        <h1>My Tickets</h1>
        <div className="spinner"></div>
        <p>Loading your tickets...</p>
      </div>
    );
  }

  return (
    <div className="my-tickets-container">
      <h1>My Tickets</h1>
      {error && <p className="my-tickets-error-message">{error}</p>}

      {/* Upcoming Tickets Section */}
      <section className="my-tickets-section">
        <h2>Upcoming Tickets</h2>
        {tickets.filter(ticket => new Date(ticket.event.date) >= new Date()).length > 0 ? (
          <div className="my-tickets-list">
            {tickets
              .filter(ticket => new Date(ticket.event.date) >= new Date())
              .map((ticket) => {
                const eventId = ticket.event?._id || ticket.eventId || ticket.event?.id;
                return (
                  <div
                    key={ticket.ticketId}
                    className={`my-tickets-card ${!eventId ? 'disabled-card' : ''}`}
                    onClick={() => eventId && handleEventClick(ticket)}
                  >
                    {ticket.event.image && (
                      <>
                        <img src={ticket.event.image} alt={ticket.event.title} loading="lazy" />
                        <div className="my-tickets-price-overlay">
                          {ticket.event.ticketCost > 0 ? `$${ticket.event.ticketCost}` : "Free"}
                        </div>
                      </>
                    )}
                    <h2>{ticket.event.title}</h2>
                    <p>{ticket.event.description}</p>
                    <p><strong>Quantity:</strong> {ticket.quantity}</p>
                    <p><strong>Purchase Date:</strong> {new Date(ticket.purchaseDate).toLocaleString()}</p>
                  </div>
                );
              })}
          </div>
        ) : (
          <p>You have no upcoming tickets.</p>
        )}
      </section>

      {/* Past Tickets Section */}
      <section className="my-tickets-section">
        <h2>Past Tickets</h2>
        {tickets.filter(ticket => new Date(ticket.event.date) < new Date()).length > 0 ? (
          <div className="my-tickets-list">
            {tickets
              .filter(ticket => new Date(ticket.event.date) < new Date())
              .map((ticket) => {
                const eventId = ticket.event?._id || ticket.eventId || ticket.event?.id;
                return (
                  <div
                    key={ticket.ticketId}
                    className={`my-tickets-card past-ticket ${!eventId ? 'disabled-card' : ''}`}
                    onClick={() => eventId && handleEventClick(ticket)}
                  >
                    {ticket.event.image && (
                      <>
                        <img src={ticket.event.image} alt={ticket.event.title} loading="lazy" />
                        <div className="my-tickets-price-overlay">
                          {ticket.event.ticketCost > 0 ? `$${ticket.event.ticketCost}` : "Free"}
                        </div>
                      </>
                    )}
                    <h2>{ticket.event.title}</h2>
                    <p>{ticket.event.description}</p>
                    <p><strong>Quantity:</strong> {ticket.quantity}</p>
                    <p><strong>Purchase Date:</strong> {new Date(ticket.purchaseDate).toLocaleString()}</p>
                  </div>
                );
              })}
          </div>
        ) : (
          <p>You have no past tickets.</p>
        )}
      </section>
    </div>
  );
};

export default MyTicketsPage;
