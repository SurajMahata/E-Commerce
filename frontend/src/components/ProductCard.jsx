import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, isAdmin } = useAuth();
  const discount = product.mrp ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  async function handleAddToCart() {
    if (!user) {
      navigate("/login");
      return;
    }
    await addToCart(product.id, 1);
    alert("Product successfully added to the cart");
  }

  return (
    <article className="product-card">
      <Link to={`/products/${product.id}`} className="product-image-wrap">
        <img src={product.imageUrl} alt={product.name} />
      </Link>
      <div className="product-info">
        <Link to={`/products/${product.id}`} className="product-title">{product.name}</Link>
        <p>{product.description}</p>
        <div className="rating">{"★".repeat(Math.round(product.rating || 4))}<span>{product.rating}</span></div>
        <div className="price-row">
          <strong>₹{Number(product.price).toLocaleString("en-IN")}</strong>
          {product.mrp && <del>₹{Number(product.mrp).toLocaleString("en-IN")}</del>}
          {discount > 0 && <span className="deal">{discount}% off</span>}
        </div>
        <Link to={`/products/${product.id}`} className="light-button">View Details</Link>
        {!isAdmin && (
          <button onClick={handleAddToCart} className="gold-button">
            {user ? "Add to Cart" : "Login to Add"}
          </button>
        )}
      </div>
    </article>
  );
}
