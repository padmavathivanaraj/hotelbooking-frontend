// src/pages/HotelsList.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function HotelsList() {
  const [hotels, setHotels] = useState([]);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  const fetchHotels = async () => {
    try {
      const res = await api.get("/api/hotels");
      setHotels(res.data);
      setError("");
    } catch (err) {
      console.error("Error loading hotels:", err);
      setError("Failed to load hotels");
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const filteredHotels = hotels.filter((h) =>
    (h.name + " " + h.city).toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 700, margin: "40px auto" }}>
      <h2>Hotels</h2>

      {/* Search box */}
      <input
        type="text"
        placeholder="Search by hotel or city..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{
          width: "100%",
          padding: 8,
          marginBottom: 10,
          border: "1px solid #ccc",
          borderRadius: 4,
        }}
      />

      <button onClick={fetchHotels} style={{ marginBottom: 10 }}>
        Refresh
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {filteredHotels.map((h) => (
          <li key={h.id} style={{ marginBottom: 8 }}>
            <Link to={`/hotel/${h.id}`}>
              {h.name} – {h.city}
            </Link>
            {h.rating != null && (
              <span style={{ marginLeft: 6 }}>⭐ {h.rating}</span>
            )}

            {/* Book room */}
            <Link
              to={`/book/${h.id}`}
              style={{
                marginLeft: 12,
                padding: "3px 8px",
                background: "#4caf50",
                color: "#fff",
                textDecoration: "none",
                borderRadius: 4,
                fontSize: 12,
              }}
            >
              Book
            </Link>
          </li>
        ))}
      </ul>

      <div style={{ marginTop: 15 }}>
        <Link to="/add-hotel">+ Add New Hotel</Link>
      </div>

      <div style={{ marginTop: 10 }}>
        <Link
          to="/admin"
          style={{
            padding: "4px 10px",
            background: "#ff9800",
            color: "#fff",
            borderRadius: 4,
            textDecoration: "none",
            fontSize: 13,
          }}
        >
          Admin Dashboard
        </Link>
      </div>
    </div>
  );
}
