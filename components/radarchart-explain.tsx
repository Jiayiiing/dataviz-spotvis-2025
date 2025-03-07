import React, { useState } from 'react';

interface RadarchartexplainPopupProps {
    isOpen: boolean;   // Prop to control visibility of the popup
    onClose: () => void; // Function to close the popup
  }
  
  const RadarchartexplainPopup: React.FC<RadarchartexplainPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;


  
  return (
    <div className="popup-overlay flex justify-center items-center fixed inset-0 bg-black bg-opacity-50 z-50">
      <div className="popup-container bg-black opacity-95 p-6 rounded-lg shadow-lg w-[400px] max-w-lg mx-auto">
        <div className="popup-header flex justify-between items-center mb-4">
          <h2 className="font-bold text-white">Information about the radar chart</h2>
          <button className="close-btn text-white font-bold text-lg" onClick={onClose}>x</button>
        </div>
        <div className="popup-content text-white">
          <p>Click songs in song list to dislay their properties.</p>
          <p>Energy - A measure of the intensity and activity level of the song.</p>
          <p>Danceability - A measure of how suitable the song is for dancing based on various musical elements.</p>
          <p>Valence - A measure of the musical positiveness conveyed by the song.</p>
          <p>Acousticness - A measure of the acoustic quality of the song.</p>
          <p>Popularity - A measure of the song's current popularity on Spotify.</p>
          <p>Liveness - A measure of the presence of a live audience in the recording.</p>
        </div>
      </div>
    </div>
  );
};

export default RadarchartexplainPopup;
