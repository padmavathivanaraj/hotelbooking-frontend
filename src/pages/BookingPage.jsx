import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../services/api";

export default function BookingPage() {
  const { id } = useParams(); // roomId
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [msg, setMsg] = useState("");
  const [bookingInfo, setBookingInfo] = useState(null);

  // 🔥 NEW: payment message
  const [paymentMsg, setPaymentMsg] = useState("");

  const handleBook = async (e) => {
    e.preventDefault();
    setMsg("");
    setBookingInfo(null);
    setPaymentMsg("");

    const userJson = localStorage.getItem("user");
    if (!userJson) {
      setMsg("Please login again.");
      return;
    }
    const user = JSON.parse(userJson);

    try {
      const res = await api.post("/api/bookings", {
        userId: user.id,
        roomId: Number(id),
        checkIn,
        checkOut,
      });

      setBookingInfo(res.data);
      setMsg("Booking successful!");
    } catch (err) {
      console.error("BOOKING ERROR:", err);

      if (err.response) {
        const status = err.response.status;
        const data = err.response.data;

        if (status === 409) {
          setMsg("Room not available for selected dates.");
        } else {
          const backendMsg =
            (typeof data === "string" ? data : data.message) || "";
          setMsg(`Booking failed (${status}). ${backendMsg}`);
        }
      } else {
        setMsg("Booking failed. Network/server error.");
      }
    }
  };

  const handlePayment = async () => {
    if (!bookingInfo) return;

    try {
      setPaymentMsg("Processing payment…");

      // backend-la order create
      const res = await api.post("/api/pay/create-order", {
        bookingId: bookingInfo.id,
        amount: bookingInfo.amount,
      });

      const data = res.data;
      console.log("PAYMENT: backend order response:", data);

      if (!window.Razorpay) {
        setPaymentMsg("Payment failed: Razorpay script not loaded.");
        return;
      }

      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency,
        name: "Hotel Booking",
        description: `Booking #${bookingInfo.id}`,
        order_id: data.orderId,
        handler: function (response) {
          console.log("RAZORPAY SUCCESS:", response);
          setPaymentMsg(
            "Payment successful! Payment Id: " + response.razorpay_payment_id
          );
        },
        prefill: {
          name: "Test User",
          email: "test@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);

      // 🔥 payment fail aana message
      rzp.on("payment.failed", function (response) {
        console.log("RAZORPAY FAILED:", response);
        setPaymentMsg(
          "Payment failed: " + (response.error?.description || "Unknown error")
        );
      });

      rzp.open();
    } catch (err) {
      console.error("PAYMENT ERROR:", err);
      setPaymentMsg("Payment failed. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: 450, margin: "40px auto" }}>
      <h2>Book Room #{id}</h2>

      <form onSubmit={handleBook} style={{ marginTop: 20 }}>
        <div style={{ marginBottom: 10 }}>
          <label>Check-in</label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            style={{ width: "100%", padding: 6 }}
            required
          />
        </div>

        <div style={{ marginBottom: 10 }}>
          <label>Check-out</label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            style={{ width: "100%", padding: 6 }}
            required
          />
        </div>

        {msg && (
          <p
            style={{
              color: msg.includes("successful") ? "green" : "red",
              marginBottom: 10,
            }}
          >
            {msg}
          </p>
        )}

        {bookingInfo && (
          <div
            style={{
              border: "1px solid #ccc",
              padding: 10,
              marginBottom: 10,
              fontSize: 14,
            }}
          >
            <p>Booking ID: {bookingInfo.id}</p>
            <p>
              Dates: {bookingInfo.checkIn} → {bookingInfo.checkOut}
            </p>
            <p>Amount: ₹{bookingInfo.amount}</p>
            <p>Status: {bookingInfo.status}</p>
          </div>
        )}

        <button type="submit" style={{ padding: "8px 16px", marginRight: 10 }}>
          Confirm Booking
        </button>

        {bookingInfo && (
          <button
            type="button"
            onClick={handlePayment}
            style={{
              padding: "8px 16px",
              marginTop: 10,
              background: "orange",
              border: "none",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            Pay with Razorpay
          </button>
        )}
      </form>

      {/* 🔥 Payment success / failure message */}
      {paymentMsg && (
        <p
          style={{
            marginTop: 12,
            fontWeight: "bold",
            color: paymentMsg.includes("successful") ? "green" : "red",
          }}
        >
          {paymentMsg}
        </p>
      )}

      <div style={{ marginTop: 20 }}>
        <Link to="/hotels">Back to hotels</Link>
      </div>
    </div>
  );
}
