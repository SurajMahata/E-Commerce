import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { orderApi } from "../services/api.js";

const activeStatuses = ["PLACED", "PACKED", "SHIPPED"];

export default function Orders({ historyOnly = false }) {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  async function loadOrders() {
    setError("");
    try {
      setOrders(await orderApi.all());
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const visibleOrders = historyOnly
    ? orders.filter((order) => !activeStatuses.includes(order.status))
    : orders.filter((order) => activeStatuses.includes(order.status));

  return (
    <section className="content-section">
      <div className="section-heading">
        <h1>{historyOnly ? "Order History" : "My Orders"}</h1>
        <span>{visibleOrders.length} orders</span>
      </div>
      <div className="order-tabs">
        <Link className={!historyOnly ? "active" : ""} to="/orders">My Orders</Link>
        <Link className={historyOnly ? "active" : ""} to="/order-history">Order History</Link>
      </div>
      {error && <div className="error">{error}</div>}
      {visibleOrders.length === 0 && <div className="notice">{historyOnly ? "No previous orders yet." : "No active orders right now."}</div>}
      <div className="orders-list">
        {visibleOrders.map((order) => (
          <article className="order-card" key={order.id}>
            <div className="order-head">
              <strong>Order #{order.id}</strong>
              <span>{order.status}</span>
              <span>₹{Number(order.totalAmount).toLocaleString("en-IN")}</span>
            </div>
            <div className="tracking">
              {activeStatuses.map((status) => (
                <span key={status} className={activeStatuses.indexOf(order.status) >= activeStatuses.indexOf(status) ? "done" : ""}>
                  {status}
                </span>
              ))}
              {order.status === "DELIVERED" && <span className="done">DELIVERED</span>}
              {order.status === "CANCELLED" && <span className="cancelled">CANCELLED</span>}
            </div>
            <p className="muted">Deliver to: {order.shippingAddress}</p>
            <p className="muted">Ordered on: {new Date(order.createdAt).toLocaleString()}</p>
            <div className="mini-products">
              {order.items.map((item) => (
                <div key={item.id}>
                  <img src={item.product.imageUrl} alt={item.product.name} />
                  <span>{item.product.name} x {item.quantity}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
