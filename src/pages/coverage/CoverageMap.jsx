import { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import warehouseData from '../../assets/warehouses.json';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function MapFly({ position }) {
  const map = useMap();
  useEffect(() => {
    if (position) map.flyTo(position, 10);
  }, [position, map]);
  return null;
}

export default function CoverageMap() {
  const [warehouses, setWarehouses] = useState([]);
  const [search, setSearch] = useState('');              // ← added state
  const [foundPos, setFoundPos] = useState(null);       // ← added state
  const markersRef = useRef({});                        // ← added ref

  useEffect(() => {
    setWarehouses(warehouseData);
  }, []);

  const handleSearch = e => {
    const val = e.target.value;
    setSearch(val);
    const match = warehouses.find(w =>
      w.district.toLowerCase().includes(val.toLowerCase())
    );
    if (match) {
      setFoundPos([match.latitude, match.longitude]);    // ← store fly-to coords
      markersRef.current[match.district]?.openPopup();   // ← open popup safely
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* 🌟 Search Box Styled */}
      <div className="form-control">
        <label className="label">
          <span className="label-text text-lg font-semibold">Search District</span>
        </label>
        <input
          type="text"
          placeholder="Type district name..."
          value={search}
          onChange={handleSearch}                        // ← added handler
          className="input input-bordered w-full max-w-md"
        />
      </div>

      {/* 🗺️ Map Container */}
      <div className="w-full h-[600px] rounded-lg overflow-hidden shadow-lg">
        <MapContainer center={[23.8103, 90.4125]} zoom={7} className="h-full w-full">
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {warehouses.map((w, i) => (
            <Marker
              key={i}
              position={[w.latitude, w.longitude]}
              ref={el => { if (el) markersRef.current[w.district] = el; }} // ← store refs
            >
              <Popup>
                <strong>{w.district}</strong>
                <ul className="list-disc list-inside text-sm">
                  {w.covered_area.map((a, j) => <li key={j}>{a}</li>)}
                </ul>
              </Popup>
            </Marker>
          ))}

          {foundPos && <MapFly position={foundPos} />}    // ← added component
        </MapContainer>
      </div>
    </div>
  );
}
