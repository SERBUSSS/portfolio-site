// reactBootstrap.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import ProfileCard from "./blocks/Components/ProfileCard/ProfileCard.jsx"; // update path if needed

const cardProps = {
  avatarUrl: "/images/profilepicnobg2kx2k.png",                 // Main profile image
  iconUrl: "/path/to/icon.svg",                     // Optional: mask/icon for shine effect
  grainUrl: "/images/noise3x2.jpeg",                   // Optional: texture overlay
  behindGradient: "linear-gradient(215deg, #7D7D7D 0%, #EBEBEB 49%, #323232 100%)",                        // Custom background gradient (string CSS)
  innerGradient: "radial-gradient(ellipse 50.00% 64.29% at 50.00% 50.00%, #919191 0%, #737373 48%, #505050 100%)",                         // Custom inner gradient (string CSS)
  showBehindGradient: true,                         // Show or hide the animated behind gradient
  className: "",                                    // Additional CSS classes
  enableTilt: true,                                 // Enable 3D tilt effect
  miniAvatarUrl: "/path/to/mini-avatar.jpg",        // Mini avatar in user info box
  name: "Buștiuc Sergiu",                              // Name headline
  title: "Web & Graphic Designer",                  // Subheadline
  handle: "bustiuc.s",                             // @handle without @
  status: "Available for projects",                 // Status message
  contactText: "Let's Talk",                        // Contact button text
  showUserInfo: true,                               // Show/hide user info at the bottom
  onContactClick: () => alert("Contact clicked!"),  // Handler for contact button
};

// Mount ProfileCard in the designated root
const rootEl = document.getElementById("react-profile-card-root");

if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(<ProfileCard {...cardProps} />);
}