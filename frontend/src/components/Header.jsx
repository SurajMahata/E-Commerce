import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";

const categories = ["Electronics", "Audio", "Wearables", "Computers", "Home", "Cameras"];

export default function Header() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();

  function submitSearch(event) {
    event.preventDefault();
    navigate(`/products${search.trim() ? `?q=${encodeURIComponent(search.trim())}` : ""}`);
  }

  return (
    <header className="site-header">
      <div className="topbar">
        <Link to="/" className="logo">Shop<span>Verse</span></Link>
        <div className="delivery">
          <small>Deliver to</small>
          <strong>India</strong>
        </div>
        <form className="search-box" onSubmit={submitSearch}>
          <select aria-label="Category">
            <option>All</option>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search ShopVerse" />
          <button type="submit">Search</button>
        </form>
        <div className="header-actions">
          {user ? (
            <button className="account-button" onClick={logout}>
              <small>Hello, {user.name?.split(" ")[0]}</small>
              <strong>Logout</strong>
            </button>
          ) : (
            <Link className="account-button" to="/login">
              <small>Hello, sign in</small>
              <strong>Account</strong>
            </Link>
          )}
          {!isAdmin && (
            <Link className="account-button" to="/orders">
              <small>Track</small>
              <strong>My Orders</strong>
            </Link>
          )}
          {!isAdmin && (
            <Link className="account-button" to="/order-history">
              <small>Previous</small>
              <strong>History</strong>
            </Link>
          )}
          {!isAdmin && (
            <Link className="cart-link" to="/cart">
              <span>{cart.count || 0}</span>
              Cart
            </Link>
          )}
        </div>
      </div>
      <nav className="category-bar">
        <NavLink to="/products">All Products</NavLink>
        {categories.map((category) => (
          <NavLink key={category} to={`/products?category=${encodeURIComponent(category)}`}>{category}</NavLink>
        ))}
        {isAdmin && <NavLink to="/admin/products">Admin Products</NavLink>}
      </nav>
    </header>
  );
}
