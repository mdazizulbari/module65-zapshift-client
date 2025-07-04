import React from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import warehouses from "../assets/warehouses.json"; // Import warehouses data

const Coverage = () => {
  // Filter active warehouses
  const activeWarehouses = warehouses.filter(
    (warehouse) => warehouse.status === "active"
  );

  // Custom hook to auto-fit map bounds to all markers
  const SetMapBounds = () => {
    const map = useMap();
    const bounds = L.latLngBounds(
      activeWarehouses.map((warehouse) => [
        warehouse.latitude,
        warehouse.longitude,
      ])
    );
    map.fitBounds(bounds, { padding: [50, 50] }); // Add padding for better view
    return null;
  };

  // Custom icon
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
        <MapContainer style={{ height: "100%", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {activeWarehouses.map((warehouse, index) => (
            <Marker
              key={index}
              position={[warehouse.latitude, warehouse.longitude]}
              icon={customIcon}
            >
              <Popup>
                {warehouse.city} - {warehouse.district} <br /> Covered Areas:{" "}
                {warehouse.covered_area.join(", ")}
              </Popup>
            </Marker>
          ))}
          <SetMapBounds /> // Add custom hook to fit bounds
        </MapContainer>
      </div>
    </div>
  );
};

export default Coverage;
