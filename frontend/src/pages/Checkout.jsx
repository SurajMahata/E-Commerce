import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { orderApi } from "../services/api.js";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();
  const [shippingAddress, setShippingAddress] = useState("");
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await orderApi.checkout({ shippingAddress });
      await refreshCart();
      navigate("/orders");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="checkout-page">
      <form className="checkout-form" onSubmit={submit}>
        <h1>Checkout</h1>
        {error && <div className="error">{error}</div>}
        <label>
          Delivery address
          <textarea required value={shippingAddress} onChange={(e) => setShippingAddress(e.target.value)} />
        </label>
        <button className="gold-button">Place your order</button>
      </form>
      <aside className="summary-box">
        <h2>Order summary</h2>
        <p>Items: {cart.count || 0}</p>
        <div className="details-price">₹{Number(cart.total || 0).toLocaleString("en-IN")}</div>
      </aside>
    </section>
  );
}
