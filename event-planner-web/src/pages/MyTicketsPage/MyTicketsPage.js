import React, { useContext } from "react";
import { TicketContext } from "../../context/TicketContext";
import "./MyTicketsPage.css";

const MyTicketsPage = () => {
  const { tickets, removeTicket } = useContext(TicketContext);

  return (
    <div className="my-tickets-container">
      <h1>My Tickets</h1>
      {tickets.length > 0 ? (
        <div className="ticket-list">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="ticket-card">
              <h2>{ticket.title}</h2>
              <p><strong>Date:</strong> {ticket.date}</p>
              <p><strong>Location:</strong> {ticket.location}</p>
              <p><strong>Cost:</strong> {ticket.ticketCost > 0 ? `$${ticket.ticketCost}` : "Free"}</p>
              <button
                className="delete-btn"
                onClick={() => removeTicket(ticket.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>You have no tickets saved.</p>
      )}
    </div>
  );
};

export default MyTicketsPage;
