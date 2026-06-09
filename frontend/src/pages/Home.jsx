import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard.jsx";
import { useEffect, useState } from "react";
import { productApi } from "../services/api.js";

const heroImage = "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=1800&q=80";

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productApi.all().then((data) => setProducts(data.slice(0, 6))).catch(() => setProducts([]));
  }, []);

  return (
    <div className="home-page" data-testid="home-page">
      <section className="hero" style={{ backgroundImage: `linear-gradient(110deg, rgba(15, 23, 42, .36), rgba(255, 255, 255, .08)), url(${heroImage})` }}>
        <div className="hero-copy">
          <span className="eyebrow">Fresh arrivals every day</span>
          <h1 data-testid="home-title">ShopVerse</h1>
          <p>Discover polished tech, home upgrades, audio favorites, and work essentials in one clean shopping experience.</p>
          <div className="hero-actions">
            <Link to="/products" className="hero-button">Shop today&apos;s picks</Link>
            <Link to="/products?category=Electronics" className="hero-link">Explore electronics</Link>
          </div>
        </div>
        <div className="hero-showcase" aria-label="ShopVerse highlights">
          <div>
            <strong>Secure checkout</strong>
            <span>Protected payments and simple order flow</span>
          </div>
          <div>
            <strong>Curated categories</strong>
            <span>Fast paths to the products shoppers expect</span>
          </div>
          <div>
            <strong>Popular picks</strong>
            <span>Featured items refreshed from the catalog</span>
          </div>
        </div>
      </section>
      <section className="feature-strip" aria-label="Store benefits">
        <div>
          <strong>Fast discovery</strong>
          <span>Browse by search or category</span>
        </div>
        <div>
          <strong>Trusted catalog</strong>
          <span>Clear pricing, ratings, and details</span>
        </div>
        <div>
          <strong>Easy cart</strong>
          <span>Add favorites without losing your place</span>
        </div>
      </section>
      <section className="promo-grid">
        <Link to="/products?category=Electronics">
          <span>Electronics</span>
          <strong>Smart devices and daily tech</strong>
        </Link>
        <Link to="/products?category=Home">
          <span>Home</span>
          <strong>Useful upgrades for every room</strong>
        </Link>
        <Link to="/products?category=Audio">
          <span>Audio</span>
          <strong>Speakers, headphones, and more</strong>
        </Link>
        <Link to="/products?category=Computers">
          <span>Computers</span>
          <strong>Work essentials built to perform</strong>
        </Link>
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
