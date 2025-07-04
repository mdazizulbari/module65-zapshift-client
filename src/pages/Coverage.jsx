import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Coverage = () => {
  // Initial coordinates for Dhaka (example location)
  const position = [23.8103, 90.4125];

  // Custom icon (optional, using Leaflet's default for now)
  const customIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="container mx-auto px-4 py-8 bg-base-100">
      <h1 className="text-4xl font-bold text-center text-base-content mb-8">
        We are available in 64 districts
      </h1>
      <div className="w-full h-[400px] rounded-lg overflow-hidden shadow-lg">
        <MapContainer
          center={position}
          zoom={7}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position} icon={customIcon}>
            <Popup>Dhaka - Our Coverage Starts Here!</Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
};

export default Coverage;
