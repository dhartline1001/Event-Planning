import React, { useContext } from "react";
import { TicketContext } from "../../context/TicketContext";
import "./CheckoutModal.css";

const CheckoutModal = ({ event, onClose }) => {
  const { addTicket } = useContext(TicketContext);

  const handleCheckout = () => {
    addTicket(event);
    alert(
      event.ticketCost > 0
        ? `You have paid $${event.ticketCost} for ${event.title}.`
        : `You have successfully added your ticket for ${event.title}.`
    );
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Checkout</h2>
        <p><strong>Event:</strong> {event.title}</p>
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p><strong>Cost:</strong> {event.ticketCost > 0 ? `$${event.ticketCost}` : "Free"}</p>
        <button onClick={handleCheckout} className="checkout-btn">
          {event.ticketCost > 0 ? `Pay $${event.ticketCost}` : "Add Ticket"}
        </button>
        <button onClick={onClose} className="close-btn">Cancel</button>
      </div>
    </div>
  );
};

export default CheckoutModal;
