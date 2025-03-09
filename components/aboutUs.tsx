import React, { useState } from "react";
import Image from "next/image";

interface AboutUsPopupProps {
  isOpen: boolean; // Prop to control visibility of the popup
  onClose: () => void; // Function to close the popup
}

const AboutUsPopup: React.FC<AboutUsPopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container">
        <div className="popup-header">
          <h2 className="font-bold">Information and About Us</h2>
          <button className="close-btn" onClick={onClose}>
            x
          </button>
        </div>
        <div className="popup-content flex flex-col items-center text-center space-y-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-3xl font-bold">Spotivis</h1>
          <Image src={"/spotivis.png"} alt="Spotivis logo" width={50} height={50} />
        </div>
          <p className="max-w-lg text-lg">
            Spotvis is a visualization tool that lets you explore the Spotify
            analytics of a country. It's designed to let you explore trends and
            identify which artists were popular when.
          </p>
          <p className="max-w-lg text-lg">
            This was a project made for the course DH2321 Information Visualization at KTH Royal Institute of Technology.
          </p>
          <p className="max-w-lg text-sm">
            <strong>Developers:</strong> <br></br>Mille Kåge - millek@kth.se<br></br>Helge
            Kvarfordt - helgekv@kth.se<br></br>Eric Wernström - ericwer@kth.se<br></br>Ludwig
            Flod - lflod@kth.se<br></br>Jiayi Guo - jiayig@kth.se
          </p>
          <p className="max-w-lg text-sm">
            <strong>Dataset used: </strong>
            <a
              href="https://www.kaggle.com/datasets/asaniczka/top-spotify-songs-in-73-countries-daily-updated"
              className="text-blue-400 underline"
            >
              Kaggle - Top Spotify Songs in 73 Countries
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPopup;
