import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthProvider";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav style={{ padding: "10px 20px", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
      <Link to="/" style={{ fontWeight: "bold", marginRight: 20 }}>🏨 Hotel Booking</Link>
      {user ? (
        <>
          <span style={{ marginRight: 10 }}>Hi, {user.username}</span>
          <button onClick={() => { logout(); navigate("/login"); }}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/login" style={{ marginRight: 10 }}>Login</Link>
          <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
