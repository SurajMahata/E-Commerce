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
        <Link to="/" className="logo" data-testid="site-logo">Shop<span>Verse</span></Link>
        <form className="search-box" data-testid="header-search-form" onSubmit={submitSearch}>
          <select aria-label="Category">
            <option>All</option>
            {categories.map((category) => <option key={category}>{category}</option>)}
          </select>
          <input data-testid="header-search-input" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search ShopVerse" />
          <button data-testid="header-search-submit" type="submit">Search</button>
        </form>
        <div className="header-actions">
          {user ? (
            <div className="account-menu">
              <Link className="account-button" data-testid="security-link" to="/update-password">
                <small>Hello, {user.name?.split(" ")[0]}</small>
                <strong>Security</strong>
              </Link>
              {!isAdmin && (
                <Link className="account-button" data-testid="profile-link" to="/profile">
                  <small>Account</small>
                  <strong>Profile</strong>
                </Link>
              )}
              <button className="account-button logout-button" data-testid="logout-button" onClick={logout}>
                <small>Account</small>
                <strong>Logout</strong>
              </button>
            </div>
          ) : (
            <Link className="account-button" data-testid="signin-header-link" to="/login">
              <small>Hello, sign in</small>
              <strong>Account</strong>
            </Link>
          )}
          {!isAdmin && (
            <Link className="account-button" data-testid="orders-link" to="/orders">
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
            <Link className="cart-link" data-testid="cart-link" to="/cart">
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
        {isAdmin && <NavLink data-testid="admin-products-link" to="/admin/products">Admin Products</NavLink>}
      </nav>
    </header>
  );
}
