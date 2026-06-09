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
    <section className="auth-page" data-testid="register-page">
      <form className="auth-card wide" data-testid="register-form" onSubmit={submit}>
        <h1 data-testid="register-title">Create account</h1>
        {error && <div className="error" role="alert" data-testid="auth-error">{error}</div>}
        <label>Your name<input data-testid="register-name" required value={form.name} onChange={(e) => update("name", e.target.value)} /></label>
        <label>Email<input data-testid="register-email" required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} /></label>
        <label>Password<input data-testid="register-password" required minLength="6" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} /></label>
        <label>Phone<input data-testid="register-phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} /></label>
        <label>Address<textarea data-testid="register-address" value={form.address} onChange={(e) => update("address", e.target.value)} /></label>
        <button className="gold-button" data-testid="register-submit">Register</button>
        <p>Already have an account? <Link data-testid="signin-link" to="/login">Sign in</Link></p>
      </form>
    </section>
  );
}
