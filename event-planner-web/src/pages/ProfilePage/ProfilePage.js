import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProfilePage.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch user data from backend
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You must be logged in to view your profile.");
          setLoading(false);
          return;
        }

        const response = await axios.get(process.env.REACT_APP_BACKEND_URL + "/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProfile(response.data.user);
        console.log("Fetched Profile:", response.data.user); // For debugging
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("Failed to load profile data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="profile-container">
        <h1>Loading Profile...</h1>
      </div>
    );
  }

  return (
    <div className="profile-page">  {/* Container for entire page */}
      {error && <p className="profile-error-message">{error}</p>}

      {profile && (
        <>
          <div className="profile-content"> {/* Centered content container */}
            <div className="profile-info">
              <img src={profile.picture || "https://via.placeholder.com/150"} alt={`${profile.name}'s profile`} className="profile-picture" />
              <h2>{profile.name}</h2>
              <p>{profile.bio}</p>
            </div>

            <button className="view-tickets-btn" onClick={() => navigate("/my-tickets")}>
              View Your Tickets
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfilePage;