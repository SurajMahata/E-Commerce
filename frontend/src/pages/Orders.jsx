import { useEffect, useState } from "react";
import { orderApi } from "../services/api.js";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    orderApi.all().then(setOrders);
  }, []);

  return (
    <section className="content-section">
      <div className="section-heading">
        <h1>Your Orders</h1>
        <span>{orders.length} orders</span>
      </div>
      {orders.length === 0 && <div className="notice">No orders yet.</div>}
      <div className="orders-list">
        {orders.map((order) => (
          <article className="order-card" key={order.id}>
            <div className="order-head">
              <strong>Order #{order.id}</strong>
              <span>{order.status}</span>
              <span>₹{Number(order.totalAmount).toLocaleString("en-IN")}</span>
            </div>
            <p className="muted">Deliver to: {order.shippingAddress}</p>
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
