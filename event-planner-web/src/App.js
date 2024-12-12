import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./NavigationBar/NavBar";
import HomePage from "./pages/HomePage/HomePage";
import SignupPage from "./pages/SignupPage/SignupPage";
import MyTicketsPage from "./pages/MyTicketsPage/MyTicketsPage";
import CreateEventPage from "./pages/CreateEventPage/CreateEventPage";
import EventPreviewPage from "./pages/EventPreviewPage/EventPreviewPage";
import ProfilePage from "./pages/ProfilePage/ProfilePage";
import { TicketProvider } from "./context/TicketContext";
import { EventProvider } from "./context/EventContext";
import AuthPage from "./pages/AuthPage/AuthPage";

function App() {
  return (
    <TicketProvider>
      <EventProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/my-tickets" element={<MyTicketsPage />} />
            <Route path="/create-event" element={<CreateEventPage />} />
            <Route path="/event-preview/:eventId" element={<EventPreviewPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </Router>
      </EventProvider>
    </TicketProvider>
  );
}

export default App;

