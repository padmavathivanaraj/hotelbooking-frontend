// src/pages/HotelDetail.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadHotel = async () => {
    setError("");
    try {
      const res = await api.get(`/api/hotels/${id}`);
      setHotel(res.data);
    } catch (err) {
      console.error("HOTEL DETAIL ERROR:", err);
      setError("Failed to load hotel.");
    }
  };

  useEffect(() => {
    loadHotel();
  }, [id]);

  if (error) {
    return (
      <div style={{ maxWidth: 800, margin: "20px auto" }}>
        <p style={{ color: "red" }}>{error}</p>
        <Link to="/hotels">Back to list</Link>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div style={{ maxWidth: 800, margin: "20px auto" }}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "20px auto" }}>
      <h2>{hotel.name}</h2>
      <p><b>City:</b> {hotel.city}</p>
      <p><b>Address:</b> {hotel.address}</p>
      <p><b>Description:</b> {hotel.description}</p>
      {hotel.rating != null && <p><b>Rating:</b> ⭐ {hotel.rating}</p>}

      <button
        onClick={() => navigate(`/book/${hotel.id}`)}
        style={{ marginRight: 10 }}
      >
        Book Now
      </button>

      <Link to="/hotels">Back to list</Link>
    </div>
  );
}
