import React, { useState } from 'react';

interface AboutUsPopupProps {
    isOpen: boolean;   // Prop to control visibility of the popup
    onClose: () => void; // Function to close the popup
  }
  
  const AboutUsPopup: React.FC<AboutUsPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2 className="text-center">Information and About Us</h2>
          <button className="close-btn" onClick={onClose}>X</button>
        </div>
        <div className="popup-content">
          <p>Welcome to our website!</p>
          <p></p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPopup;
