import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './NavigationBar/NavBar';
import HomePage from './pages/HomePage/HomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import SignupPage from './pages/SignupPage/SignupPage';
import MyTicketsPage from './pages/MyTicketsPage/MyTicketsPage';
import CreateEventPage from './pages/CreateEventPage/CreateEventPage';
import EventPreviewPage from './pages/EventPreviewPage/EventPreviewPage';
import CheckoutModal from './pages/CheckoutModal/CheckoutModal';
import ProfilePage from './pages/ProfilePage/ProfilePage';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/my-tickets" element={<MyTicketsPage />} />
        <Route path="/create-event" element={<CreateEventPage />} />
        <Route path="/event-preview" element={<EventPreviewPage />} />
        <Route path="/checkout" element={<CheckoutModal />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
}

export default App;
