import React, { useState } from "react";
import "./ProfilePage.css";

function ProfilePage() {
  // Sample user profile state (replace this with actual API data later)
  const [profile, setProfile] = useState({
    name: "John Doe",
    profilePicture: "https://via.placeholder.com/150", // Replace with actual image URL
    bio: "Hello! I'm a passionate event organizer who loves connecting people.",
  });

  const handleEdit = () => {
    alert("Edit profile functionality coming soon!"); // Placeholder for edit functionality
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img
          src={profile.profilePicture}
          alt={`${profile.name}'s profile`}
          className="profile-picture"
        />
        <h1>{profile.name}</h1>
      </div>
      <div className="profile-bio">
        <h2>Bio</h2>
        <p>{profile.bio}</p>
      </div>
      <button className="edit-profile-btn" onClick={handleEdit}>
        Edit Profile
      </button>
    </div>
  );
}

export default ProfilePage;
