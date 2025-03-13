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
          <p><strong>Author:</strong> Asaniczka</p>
            <p>The dataset includes the top 50 songs each day from 2023-10-18 to current date in 73 different 
              countries and globally. It has 25 attributes where 8 of them are categorical, 13 quantitative, 
              1 ordinal and then the name of the songs, artists and the spotify_id. For this website we are 
              using spotify_id, name of artists and songs, dates, countries and six attributes describing songs.
              The full country names were retrieved through an api with the use of the country codes.
            </p>
          <p><strong>References:</strong></p>
          <p className="max-w-lg text-sm">
            <strong>Radar Chart: </strong>
            <a>Chartjs.org. (2025). Linear Radial Axis | Chart.js. [online] Available at: </a>
            <a
              href="https://www.chartjs.org/docs/latest/charts/radar.html"
              className="text-blue-400 underline"
            >
              https://www.chartjs.org/docs/latest/charts/radar.html
            </a>
          </p>
          <p className="max-w-lg text-sm">
            <strong>Heatmap: </strong>
            <a>ApexCharts.js. (2019). Options (Reference) – ApexCharts.js. [online] Available at: </a>
            <a
              href="https://apexcharts.com/docs/chart-types/heatmap-chart/"
              className="text-blue-400 underline"
            >
              https://apexcharts.com/docs/chart-types/heatmap-chart/
            </a>
          </p>
          <p className="max-w-lg text-sm">
            <strong>Country fullnames API: </strong>
            <a>Florez, Fayder. “REST Countries.” Restcountries.com, 2025, restcountries.com/#rest-countries. Available at: </a>
            <a
              href="https://restcountries.com/#rest-countries"
              className="text-blue-400 underline"
            >
              https://restcountries.com/#rest-countries
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPopup;
