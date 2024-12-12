import React, { useState, useContext } from "react";
import "./CreateEventPage.css";
import { EventContext } from "../../context/EventContext";
import axios from "axios";

const CreateEventPage = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    capacity: "",
    ticketCost: "",
    image: null,
  });

  const { addEvent } = useContext(EventContext);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result }); // Store Base64 string
      };
      reader.readAsDataURL(file);
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      // Retrieve token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to create an event");
        return;
      }
  
      const formDataToSend = {
        title: formData.title,
        description: formData.description,
        date: formData.date,
        location: formData.location,
        capacity: formData.capacity || 0,
        ticketCost: formData.ticketCost || 0,
        image: formData.image,
      };
  
      const response = await axios.post(process.env.REACT_APP_BACKEND_URL + "/api/events", formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      alert(response.data.message);
      console.log("Event Created:", response.data.event);
  
      setFormData({
        title: "",
        description: "",
        date: "",
        location: "",
        capacity: "",
        ticketCost: "",
        image: null,
      });
    } catch (error) {
      console.error("Error creating event:", error.response?.data?.message || "Server error");
      alert("Error creating event. Please try again.");
    }
  };
  

  return (
    <div className="create-event-container">
      <h1>Create an Event</h1>
      <form onSubmit={handleSubmit} className="create-event-form">
        <label>
          Event Title:
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Description:
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          ></textarea>
        </label>
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Location:
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Ticket Cost ($):
          <input
            type="number"
            name="ticketCost"
            value={formData.ticketCost}
            onChange={handleInputChange}
            min="0"
            step="0.01"
            required
          />
        </label>
        <label>
          Event Image:
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </label>
        {formData.image && (
          <div className="image-preview">
            <p>Image Preview:</p>
            <img src={formData.image} alt="Event" />
          </div>
        )}
        <button type="submit" className="submit-btn">
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEventPage;

