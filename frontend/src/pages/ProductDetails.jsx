import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { productApi } from "../services/api.js";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    productApi.one(id).then(setProduct);
  }, [id]);

  async function buyNow() {
    if (!user) {
      navigate("/login");
      return;
    }
    if (isAdmin) {
      navigate("/admin/products");
      return;
    }
    await addToCart(product.id, quantity);
    alert("Product added to cart");
    navigate("/checkout");
  }

  async function handleAddToCart() {
    if (!user) {
      navigate("/login");
      return;
    }
    await addToCart(product.id, quantity);
    alert("Product successfully added to the cart");
  }

  if (!product) return <div className="notice">Loading product...</div>;

  return (
    <section className="details-layout">
      <div className="details-image">
        <img src={product.imageUrl} alt={product.name} />
      </div>
      <div className="details-main">
        <Link to="/products" className="crumb">Back to products</Link>
        <h1>{product.name}</h1>
        <div className="rating">{"★".repeat(Math.round(product.rating || 4))}<span>{product.rating} rating</span></div>
        <p className="description">{product.description}</p>
        <div className="details-price">₹{Number(product.price).toLocaleString("en-IN")}</div>
        {product.mrp && <p className="muted">MRP <del>₹{Number(product.mrp).toLocaleString("en-IN")}</del> inclusive of all taxes</p>}
        {isAdmin ? (
          <div className="buy-panel">
            <strong>Admin view</strong>
            <p className="muted">Cart and checkout are available only for customer accounts.</p>
            <button className="gold-button" onClick={() => navigate("/admin/products")}>Manage Products</button>
          </div>
        ) : (
          <div className="buy-panel">
            <strong>In stock: {product.stock}</strong>
            <label>
              Quantity
              <input type="number" min="1" max={product.stock} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
            </label>
            <button className="gold-button" onClick={handleAddToCart}>Add to Cart</button>
            <button className="orange-button" onClick={buyNow}>Buy Now</button>
          </div>
        )}
      </div>
    </section>
  );
}
