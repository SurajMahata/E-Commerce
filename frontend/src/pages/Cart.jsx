import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";

export default function Cart() {
  const { cart, updateQuantity, removeItem } = useCart();
  const items = cart.items || [];

  async function handleQuantityChange(itemId, quantity) {
    await updateQuantity(itemId, quantity);
    alert("Cart quantity updated");
  }

  async function handleRemove(itemId) {
    await removeItem(itemId);
    alert("Product removed from cart");
  }

  return (
    <section className="cart-page">
      <div className="cart-list">
        <h1>Shopping Cart</h1>
        {items.length === 0 && <div className="notice">Your cart is empty. <Link to="/products">Start shopping</Link></div>}
        {items.map((item) => (
          <article className="cart-item" key={item.id}>
            <img src={item.product.imageUrl} alt={item.product.name} />
            <div>
              <Link to={`/products/${item.product.id}`} className="product-title">{item.product.name}</Link>
              <p className="muted">{item.product.brand} | {item.product.category}</p>
              <strong>₹{Number(item.product.price).toLocaleString("en-IN")}</strong>
              <div className="cart-controls">
                <button disabled={item.quantity <= 1} onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                <span>{item.quantity}</span>
                <button disabled={item.quantity >= item.product.stock} onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                <button onClick={() => handleRemove(item.id)}>Remove</button>
              </div>
            </div>
          </article>
        ))}
      </div>
      <aside className="summary-box">
        <h2>Subtotal</h2>
        <strong>{cart.count || 0} items</strong>
        <div className="details-price">₹{Number(cart.total || 0).toLocaleString("en-IN")}</div>
        <Link className={`gold-button ${items.length === 0 ? "disabled" : ""}`} to="/checkout">Proceed to Buy</Link>
      </aside>
    </section>
  );
}
