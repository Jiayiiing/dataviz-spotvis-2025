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
          <h2 className="font-bold">Information and About Us</h2>
          <button className="close-btn" onClick={onClose}>x</button>
        </div>
        <div className="popup-content">
          <p>We are Spotivis!</p>
          <p>Dataset: https://www.kaggle.com/datasets/asaniczka/top-spotify-songs-in-73-countries-daily-updated?resource=download</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPopup;
