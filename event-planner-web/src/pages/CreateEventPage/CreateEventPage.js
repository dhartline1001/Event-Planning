import React, { useState, useContext } from "react";
import "./CreateEventPage.css";
import { EventContext } from "../../context/EventContext";

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
      const imageUrl = URL.createObjectURL(file);
      setFormData({ ...formData, image: imageUrl });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = { ...formData, id: Date.now() }; // Add unique ID
    addEvent(newEvent); // Add to global context
    alert("Event created successfully!");
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

