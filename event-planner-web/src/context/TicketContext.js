import React, { createContext, useState } from "react";

export const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [tickets, setTickets] = useState([]);

  const addTicket = (ticket) => {
    setTickets((prevTickets) => [...prevTickets, ticket]);
  };

  const removeTicket = (id) => {
    setTickets((prevTickets) => prevTickets.filter((ticket) => ticket.id !== id));
  };

  return (
    <TicketContext.Provider value={{ tickets, addTicket, removeTicket }}>
      {children}
    </TicketContext.Provider>
  );
};