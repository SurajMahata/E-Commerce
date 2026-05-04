import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "", address: "" });
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError("");
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="auth-page">
      <form className="auth-card wide" onSubmit={submit}>
        <h1>Create account</h1>
        {error && <div className="error">{error}</div>}
        <label>Your name<input required value={form.name} onChange={(e) => update("name", e.target.value)} /></label>
        <label>Email<input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></label>
        <label>Password<input required minLength="6" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} /></label>
        <label>Phone<input value={form.phone} onChange={(e) => update("phone", e.target.value)} /></label>
        <label>Address<textarea value={form.address} onChange={(e) => update("address", e.target.value)} /></label>
        <button className="gold-button">Register</button>
        <p>Already have an account? <Link to="/login">Sign in</Link></p>
      </form>
    </section>
  );
}
