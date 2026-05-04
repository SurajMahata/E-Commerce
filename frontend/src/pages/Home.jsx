import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { useEffect, useState } from "react";
import { productApi } from "../services/api.js";

const heroImage = "https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&w=1800&q=80";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productApi.all().then((data) => setProducts(data.slice(0, 6))).catch(() => setProducts([]));
  }, []);

  return (
    <div className="home-page">
      <section className="hero" style={{ backgroundImage: `linear-gradient(90deg, rgba(19,25,33,.92), rgba(19,25,33,.25)), url(${heroImage})` }}>
        <div>
          <h1>ShopVerse</h1>
          <p>Fast deals, trusted products, secure checkout, and a complete full-stack ecommerce experience.</p>
          <Link to="/products" className="hero-button">Shop today&apos;s picks</Link>
        </div>
      </section>
      <section className="promo-grid">
        <Link to="/products?category=Electronics">Electronics deals</Link>
        <Link to="/products?category=Home">Home upgrades</Link>
        <Link to="/products?category=Audio">Audio favorites</Link>
        <Link to="/products?category=Computers">Work essentials</Link>
      </section>
      <section className="content-section">
        <div className="section-heading">
          <h2>Popular products</h2>
          <Link to="/products">See all</Link>
        </div>
        <div className="product-grid">
          {products.map((product) => <ProductCard key={product.id} product={product} />)}
        </div>
      </section>
    </div>
  );
}
