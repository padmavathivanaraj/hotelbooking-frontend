import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

export default function AddHotel() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    description: "",
    rating: "",
    price: "",
  });

  const [error, setError] = useState("");

  const onChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const payload = {
        name: form.name,
        city: form.city,
        address: form.address,
        description: form.description,
        rating: form.rating === "" ? null : Number(form.rating),
        price: Number(form.price),
      };

      const res = await api.post("/api/hotels", payload);
      console.log("Hotel created:", res.data);

      navigate("/hotels");
    } catch (err) {
      console.error("ADD HOTEL ERROR:", err);

      if (err.response) {
        // show status to help debug if anything breaks later
        const msg =
          err.response.data?.message ||
          err.response.data?.error ||
          "Server error";
        setError(
          `Failed to add hotel (${err.response.status}): ${msg}`
        );
      } else {
        setError("Failed to add hotel. Check if backend (8080) is running.");
      }
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "50px auto" }}>
      <h2>Add Hotel</h2>

      <form onSubmit={handleSubmit} style={{ marginTop: 20 }}>
        <input
          name="name"
          placeholder="Hotel Name"
          value={form.name}
          onChange={onChange}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={onChange}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={onChange}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={onChange}
          style={{
            width: "100%",
            padding: 8,
            marginBottom: 10,
            minHeight: 70,
          }}
        />

        <input
          name="rating"
          placeholder="Rating (0–5)"
          type="number"
          step="0.1"
          value={form.rating}
          onChange={onChange}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        <input
          name="price"
          placeholder="Price per night (₹)"
          type="number"
          value={form.price}
          onChange={onChange}
          style={{ width: "100%", padding: 8, marginBottom: 10 }}
        />

        {error && (
          <p style={{ color: "red", marginBottom: 10 }}>{error}</p>
        )}

        <button type="submit" style={{ padding: "8px 16px" }}>
          Save
        </button>
      </form>

      <div style={{ marginTop: 20 }}>
        <Link to="/hotels">Back to hotels</Link>
      </div>
    </div>
  );
}
