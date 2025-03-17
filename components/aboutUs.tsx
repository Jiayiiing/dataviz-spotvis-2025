import React, { useState } from "react";
import Image from "next/image";
import YouTube, { YouTubeProps } from "react-youtube";

interface AboutUsPopupProps {
  isOpen: boolean; // Prop to control visibility of the popup
  onClose: () => void; // Function to close the popup
}

function youtubeVideo() {
  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    // access to player in all event handlers via event.target
    event.target.pauseVideo();
  };

  const opts: YouTubeProps["opts"] = {
    height: "390",
    width: "640",
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 0,
    },
  };

  return <YouTube videoId="2HQDcxDnmF8" opts={opts} onReady={onPlayerReady} />;
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
            <Image
              src={"/spotivis.png"}
              alt="Spotivis logo"
              width={50}
              height={50}
            />
          </div>
          <p className="max-w-lg text-lg">
            Spotvis is a visualization tool that lets you explore the Spotify
            analytics of a country. It's designed to let you explore trends and
            identify which artists were popular when.
          </p>
          <p className="max-w-lg text-lg">
            This was a project made for the course DH2321 Information
            Visualization at KTH Royal Institute of Technology in early 2025.
          </p>
          {youtubeVideo()}
          <h1 className="max-w-lg text-2xl">
            <strong>Team</strong>
          </h1>
          <p className="max-w-lg text-sm">
            <strong>Mille Kåge - millek@kth.se</strong>
            <br></br>Developer, design and user testing<br></br>
            <br></br>
            <strong>Helge Kvarfordt - helgekv@kth.se</strong>
            <br></br>Developer and user testing<br></br>
            <br></br>
            <strong>Eric Wernström - ericwer@kth.se</strong>
            <br></br>Developer and user testing<br></br>
            <br></br>
            <strong>Ludwig Flod - lflod@kth.se</strong>
            <br></br>Developer and data handling<br></br>
            <br></br>
            <strong>Jiayi Guo - jiayig@kth.se</strong>
            <br></br>Developer and data handling
          </p>
          <h1 className="max-w-lg text-2xl">
            <strong>Dataset</strong>
          </h1>
          <p>
            The dataset includes the top 50 songs each day from 2023-10-18 to
            current date in 73 different countries and globally. It has 25
            attributes where 8 of them are categorical, 13 quantitative, 1
            ordinal and then the name of the songs, artists and the spotify_id.
            For this website we are using spotify_id, name of artists and songs,
            dates, countries and six attributes describing songs. The full
            country names were retrieved through an api with the use of the
            country codes.
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
          <p>
            <strong>Made by:</strong> Asaniczka
          </p>

          <h1 className="max-w-lg text-2xl">
            <strong>References</strong>
          </h1>
          <p className="max-w-lg text-sm">
            <strong>Wordcloud: </strong>
            <a>Davies, J. (n.d.) D3-Cloud. Github. Available at: </a>
            <a
              href="https://github.com/jasondavies/d3-cloud"
              className="text-blue-400 underline"
            >
              https://github.com/jasondavies/d3-cloud
            </a>
          </p>

          <p className="max-w-lg text-sm">
            <strong>Radar Chart: </strong>
            <a>
              www.chartjs.org. (2025). Radar Chart | Chart.js. Available
              at:{" "}
            </a>
            <a
              href="https://www.chartjs.org/docs/latest/charts/radar.html"
              className="text-blue-400 underline"
            >
              https://www.chartjs.org/docs/latest/charts/radar.html
            </a>
          </p>
          <p className="max-w-lg text-sm">
            <strong>Heatmap: </strong>
            <a>
              ApexCharts.js. (2022). Heat Map Chart Chart Guide & Documentation
              – ApexCharts.js. Available at:{" "}
            </a>
            <a
              href="https://apexcharts.com/docs/chart-types/heatmap-chart/"
              className="text-blue-400 underline"
            >
              https://apexcharts.com/docs/chart-types/heatmap-chart/
            </a>
          </p>
          <p className="max-w-lg text-sm">
            <strong>Country fullnames API: </strong>
            <a>
              Florez, Fayder. (2025). “REST Countries” Restcountries.com.
              Available at:{" "}
            </a>
            <a
              href="https://restcountries.com/#rest-countries"
              className="text-blue-400 underline"
            >
              https://restcountries.com/#rest-countries
            </a>
          </p>
          <p className="max-w-lg text-sm">
            <strong>Flag Emojis: </strong>
            <a>
              eteeselink. (2024). country-flag-emoji-polyfill. NPM. Available
              at:{" "}
            </a>
            <a
              href="https://www.npmjs.com/package/country-flag-emoji-polyfill"
              className="text-blue-400 underline"
            >
              https://www.npmjs.com/package/country-flag-emoji-polyfill
            </a>
          </p>
          <br></br>
          <br></br>
          <br></br>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPopup;
