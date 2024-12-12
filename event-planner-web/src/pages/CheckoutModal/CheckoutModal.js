// src/components/CheckoutModal/CheckoutModal.js

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Ensure axios is installed: npm install axios
import "./CheckoutModal.css";

const CheckoutModal = ({ event, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [quantity, setQuantity] = useState(1); // State for ticket quantity
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(""); // For error messages
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  });

  const navigate = useNavigate(); // For redirection

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails({ ...paymentDetails, [name]: value });
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    // Ensure quantity is at least 1 and does not exceed event capacity if set
    if (value >= 1) {
      if (event.capacity && value > event.capacity) {
        setQuantity(event.capacity);
      } else {
        setQuantity(value);
      }
    }
  };

  const handleNextStep = () => {
    // If on Step 1, validate quantity
    if (currentStep === 1) {
      if (quantity < 1) {
        setError("Quantity must be at least 1.");
        return;
      }
      if (event.capacity && quantity > event.capacity) {
        setError(`Only ${event.capacity} tickets are available.`);
        return;
      }
      setError("");
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleCheckout = async () => {
    setLoading(true); // Start loading animation
    setError(""); // Reset any previous errors

    try {
      // Retrieve token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to purchase tickets.");
        setLoading(false);
        return;
      }

      // Optional: Integrate with a real payment gateway API here.

      // Create the ticket by calling the backend API
      const response = await axios.post(
        process.env.REACT_APP_BACKEND_URL + "/api/tickets",
        { eventId: event._id, quantity }, // Send selected quantity
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        setSuccess(true); // Show success state
        setLoading(false);
        // Redirect to My Tickets after a short delay to show the success message
        setTimeout(() => {
          navigate("/my-tickets");
        }, 2000);
      } else {
        // Handle unexpected successful responses
        setError("Unexpected response from the server.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error creating ticket:", err.response?.data?.message || err.message);
      setError(err.response?.data?.message || "Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Step 1: Event Details & Quantity Selection */}
        {currentStep === 1 && !loading && !success && (
          <div className="checkout-step">
            <h2>Step 1: Event Details</h2>
            <p><strong>Event:</strong> {event.title}</p>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleString()}</p>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Cost:</strong> {event.ticketCost > 0 ? `$${event.ticketCost}` : "Free"}</p>
            
            {/* Quantity Selection */}
            <label>
              <strong>Quantity:</strong>
              <input
                type="number"
                min="1"
                max={event.capacity || ""}
                value={quantity}
                onChange={handleQuantityChange}
                required
              />
              {event.capacity && (
                <span className="capacity-info"> (Max {event.capacity})</span>
              )}
            </label>
            {error && <p className="error-message">{error}</p>}
            <div className="modal-buttons">
              <button onClick={onClose} className="close-btn">Cancel</button>
              <button onClick={handleNextStep} className="next-btn">Next</button>
            </div>
          </div>
        )}

        {/* Step 2: Payment Information */}
        {currentStep === 2 && !loading && !success && (
          <div className="checkout-step">
            <h2>Step 2: Payment Information</h2>
            <label>
              Card Number:
              <input
                type="text"
                name="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={paymentDetails.cardNumber}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Name on Card:
              <input
                type="text"
                name="cardName"
                placeholder="John Doe"
                value={paymentDetails.cardName}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Expiry Date:
              <input
                type="text"
                name="expiryDate"
                placeholder="MM/YY"
                value={paymentDetails.expiryDate}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              CVV:
              <input
                type="text"
                name="cvv"
                placeholder="123"
                value={paymentDetails.cvv}
                onChange={handleInputChange}
                required
              />
            </label>
            <div className="modal-buttons">
              <button onClick={handlePreviousStep} className="back-btn">Back</button>
              <button onClick={handleNextStep} className="next-btn">Next</button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm Payment */}
        {currentStep === 3 && !loading && !success && (
          <div className="checkout-step">
            <h2>Step 3: Confirm Payment</h2>
            <p><strong>Event:</strong> {event.title}</p>
            <p><strong>Total Cost:</strong> {event.ticketCost > 0 ? `$${event.ticketCost * quantity}` : "Free"}</p>
            <p><strong>Quantity:</strong> {quantity}</p>
            <p>Card Ending In: {paymentDetails.cardNumber.slice(-4)}</p>
            {error && <p className="error-message">{error}</p>}
            <div className="modal-buttons">
              <button onClick={handlePreviousStep} className="back-btn">Back</button>
              <button onClick={handleCheckout} className="checkout-btn">Confirm & Pay</button>
            </div>
          </div>
        )}

        {/* Loading Animation */}
        {loading && (
          <div className="loading-step">
            <div className="spinner"></div>
            <p>Processing payment...</p>
          </div>
        )}

        {/* Success Checkmark */}
        {success && (
          <div className="success-step">
            <div className="checkmark"></div>
            <p>Payment Successful! Redirecting to My Tickets...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckoutModal;
