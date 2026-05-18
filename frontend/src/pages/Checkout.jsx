import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext.jsx";
import { orderApi } from "../services/api.js";

const GST_RATE = 0.18;

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, refreshCart } = useCart();
  const items = cart.items || [];
  const subtotal = items.reduce((sum, item) => sum + Number(item.product.price || 0) * item.quantity, 0);
  const gst = subtotal * GST_RATE;
  const grandTotal = subtotal + gst;
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    street: "",
    village: "",
    district: "",
    state: "",
    pincode: "",
    landmark: ""
  });
  const [error, setError] = useState("");

  function updateAddress(field, value) {
    setAddress((current) => ({ ...current, [field]: value }));
  }

  function buildAddress() {
    return [
      address.fullName,
      address.phone,
      address.street,
      address.village,
      address.district,
      address.state,
      address.pincode,
      address.landmark ? `Landmark: ${address.landmark}` : ""
    ].filter(Boolean).join(", ");
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await orderApi.checkout({ shippingAddress: buildAddress() });
      await refreshCart();
      alert("Order placed successfully");
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
        <div className="address-grid">
          <label>
            Full name
            <input required value={address.fullName} onChange={(e) => updateAddress("fullName", e.target.value)} />
          </label>
          <label>
            Phone number
            <input required value={address.phone} onChange={(e) => updateAddress("phone", e.target.value)} />
          </label>
          <label className="wide-field">
            Street / house number
            <input required value={address.street} onChange={(e) => updateAddress("street", e.target.value)} />
          </label>
          <label>
            Village / locality
            <input required value={address.village} onChange={(e) => updateAddress("village", e.target.value)} />
          </label>
          <label>
            District
            <input required value={address.district} onChange={(e) => updateAddress("district", e.target.value)} />
          </label>
          <label>
            State
            <input required value={address.state} onChange={(e) => updateAddress("state", e.target.value)} />
          </label>
          <label>
            Pincode
            <input required value={address.pincode} onChange={(e) => updateAddress("pincode", e.target.value)} />
          </label>
          <label className="wide-field">
            Landmark
            <input value={address.landmark} onChange={(e) => updateAddress("landmark", e.target.value)} />
          </label>
        </div>
        <button className="gold-button">Place your order</button>
      </form>
      <aside className="summary-box">
        <h2>Bill Summary</h2>
        {items.length === 0 ? (
          <div className="notice">Your cart is empty.</div>
        ) : (
          <div className="bill-list">
            {items.map((item) => {
              const price = Number(item.product.price || 0);
              const itemTotal = price * item.quantity;
              return (
                <div className="bill-item" key={item.id}>
                  <div>
                    <strong>{item.product.name}</strong>
                    <span>₹{price.toLocaleString("en-IN")} x {item.quantity}</span>
                  </div>
                  <b>₹{itemTotal.toLocaleString("en-IN")}</b>
                </div>
              );
            })}
            <div className="bill-line">
              <span>Subtotal</span>
              <strong>₹{subtotal.toLocaleString("en-IN")}</strong>
            </div>
            <div className="bill-line">
              <span>GST 18%</span>
              <strong>₹{gst.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong>
            </div>
            <div className="bill-line">
              <span>Delivery</span>
              <strong>Free</strong>
            </div>
            <div className="bill-total">
              <span>Grand Total</span>
              <strong>₹{grandTotal.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</strong>
            </div>
          </div>
        )}
      </aside>
    </section>
  );
}
