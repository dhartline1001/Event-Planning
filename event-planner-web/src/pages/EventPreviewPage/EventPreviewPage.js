// src/components/EventPreviewPage.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./EventPreviewPage.css";
import CheckoutModal from "../CheckoutModal/CheckoutModal"; // Import CheckoutModal

const EventPreviewPage = () => {
  const { eventId } = useParams(); // Extract event ID from URL

  const [event, setEvent] = useState(null);
  const [ticketCount, setTicketCount] = useState(0); // State to store user's ticket count for this event
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // Modal visibility state

  useEffect(() => {
    const fetchEventAndTickets = async () => {
      try {
        // Retrieve token from localStorage
        const token = localStorage.getItem("token");

        // Fetch event details
        const eventResponse = await axios.get(process.env.REACT_APP_BACKEND_URL + `/api/events/${eventId}`);
        setEvent(eventResponse.data.event);

        // If user is authenticated, fetch ticket count for this event
        if (token) {
          const ticketsResponse = await axios.get(process.env.REACT_APP_BACKEND_URL + `/api/tickets/${eventId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setTicketCount(ticketsResponse.data.quantity);
        } else {
          setTicketCount(0);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load event or ticket details.");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEventAndTickets();
    } else {
      setError("Invalid event ID.");
      setLoading(false);
    }
  }, [eventId]);

  const handleOpenModal = () => {
    setShowModal(true); // Show the checkout modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Hide the checkout modal
  };

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p>{error}</p>;
  if (!event) return <p>No event details available.</p>;

  // Determine button label based on ticket count and event cost
  const isUserAuthenticated = !!localStorage.getItem("token");
  const buttonLabel = isUserAuthenticated
    ? event.ticketCost > 0
      ? `Buy Another Ticket (${ticketCount} Owned)`
      : "Add Ticket"
    : event.ticketCost > 0
    ? `Pay $${event.ticketCost}`
    : "Add Ticket";

  return (
    <div className="event-preview-container">
      <h1>{event.title}</h1>
      {event.image && <img src={event.image} alt={event.title} className="event-preview-image" />}
      <p><strong>Description:</strong> {event.description}</p>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Cost:</strong> {event.ticketCost > 0 ? `$${event.ticketCost}` : "Free"}</p>
      
      {/* Display ticket ownership info if user has tickets */}
      {isUserAuthenticated && ticketCount > 0 && (
        <p>You already have {ticketCount} ticket{ticketCount > 1 ? 's' : ''} for this event.</p>
      )}

      <button className="pay-add-btn" onClick={handleOpenModal} disabled={!isUserAuthenticated && event.ticketCost > 0}>
        {buttonLabel}
      </button>

      {/* Optionally, inform unauthenticated users why the button might be disabled */}
      {!isUserAuthenticated && event.ticketCost > 0 && (
        <p>Please log in to purchase tickets.</p>
      )}

      {/* Render CheckoutModal */}
      {showModal && <CheckoutModal event={event} onClose={handleCloseModal} />}
    </div>
  );
};

export default EventPreviewPage;
